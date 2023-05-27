<?php
/** @var \Drupal\silverback_translations\TranslationsProcessorInterface $processor */
$processor = \Drupal::service('silverback_translations.json_processor');
$sources = file_get_contents('../generated/translatables.json');
$processor->createSources($sources, 'gatsby');
