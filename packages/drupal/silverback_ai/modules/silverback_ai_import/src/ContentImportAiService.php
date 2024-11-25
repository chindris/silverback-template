<?php

declare(strict_types=1);

namespace Drupal\silverback_ai_import;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\file\FileInterface;
use Drupal\silverback_ai\HttpClient\OpenAiHttpClient;
use GuzzleHttp\Exception\RequestException;

/**
 * @todo Add class description.
 */
final class ContentImportAiService {

  private const DEFAULT_AI_MODEL = 'gpt-4o-mini';

  /**
   * Constructs a ContentImportAiService object.
   */
  public function __construct(
    private readonly RouteMatchInterface $routeMatch,
    private readonly AccountProxyInterface $currentUser,
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly LoggerChannelFactoryInterface $loggerFactory,
    private readonly ConfigFactoryInterface $configFactory,
    private readonly OpenAiHttpClient $silverbackAiOpenaiHttpClient,
    private readonly AiImportPluginManager $pluginManager,
  ) {}

  /**
   *
   */
  public function processChunk($chunk) {
    // Convert to array.
    $chunk = json_decode(json_encode($chunk), TRUE);
    $result = NULL;
    $schema = NULL;
    $template = NULL;

    $type = $chunk['type'];
    $ast = json_encode($chunk);

    $plugin = $this->getPlugin($chunk);

    // @todo Modify these according to type
    if ($type == 'Header') {
      return $plugin->convert($chunk);
    }

    if ($type == 'Paragraph') {
      $template = <<<EOD
      <!-- wp:paragraph -->
      <p>paragraphText</p>
      <!-- /wp:paragraph -->
      EOD;
      $schema = json_encode([
        'paragraphText' => 'html',
      ]);

      $html = $chunk['htmlValue'];
      $return = <<<EOD
      <!-- wp:paragraph -->
      <p>$html</p>
      <!-- /wp:paragraph -->
      EOD;
      return $return;

    }

    if ($type == 'List') {
      $template = <<<EOD
      <!-- wp:list -->
      listItems
      <!-- /wp:list -->
      EOD;
      $schema = json_encode([
        'listItems' => 'html',
      ]);

      $html = $chunk['htmlValue'];
      $return = <<<EOD
      <!-- wp:list -->
      $html
      <!-- /wp:list -->
      EOD;
      return $return;
    }

    if ($type == 'Table') {
      $template = <<<EOD
      <!-- wp:table -->
      <figure class="wp-block-table">htmlTable</figure>
      <!-- /wp:table -->
      EOD;
      $schema = json_encode([
        'htmlTable' => 'html',
      ]);

      $html = $chunk['htmlValue'];
      $return = <<<EOD
      <!-- wp:table -->
      <figure class="wp-block-table">$html</figure>
      <!-- /wp:table -->
      EOD;
      return $return;
    }

    if ($type == 'Image') {
      $src = $chunk['src'];
      $media = $this->createMediaImageFromPath($src);
      if ($media) {
        $mid = $media->id();
        $return = <<<EOD
        <!-- wp:custom/image-with-text {"mediaEntityIds":["$mid"]} -->
        <!-- wp:paragraph -->
        <p></p>
        <!-- /wp:paragraph -->
        <!-- /wp:custom/image-with-text -->
        EOD;
        return $return;
      }

      $return = <<<EOD
      <!-- wp:custom/image-with-text {"mediaEntityIds":[]} -->
      <!-- wp:paragraph -->
      <p></p>
      <!-- /wp:paragraph -->
      <!-- /wp:custom/image-with-text -->
      EOD;
      return $return;

    }

    // @todo Also this should be a batch process
    if (!empty($schema) && !empty($template)) {
      $data = $this->sendOpenAiRequest($ast, $type, $template, $schema);
      if (isset($data['choices'][0]['message']['content'])) {
        $result = $data['choices'][0]['message']['content'];
      }
    }
    return $result;
  }

  /**
   *
   */
  public function getAstFromFilePath(FileInterface $file) {
    $uri = $file->getFileUri();
    $stream_wrapper_manager = \Drupal::service('stream_wrapper_manager')->getViaUri($uri);
    $file_path = $stream_wrapper_manager->realpath();

    // @todo Use some configuration values here for the service
    $client = \Drupal::httpClient();
    try {
      $response = $client->request('GET', 'http://localhost:3000/convert?path=' . $file_path, [
        'headers' => [
          'Accept' => 'application/json',
        ],
      ]);
      $body = $response->getBody()->getContents();
      $response = json_decode($body);
    }
    catch (RequestException $e) {
      // Handle any errors.
      \Drupal::logger('silverback_ai_import')->error($e->getMessage());
    }
    return $response;
  }

