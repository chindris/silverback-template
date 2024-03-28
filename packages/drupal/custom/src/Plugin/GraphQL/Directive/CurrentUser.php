<?php

namespace Drupal\custom\Plugin\GraphQL\Directive;

use Drupal\Core\Plugin\PluginBase;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql_directives\DirectiveInterface;
use Drupal\user\Entity\User;

/**
 * @Directive(
 *   id = "currentUser"
 * )
 */
class CurrentUser extends PluginBase implements DirectiveInterface {

  public function buildResolver(ResolverBuilder $builder, $arguments): ResolverInterface {
    return $builder->callback(function () {
      $account = \Drupal::currentUser();
      if ($account->isAnonymous()) {
        return null;
      }
      else {
        $user = User::load($account->id());
        $memberFor = \Drupal::service('date.formatter')->formatTimeDiffSince($user->getCreatedTime());
        return [
          'id' => $account->id(),
          'name' => $account->getDisplayName(),
          'email' => $account->getEmail(),
          'memberFor' => $memberFor,
        ];
      }
    });
  }
}
