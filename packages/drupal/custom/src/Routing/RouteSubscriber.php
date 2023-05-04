<?php

namespace Drupal\custom\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    if ($route = $collection->get('key_auth.user_key_auth_form')) {
      $route->setRequirement('_custom_access', '_custom_key_auth_form_access');
    }
  }

}
