<?php

$amount = 200;
$total = $amount * 100;

echo "Gonna create $total pages.\n";

for ($i = 1; $i <= $amount; $i++) {

  // The more pages we create in a single run, the slower Drupal works and the
  // more memory is eaten by PHP. So we create pages in batches.
  exec('../vendor/bin/drush php:script ' . __DIR__ . '/create-100-pages.php');

  if ($i !== 1) {
    echo "\r";
  }
  $percent = number_format(100 * $i / $amount, 2);
  echo "Progress $percent%";
}

echo "\nDone!\n";
