<?php
use AmazeeLabs\DefaultContent\Import;
use Drupal\Component\Serialization\Yaml;
use Drupal\webform\Entity\Webform;

if (PHP_SAPI !== 'cli') {
  die;
}

Import::run('test_content');

// Import webforms.
foreach (glob(__DIR__ . '/webforms/*.yml') as $file) {
  Webform::create(Yaml::decode(file_get_contents($file)))->save();
}
