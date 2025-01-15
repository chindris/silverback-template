<?php

namespace Drupal\custom\Plugin\GraphQL\Directive;

use Drupal\Core\Plugin\PluginBase;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql_directives\DirectiveInterface;
use Drupal\graphql_directives\Plugin\GraphQL\Directive\ArgumentTrait;

/**
 * @Directive(
 *   id = "resolveEntityEditLink",
 *   description = "Resolves the edit link of an entity.",
 * )
 */
class EntityEditLink extends PluginBase implements DirectiveInterface {
  use ArgumentTrait;

  public function buildResolver(ResolverBuilder $builder, array $arguments): ResolverInterface {
    return $builder->compose(
      $builder->produce('entity_url')
        ->map('entity', $builder->fromParent())
        ->map('rel', $builder->fromValue('edit-form')),
      $builder->produce('url_path')->map('url', $builder->fromParent()),
      $builder->callback(function ($path) {
        // Can't use "absolute" option when building the URL, because Gatsby
        // tricks Drupal to think its base URL is Netlify URL.
        return (getenv('LAGOON_ROUTE') ?: 'http://127.0.0.1:8888') . $path;
      })
    );
  }

}
