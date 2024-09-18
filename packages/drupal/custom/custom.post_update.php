<?php

use Drupal\locale\Gettext;

/**
 * Implements hook_post_update_NAME().
 */
function custom_post_update_import_string_translations() {
  /** @var \Drupal\Core\Extension\ModuleExtensionList $modules */
  $modules = \Drupal::service('extension.list.module');

  Gettext::fileToDatabase(
    (object)[
      'langcode' => 'de',
      'uri' => $modules->getPath('custom') . '/translations/de.po',
    ],
    [
      'customized' => LOCALE_CUSTOMIZED,
    ]
  );
}