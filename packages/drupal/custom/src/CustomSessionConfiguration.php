<?php

namespace Drupal\custom;

use Drupal\Core\Session\SessionConfiguration;
use Drupal\Core\Session\SessionConfigurationInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Decorator for the core session configuration service.
 */
class CustomSessionConfiguration extends SessionConfiguration {

  /* @var \Drupal\Core\Session\SessionConfigurationInterface */
  protected $sessionConfigurationInner;

  /**
   * Creates a CaritasSessionConfiguration object.
   */
  public function __construct(SessionConfigurationInterface $session_configuration_inner, $options = []) {
    $this->sessionConfigurationInner = $session_configuration_inner;
    parent::__construct($options);
  }

  /**
   * {@inheritDoc}
   */
  public function getOptions(Request $request) {
    $options = parent::getOptions($request);
    if ($request->isSecure()) {
      $options['cookie_samesite'] = 'None';
      if ($cookie_domain = getenv('COOKIE_DOMAIN')) {
        $options['cookie_domain'] = $cookie_domain;
      }
    }
    return $options;
  }

}