<?php

namespace Drupal\entity_create_split\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EntityCreateSplitController extends ControllerBase {

  /**
   * Route callback to show the first part of the entity create form, which
   * contains the required fields.
   *
   * @param string $entity_type
   * @param string $bundle
   *
   * @return array
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function createForm($entity_type, $bundle) {
    if (!$this->entityTypeManager()->hasDefinition($entity_type)) {
      throw new NotFoundHttpException();
    }
    $entityTypeDefinition = $this->entityTypeManager()->getDefinition($entity_type);
    $bundleKey = $entityTypeDefinition->getKey('bundle');

    // @todo: find a way to check if the bundle value is allowed.
    $entity = $this->entityTypeManager()->getStorage($entity_type)->create([$bundleKey => $bundle]);
    $entity->disableGutenberg = TRUE;
    $entity->hideOptionalFormFields = TRUE;
    $editForm = $this->entityTypeManager()->getFormObject($entity_type, 'default')->setEntity($entity);
    return \Drupal::formBuilder()->getForm($editForm);
  }
}
