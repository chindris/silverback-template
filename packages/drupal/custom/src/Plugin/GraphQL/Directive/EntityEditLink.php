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
        ->map('rel', $builder->fromValue('edit-form'))
        ->map('options', $builder->fromValue(['absolute' => TRUE])),
      $builder->produce('url_path')->map('url', $builder->fromParent()),
    );
  }

}