  /**
   *
   */
  public function extractData(string $ast, string $schema) {
    // @todo Get some of these from settings
    $model = $this->configFactory->get('silverback_image_ai.settings')->get('ai_model') ?: self::DEFAULT_AI_MODEL;

    $prompt = <<<EOD
    You are a precise JSON data extraction and template rendering assistant. Follow these steps carefully:

    Input Context:
    $ast

    1. Input Validation:
    - Verify the input AST node is valid JSON
    - Confirm the schema matches the expected extraction requirements
    - Validate that all required keys in the schema exist in the AST

    2. Data Extraction:
    - Extract ONLY the values specified in the following schema from the AST node:
    $schema

    - Ensure type consistency with the schema definition
    - If a required value is missing, return a clear error message

    Return only JSON, following the given schema.

    Important Constraints:
    - Case-sensitive matching
    - Strict type checking
    - No modifications to template structure
    - Complete token replacement
    EOD;

    $payload = [
      'model' => $model,
      'messages' => [
        [
          'role' => 'user',
          'content' => [
                [
                  'type' => 'text',
                  'text' => $prompt,
                ],
          ],
        ],
      ],
    ];

    try {
      $response = $this->silverbackAiOpenaiHttpClient->post('chat/completions', [
        'json' => $payload,
      ]);
    }
    catch (\Exception $e) {
      throw new \Exception('HTTP request failed: ' . $e->getMessage());
    }

    $responseBodyContents = $response->getBody()->getContents();
    return json_decode($responseBodyContents, TRUE, 512, JSON_THROW_ON_ERROR);
  }

  /**
   *
   */
  public function sendOpenAiRequest(string $ast, string $type, string $template, string $schema) {
    // @todo Get some of these from settings
    $model = $this->configFactory->get('silverback_image_ai.settings')->get('ai_model') ?: self::DEFAULT_AI_MODEL;

    $prompt = <<<EOD
    You are a precise JSON data extraction and template rendering assistant. Follow these steps carefully:

    Input Context:
    $ast

    1. Input Validation:
    - Verify the input AST node is valid JSON
    - Confirm the schema matches the expected extraction requirements
    - Validate that all required keys in the schema exist in the AST

    2. Data Extraction:
    - Extract ONLY the values specified in the following schema from the AST node:
    $schema

    - Ensure type consistency with the schema definition
    - If a required value is missing, return a clear error message

    3. Template Rendering:
    - Replace tokens in the following template using extracted values:
      $template

    - Ensure the resulting HTML is well-formed
    - Preserve all original comments
    - Validate that all placeholders are replaced
    - Convert the htmlTable variable (if exists) to HTML

    4. Output Requirements:
    - Return ONLY the final rendered template, nothing else
    - Maintain the original comments
    - Do not include any additional text, explanations, or metadata
    - The output should be valid HTML, including comments, do not include markdown code block

    Important Constraints:
    - Case-sensitive matching
    - Strict type checking
    - No modifications to template structure
    - Complete token replacement
    EOD;

    $payload = [
      'model' => $model,
      'messages' => [
        [
          'role' => 'user',
          'content' => [
                [
                  'type' => 'text',
                  'text' => $prompt,
                ],
          ],
        ],
      ],
    ];

    try {
      $response = $this->silverbackAiOpenaiHttpClient->post('chat/completions', [
        'json' => $payload,
      ]);
    }
    catch (\Exception $e) {
      throw new \Exception('HTTP request failed: ' . $e->getMessage());
    }

    $responseBodyContents = $response->getBody()->getContents();
    return json_decode($responseBodyContents, TRUE, 512, JSON_THROW_ON_ERROR);
  }

  /**
   * Creates a file entity and a media image entity from a given image path.
   *
   * @param string $image_path
   *   The server path to the image file.
   * @param string $media_bundle
   *   The media bundle type (optional, defaults to 'image').
   * @param int $user_id
   *   The user ID to associate with the created entities (optional, defaults to current user).
   *
   * @return \Drupal\media\MediaInterface|null
   *   The created media entity, or NULL if creation fails.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function createMediaImageFromPath($image_path, $media_bundle = 'image', $user_id = NULL) {
    // Ensure the file exists.
    if (!file_exists($image_path)) {
      \Drupal::logger('image_import')->error('File does not exist: @path', ['@path' => $image_path]);
      return NULL;
    }

    // Get the current user if no user ID is provided.
    if ($user_id === NULL) {
      $user_id = \Drupal::currentUser()->id();
    }

    // Prepare the file.
    $file_uri = 'public://' . basename($image_path);

    try {
      // Create file entity.
      $file = \Drupal::service('file.repository')->writeData(
      file_get_contents($image_path),
      $file_uri,
      FileSystemInterface::EXISTS_REPLACE
      );

      // Set file status to permanent.
      if ($file) {
        $file->setPermanent();
        $file->save();
      }
      else {
        \Drupal::logger('image_import')->error('Failed to create file entity for: @path', ['@path' => $image_path]);
        return NULL;
      }

      // Create media entity.
      $media_storage = \Drupal::entityTypeManager()->getStorage('media');
      /** @var  \Drupal\media\Entity\media $media */
      $media = $media_storage->create([
        'bundle' => $media_bundle,
        'name' => $file->getFilename(),
        'uid' => $user_id,
        'status' => 1,
        'field_media_image' => [
          'target_id' => $file->id(),
          // @todo Improve alt text generation.
          'alt' => $file->getFilename(),
          'title' => $file->getFilename(),
        ],
      ]);

      $media->save();
      return $media;
    }
    catch (\Exception $e) {
      \Drupal::logger('image_import')->error('Error creating media entity: @error', ['@error' => $e->getMessage()]);
      return NULL;
    }
  }

  /**
   *
   */
  private function getPlugin($chunk) {
    $selected_plugin = $this->pluginManager->createInstance('ai_default');
    $definitions = $this->pluginManager->getDefinitions();
    // @todo Order by weight.
    foreach ($definitions as $definition) {
      $plugin = $this->pluginManager->createInstance($definition['id']);
      if ($plugin->matches($chunk)) {
        $selected_plugin = $plugin;
        break;
      }
    }
    return $selected_plugin;
  }

}
