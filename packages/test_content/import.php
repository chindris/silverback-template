<?php
use AmazeeLabs\DefaultContent\Import;

if (PHP_SAPI !== 'cli') {
  die;
}

Import::run('test_content');
