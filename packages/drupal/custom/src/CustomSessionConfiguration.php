<?php

namespace Drupal\custom;

use Drupal\Core\Session\SessionConfiguration;
use Drupal\Core\Session\SessionConfigurationInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Decorator for the core session configuration service.
 */
class CustomSessionConfiguration extends SessionConfiguration {
  protected function getUnprefixedName(Request $request) {
    $cleaned = clone $request;
    $cleaned->headers->remove('X-Forwarded-Proto');
    $cleaned->headers->remove('X-Forwarded-Host');
    $cleaned->headers->remove('X-Forwarded-Port');
    return parent::getUnprefixedName($cleaned);
  }
}