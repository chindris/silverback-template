<?php

declare(strict_types=1);

namespace Drupal\silverback_ai_import;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
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
    $plugin = $this->getPlugin($chunk);
    return $plugin->convert($chunk);
  }

  /**
   * Retrieves the AST (Abstract Syntax Tree) from a given file path using an HTTP service.
   *
   * @param \Drupal\file\FileInterface $file
   *   The file for which to generate the AST.
   *
   * @return mixed
   *   The decoded JSON response containing the AST from the external service, or NULL if the request fails.
   *
   * @throws \GuzzleHttp\Exception\RequestException
   *   Thrown when the HTTP request fails, though it is caught and logged within this method.
   *
   * @todo Implement configuration handling for service endpoints or client headers.
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
   * Retrieves a plugin instance that matches the specified chunk.
   *
   * This method creates an instance of the default AI plugin and then
   * iterates through all available plugin definitions to find a plugin
   * that matches the provided chunk. The first matching plugin instance
   * will be selected and returned.
   *
   * @todo Order the plugin definitions by weight before attempting to find a match.
   *
   * @param mixed $chunk
   *   The input data that will be used to match against plugin definitions.
   *
   * @return object
   *   The plugin instance that matches the provided chunk or the default
   *   plugin if no matches are found.   *   *   *   *   *   *   *   *   *   *   *   *   *
   */
  public function getPlugin($chunk) {
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
