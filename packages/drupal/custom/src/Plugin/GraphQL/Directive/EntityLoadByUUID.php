<?php

namespace Drupal\custom\Plugin\GraphQL\Directive;

use Drupal\Core\Plugin\PluginBase;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql_directives\DirectiveInterface;
use Drupal\graphql_directives\Plugin\GraphQL\Directive\ArgumentTrait;

/**
 * @Directive(
 *   id = "loadByUUID",
 *   description = "Loads a given entity by its uuid",
 *   arguments = {
 *     "type" = "String",
 *     "uuid" = "String",
 *     "operation" = "String"
 *   }
 * )
 */
class EntityLoadByUUID extends PluginBase implements DirectiveInterface {
  use ArgumentTrait;

  /**
   * {@inheritDoc}
   * @throws \Exception
   */
  public function buildResolver(ResolverBuilder $builder, array $arguments): ResolverInterface {
    // All other cases require a "type" argument.
    if (!isset($arguments['type'])) {
      throw new \Exception('A type must be provided.');
    }
    if (!isset($arguments['uuid'])) {
      throw new \Exception('A uuid must be provided.');
    }

    return $builder->produce('entity_load_by_uuid')
      ->map('type', $builder->fromValue($arguments['type']))
      ->map('access_operation', $builder->fromValue($arguments['operation'] ?? 'view'))
      ->map('language', $builder->fromContext('document_language'))
      ->map('uuid', $this->argumentResolver($arguments['uuid'], $builder));
  }

}
