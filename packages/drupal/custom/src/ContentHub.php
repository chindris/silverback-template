<?php

namespace Drupal\custom;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\graphql_directives\DirectiveArguments;

/**
 * Service to query content listings.
 */
class ContentHub {

  /**
   * The entity type manager, to query and load pages.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * ContentHub constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager, to query and load pages.
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * Query a list of pages.
   *
   * @param \Drupal\graphql_directives\DirectiveArguments $args
   *   The graphql argument bag.
   *
   * @return array{'total': int, 'items': \Drupal\node\NodeInterface[]}
   *   Result of the query.
   */
  public function query(DirectiveArguments $args) : array {
    // @todo Switch this to views.
    $offset = $args->args['pagination']['offset'];
    $limit = $args->args['pagination']['limit'];
    $nodeStorage = $this->entityTypeManager->getStorage('node');

    // Clear this whenever nodes are changed.
    $args->context->addCacheTags($nodeStorage->getEntityType()->getListCacheTags());

    $countQuery = $nodeStorage->getQuery();
    $countQuery->condition('type', 'page');
    $countQuery->condition('status', 1);
    if (!empty($args->args['query'])) {
      $countQuery->condition('title', $args->args['query'], 'CONTAINS');
    }
    $count = $countQuery->count()->accessCheck(TRUE)->execute();

    $query = $nodeStorage->getQuery();
    $query->condition('type', 'page');
    $query->condition('status', 1);
    if (!empty($args->args['query'])) {
      $query->condition('title', $args->args['query'], 'CONTAINS');
    }
    $pageIds = $query->range($offset, $limit)
      ->sort('title', 'ASC')
      ->accessCheck(TRUE)
      ->execute();
    $posts = $pageIds ? $nodeStorage->loadMultiple($pageIds) : [];
    return [
      'total' => $count,
      'items' => $posts,
    ];
  }

}
