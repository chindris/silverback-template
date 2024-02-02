<?php

namespace Drupal\custom;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Path\PathValidatorInterface;
use Drupal\graphql_directives\DirectiveArguments;
use Drupal\node\NodeInterface;
use Drupal\redirect\RedirectRepository;

/**
 * Page-related directives.
 *
 * Service that provides directive implementations
 * for content pages.
 */
class Page {

  /**
   * Page directive service constructor.
   *
   * @param \Drupal\Core\Path\PathValidatorInterface $pathValidator
   *   To transform a path into a url.
   * @param \Drupal\redirect\RedirectRepository $redirectRepository
   *   To follow potential path redirects.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   To load the page.
   */
  public function __construct(
        protected PathValidatorInterface $pathValidator,
        protected ?RedirectRepository $redirectRepository,
        protected EntityTypeManagerInterface $entityTypeManager
    ) {
  }

  /**
   * Retrieve a page by its path.
   */
  public function byPath(DirectiveArguments $args): NodeInterface | null {
    $path = $args->args['path'];
    $redirect = $this->redirectRepository ? $this->redirectRepository->findMatchingRedirect($path, []) : NULL;
    if ($redirect !== NULL) {
      $url = $redirect->getRedirectUrl();
    }
    else {
      $url = $this->pathValidator->getUrlIfValidWithoutAccessCheck($path);
    }

    if ($url && $url->isRouted() && $url->access()) {
      $parameters = $url->getRouteParameters();
      if (!array_key_exists('page', $parameters)) {
        return NULL;
      }
      $id = $parameters['page'];
      if ($entity = $this->entityTypeManager->getStorage('page')->load($id)) {

        $access = $entity->access('view', NULL, TRUE);
        $args->context->addCacheableDependency($access);
        if ($access->isAllowed()) {
          return $entity;
        }
        return NULL;
      }
      else {

        // If there is no entity with this id, add the list cache tags so that
        // the cache entry is purged whenever a new entity of this type is
        // saved.
        $args->context->addCacheTags(this->entityTypeManager->getDefinition('node')->getListCacheTags());
      }
    }

    $args->context->addCacheTags(['4xx-response']);
    return NULL;
  }

}
