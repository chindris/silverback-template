<?php
use AmazeeLabs\DefaultContent\Import;
use Drupal\Component\Serialization\Yaml;
use Drupal\webform\Entity\Webform;

if (PHP_SAPI !== 'cli') {
  die;
}

Import::run('test_content');

// Webforms are ignored from the config. Create an example form now.
var_dump(getcwd());
Webform::create(Yaml::decode(file_get_contents(
  'modules/custom/test_content/contact-webform.yml'
)))->save();
