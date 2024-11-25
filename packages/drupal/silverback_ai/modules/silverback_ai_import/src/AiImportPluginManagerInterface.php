<?php

namespace Drupal\silverback_ai_import;

/**
 * An interface for all Sandwich type plugins.
 */
interface AiImportPluginManagerInterface {

  /**
   * Provide a description of the plugin.
   *
   * @return string
   *   A string description of the sandwich.
   */
  public function description();

  /**
   * Defines the schema (attributes) of the block.
   */
  public function getSchema();

  /**
   * Defines the template (gutenberg) of the block.
   */
  public function getTemplate();

  /**
   * If the current plugin matches the given chunk.
   *
   * @return bool
   *   true if matches, false otherwise.
   */
  public function matches(array $chunk);

  /**
   * If the current plugin matches the given chunk.
   *
   * @return string
   *   A string representation of the gutenberg block.
   */
  public function convert(array $chunk);

}
