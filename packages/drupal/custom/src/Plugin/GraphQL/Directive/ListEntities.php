<?php

namespace Drupal\custom\Plugin\GraphQL\Directive;

use Drupal\Core\Plugin\PluginBase;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql_directives\DirectiveInterface;

/**
 * @Directive(
 *   id = "listEntities",
 *   description = "Access restrictions for the country selection overlay.",
 *   arguments = {
 *     "type" = "String!",
 *     "bundle" = "String!",
 *   }
 * )
 */
class ListEntities extends PluginBase implements DirectiveInterface {

  public function buildResolver(ResolverBuilder $builder, $arguments): ResolverInterface {
    return $builder->produce('list_entities')
      ->map('type', $builder->fromValue($arguments['type']))
      ->map('bundle', $builder->fromValue($arguments['bundle']))
      // TODO: Fix this.
      ->map('access', $builder->fromValue(FALSE));
  }

}