<?php
use AmazeeLabs\DefaultContent\Export;

if (PHP_SAPI !== 'cli') {
  die;
}

// The list of excluded content entity types.
$excluded = [
  // Path aliases are created automatically on the node creation. They cause
  // troubles if exported to the default content.
  'path_alias',
  'content_moderation_state',
  'redirect',
  'webform_submission',
];

Export::run('test_content', $excluded);

// Get rid of generic icons. Drupal creates them on demand.
foreach (glob(__DIR__ . '/content/file/*.yml') as $file) {
  $content = file_get_contents($file);
  if (str_contains($content, 'public://media-icons/generic')) {
    unlink($file);
  }
}
foreach (glob(__DIR__ . '/content/file/generic*.png') as $file) {
  unlink($file);
}
