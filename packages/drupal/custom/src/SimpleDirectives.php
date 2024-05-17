<?php

namespace Drupal\custom;

use Drupal\Component\Datetime\DateTimePlus;
use Drupal\graphql_directives\DirectiveArguments;

class SimpleDirectives {

  public static function fromJsDatetime(DirectiveArguments $args): ?string {
    $datetime = trim((string) $args->args['datetime']);
    if (!$datetime) {
      return NULL;
    }
    return DateTimePlus::createFromFormat(
      'Y-m-d\TH:i',
      $datetime,
      \Drupal::config('system.date')->get('timezone.default')
    )?->format('c');
  }

}
