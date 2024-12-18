<?php

declare(strict_types=1);

namespace Drupal\silverback_ai_import;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\file\Entity\File;
use Drupal\file\FileInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\silverback_ai\HttpClient\OpenAiHttpClient;
use GuzzleHttp\Exception\RequestException;

/**
 * @todo Add class description.
 */
final class ContentImportAiService {

  private const DEFAULT_AI_MODEL = 'gpt-4o-mini';
  private const ADMINISTRATOR_ID = 1;

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
    $parse_service_url = $this->configFactory->get('silverback_ai_import.settings')->get('converter_service_url');

    $client = \Drupal::httpClient();
    try {
      // @todo For now this is working only for docx files.
      $response = $client->request('GET', "{$parse_service_url}/convert?path={$file_path}", [
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
  public function getAstFromUrl(string $url) {
    $parse_service_url = $this->configFactory->get('silverback_ai_import.settings')->get('converter_service_url');
    $client = \Drupal::httpClient();
    try {
      // @todo For now this is working only for docx files.
      $response = $client->request('GET', "{$parse_service_url}/html-convert?path={$url}", [
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
   * {Helper method}
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
   * {Helper method}
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
   * {Helper method}
   */
  public function extractBaseDataFromMarkdown(string $markdown) {
    // @todo Get some of these from settings
    $model = $this->configFactory->get('silverback_image_ai.settings')->get('ai_model') ?: self::DEFAULT_AI_MODEL;

    $prompt = <<<EOD
    You are an expert Markdown data extraction assistant. Your task is to analyze and extract specific information from provided Markdown text.

    Input Markdown Context:
    $markdown

    Follow these steps carefully:

    1. Extract the following information from the markdown:
    - Title
    - Language (in language code format, e.g. EN, EL etc)

    2. Format your output strictly as JSON using this template:
      {
        'title' : extracted_title,
        'language' : extracted_langcode,
      }

    Rules:
    - Only return the JSON output.
    - The output should be valid JSON, not markdown.
    - Ensure the language code adheres to ISO 639-1 format.
    - Be precise and concise in extracting the required information.
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
   * @param array $chunk
   *   The input data that will be used to match against plugin definitions.
   *
   * @return object
   *   The plugin instance that matches the provided chunk or the default
   *   plugin if no matches are found.   *   *   *   *   *   *   *   *   *   *   *   *   *
   */
  public function getPlugin(array $chunk) {
    $default_plugin = $this->pluginManager->createInstance('ai_default');
    $definitions = $this->pluginManager->getDefinitions();
    // @todo Order by weight.
    foreach ($definitions as $definition) {
      $plugin = $this->pluginManager->createInstance($definition['id'], ['chunk' => $chunk]);
      if ($plugin->matches($chunk)) {
        $default_plugin = $plugin;
        break;
      }
    }
    return $default_plugin;
  }

  /**
   * Flattens a hierarchical AST (Abstract Syntax Tree) into a linear array of nodes.
   *
   * This function converts a nested AST structure into a flat array where each node
   * is assigned a unique ID and maintains a reference to its parent. It processes
   * specific node types differently and handles recursive traversal of child nodes.
   *
   * @param array|null $ast
   *   The AST structure to flatten.
   * @param int|null $parent
   *   The ID of the parent node (used in recursion)
   *
   * @return array An array of flattened nodes, where each node contains:
   *   - type: The capitalized node type
   *               - id: A unique identifier
   *               - parent: Reference to the parent node's ID
   *               - Additional properties specific to each node type
   */
  public function flattenAst($ast, $parent = NULL) {

    $ast = json_decode(json_encode($ast), TRUE);
    static $flatNodes = [];
    static $id;

    if ($ast === NULL) {
      return $flatNodes;
    }

    foreach ($ast as $chunk) {
      if (isset($chunk['type'])
        && in_array($chunk['type'], [
          'Strong',
          'Text',
          'ListItem',
          'Emphasis',
        ])) {
        continue;
      }

      if (isset($chunk['type'])
        && $chunk['type'] == 'Link'
        && isset($chunk['children'])
        && count($chunk['children']) == 1
        && $chunk['children'][0]['type'] !== 'Image'
        ) {
        continue;
      }

      $children = $chunk['children'] ?? [];
      // unset($chunk['children']);
      // Chunk preprocessing.
      $chunk['type'] = ucfirst($chunk['type']);
      $chunk['id'] = ++$id;
      $chunk['parent'] = $parent;

      $flatNodes[] = $chunk;
      // Recursively process children.
      foreach ($children as $child) {
        $this->flattenAst([$child], $id);
      }
    }

    return $flatNodes;
  }

  /**
   *
   */
  public function iterateArray(array &$data, int $depth = 0): void {
    foreach ($data as &$item) {
      // Process item here.
      if (isset($item['type'])) {
        if ($item['type'] == 'Image') {
          $item['gutenberg'] = $this->processChunk($item);
        }
      }
      if (isset($item['children']) && is_array($item['children'])) {
        $this->iterateArray($item['children'], $depth + 1);
      }
    }

  }

  /**
   * Extracts various metadata from a given URL by fetching and parsing its HTML content.
   *
   * This function attempts to retrieve the HTML content of a URL and extract key information
   * including title, path, meta tags, and language settings. It includes error handling for
   * various failure scenarios.
   *
   * @param string $url
   *   The URL to extract data from.
   *
   * @return array An associative array containing:
   *   - title: string|null The page title if found
   *               - path: string The URL path component, defaults to "/" if not found
   *               - metatags: array Meta tag name-content pairs
   *               - language: string|null The page language if specified
   *               - error: string|null Error message if any error occurred, null otherwise
   *
   * @throws \Exception Caught internally and returned as error in result array
   */
  public function extractPageDataFromUrl($url) {
    $data = [
      'title' => NULL,
      'path' => NULL,
      'metatags' => [],
      'language' => NULL,
    // Add an error key.
      'error' => NULL,
    ];

    // Validate URL.
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
      $data['error'] = "Invalid URL";
      return $data;
    }

    try {
      // Use file_get_contents with a user agent to avoid being blocked by some servers.
      $options = [
        'http' => [
          'method' => 'GET',
      // Example user agent.
          'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      // Timeout in seconds.
          'timeout' => 10,
        ],
      ];
      $context = stream_context_create($options);
      // Use @ to suppress warnings for invalid URLs or network issues.
      $html = @file_get_contents($url, FALSE, $context);

      if ($html === FALSE) {
        $error = error_get_last();
        $data['error'] = "Failed to fetch URL: " . ($error ? $error['message'] : "Unknown error");
        return $data;
      }

      // Extract Title.
      if (preg_match('/<title>(.*?)<\/title>/i', $html, $matches)) {
        $data['title'] = trim(html_entity_decode($matches[1]));
      }

      // Extract Path.
      $data['path'] = parse_url($url, PHP_URL_PATH);
      if ($data['path'] === NULL) {
        // Handle cases where there's no path.
        $data['path'] = "/";
      }

      // Extract Meta Tags.
      preg_match_all('/<meta\s+(?:name|http-equiv)="([^"]*)"\s+content="([^"]*)"/i', $html, $matches);
      for ($i = 0; $i < count($matches[0]); $i++) {
        $name = strtolower($matches[1][$i]);
        $data['metatags'][$name] = trim(html_entity_decode($matches[2][$i]));
      }

      // Extract Language.
      if (preg_match('/<html.*?lang="([^"]*)"/i', $html, $matches)) {
        $data['language'] = $matches[1];
      }
      elseif (preg_match('/<meta\s+http-equiv="Content-Language"\s+content="([^"]*)"/i', $html, $matches)) {
        $data['language'] = $matches[1];
      }

    }
    catch (\Exception $e) {
      $data['error'] = "An error occurred: " . $e->getMessage();
    }

    return $data;
  }

  /**
   *
   */
  public function createEntityFromDocxAst($ast) {
    $markdown = file_get_contents($ast->outputDirectory . '/content.md');
    $data = $this->extractBaseDataFromMarkdown($markdown);
    // @todo Surround with try-catch
    if (isset($data['choices'][0]['message']['content'])) {
      $data = json_decode($data['choices'][0]['message']['content'], TRUE);
      $entity = Node::create([
        'type' => 'page',
        'title' => $data['title'],
        'langcode' => strtolower($data['language']),
      ]);
      $entity->save();
      return $entity;
    }
    return NULL;
  }

  /**
   *
   */
  public function createEntityFromUrl($url) {
    $data = $this->extractPageDataFromUrl($url);
    // @todo Handle exceptions
    if (!empty($data['title']) && !empty($data['language'])) {
      $entity = Node::create([
        'type' => 'page',
        'title' => $data['title'],
        'langcode' => strtolower($data['language']),
      ]);
      $entity->save();
      return $entity;
    }
    return NULL;
  }

  /**
   *
   */
  public function createFileEntityFromDropzoneData($file_data) {
    // @todo Handle exceptions
    $filepath = $file_data['uploaded_files'][0]['path'];
    $directory = 'public://converted';
    $file_system = \Drupal::service('file_system');
    $file_system->prepareDirectory($directory, FileSystemInterface:: CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS);
    $file_system->copy($filepath, $directory . '/' . basename($filepath), FileSystemInterface::EXISTS_REPLACE);

    $file = File::create([
      'filename' => basename($filepath),
      'uri' => "{$directory}/" . basename($filepath),
      'status' => NodeInterface::PUBLISHED,
      'uid' => $this->currentUser->id() ?? self::ADMINISTRATOR_ID,
    ]);
    $file->setPermanent();
    $file->save();
    return $file;
  }

}
