<?php

namespace Drupal\silverback_ai_import\Plugin\AiImport;

use Drupal\Core\Plugin\PluginBase;
use Drupal\silverback_ai_import\AiImportPluginManagerInterface;

/**
 * Provides a markdown header to gutenberg block convert plugin.
 *
 * @Plugin(
 *   id = "ai_header",
 *   label = @Translation("Markdown header convert plugin"),
 *   weight = 0,
 * )
 */
class HeaderImportPlugin extends PluginBase implements AiImportPluginManagerInterface {

  /**
   * The schema to use.
   *
   * @var array
   */
  private array $schema = [];

  /**
   * The template to use.
   *
   * @var string
   */
  private string $template;

  /**
   * Constructs a \Drupal\Component\Plugin\PluginBase object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    $this->configuration = $configuration;
    $this->pluginId = $plugin_id;
    $this->pluginDefinition = $plugin_definition;
    $this->schema = $this->getSchema();
    $this->template = $this->getTemplate();
  }

  /**
   * Get a description if the plugin.
   */
  public function description() {
    return $this->t('Convert markdown to Gutenberg block.');
  }

  /**
   * {@inheritDoc}
   */
  public function getSchema() {
    return [
      'headingText' => 'string',
      'headingLevel' => 'number, 2 or 3 or 4. Any other number should be converted to 2.',
      'headerHtmlTag' => 'h2 or h3 or h4. Any other header should be converted to h2.',
    ];
  }

  /**
   * {@inheritDoc}
   */
  public function getTemplate() {
    return <<<EOD
    <!-- wp:custom/heading {"level":headingLevel,"text":"headingText"} -->
    <headerHtmlTag class="wp-block-custom-heading">headingText</headerHtmlTag>
    <!-- /wp:custom/heading -->
    EOD;
  }

  /**
   * {@inheritDoc}
   */
  public function matches(array $chunk) {
    // @todo Implement the match logic here.
    if ($chunk['type'] == 'Header') {
      return TRUE;
    }
    return FALSE;
  }

  /**
   * {@inheritDoc}
   */
  public function convert(array $chunk) {
    // We are using some custom method here.
    // @todo Add a validation method.
    return $this->generateBlock($chunk, $this->template);
  }

  /**
   * Parses a markdown header string and returns details about it.
   *
   * This method trims whitespace from the header string, matches a specific
   * markdown heading pattern, determines the heading level based on the number
   * of '#' characters, and generates the corresponding HTML tag for the header.
   *
   * The resulting heading level is constrained between 2 and 4 based on custom rules.
   *
   * @param string $header
   *   The markdown header string to parse.
   *
   * @return array
   *   An associative array.
   *
   * @throws \InvalidArgumentException if the header is not in a valid markdown format.
   */
  private function parseMarkdownHeader(string $header): array {
    // Trim whitespace.
    $header = trim($header);

    // Match the heading pattern.
    if (!preg_match('/^(#{1,6})\s+(.+)$/', $header, $matches)) {
      throw new \InvalidArgumentException('Invalid markdown header format');
    }

    // Get the number of # symbols to determine heading level.
    $level = strlen($matches[1]);

    // Restrictions from the custom/header SLB block.
    if ($level == 1) {
      $level = 2;
    }

    if ($level > 4) {
      $level = 4;
    }

    // Get the actual heading text.
    $text = trim($matches[2]);

    // Create the corresponding HTML tag.
    $headerHtmlTag = 'h' . $level;

    return [
      'headingText' => $text,
      'headingLevel' => $level,
      'headerHtmlTag' => $headerHtmlTag,
    ];
  }

  /**
   * Generates a block string by replacing template placeholders with parsed header data.
   *
   * This function takes a chunk of markdown content and a template string. It uses
   * the parsed data from the markdown header to replace placeholders in the template
   * with actual values corresponding to the markdown header's level, text, and HTML tag.
   * Before processing, it ensures that all required keys are available in the parsed data.
   *
   * @param array $chunk
   *   An associative array containing the raw markdown data.
   *   - 'raw': The raw markdown string used for parsing the header.
   *
   * @param string $template
   *   The template string containing placeholders for replacement.
   *
   * @return string The template string with placeholders replaced by actual data.
   *
   * @throws \InvalidArgumentException if a required key is missing from the parsed data.
   */
  private function generateBlock(array $chunk, string $template): string {

    $data = $this->parseMarkdownHeader($chunk['raw']);
    // Validate required keys.
    $required_keys = array_keys($this->getSchema());
    foreach ($required_keys as $key) {
      if (!isset($data[$key])) {
        throw new \InvalidArgumentException("Missing required key: {$key}");
      }
    }

    // Create replacement pairs.
    $replacements = [
      'headingLevel' => $data['headingLevel'],
      'headingText' => $data['headingText'],
      'headerHtmlTag' => $data['headerHtmlTag'],
    ];

    // Perform replacements.
    $result = $template;
    foreach ($replacements as $key => $value) {
      $result = str_replace($key, $value, $result);
    }

    return $result;
  }

}
