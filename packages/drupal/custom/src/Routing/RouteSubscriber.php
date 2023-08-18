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

    // We use "moderated_content" view instead of the default "content" one.
    // Disable the leftover route from the content_moderation module.
    if ($route = $collection->get('content_moderation.admin_moderated_content')) {
      $route->setRequirement('_access', 'FALSE');
    }
  }

}
