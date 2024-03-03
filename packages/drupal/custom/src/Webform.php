<?php

namespace Drupal\custom;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\RendererInterface;
use Drupal\graphql_directives\DirectiveArguments;
use Drupal\webform\WebformSubmissionForm;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Helper service for managing webforms with graphql.
 */
class Webform {

  /**
   * The renderer for collecting cache information.
   */
  protected RendererInterface $renderer;

  /**
   * The entity type manager, to query and load pages.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * Webform constructor.
   */
  public function __construct(
    RendererInterface $renderer,
    EntityTypeManagerInterface $entityTypeManager
  ) {
    $this->entityTypeManager = $entityTypeManager;
    $this->renderer = $renderer;
  }

  /**
   * Generate the public url of a webform, based on its ID.
   */
  public function url(DirectiveArguments $args) : ?string {
    $webformId = $args->args['id'];
    if (!$webformId) {
      return NULL;
    }

    $webFormStorage = $this->entityTypeManager->getStorage('webform');

    /** @var \Drupal\Core\Render\RendererInterface $renderer */
    $renderContext = new RenderContext();

    $result = $this->renderer->executeInRenderContext(
        $renderContext,
        function () use ($args, $webformId, $webFormStorage) {
          $webform = $webFormStorage->load($webformId);
          if (!$webform || !$webform->isOpen()) {
            return NULL;
          }
          $args->context->addCacheableDependency($webform);
          return $webform->toUrl()->setAbsolute()->toString();
        },
      );

    if (!$renderContext->isEmpty()) {
      $args->context->addCacheableDependency($renderContext->pop());
    }

    return $result;
  }

  /**
   * Creates a webform submission.
   *
   * @param string $webformId
   * @param array $submissionData
   *
   * @return \Drupal\webform\WebformSubmissionInterface|array|null
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function createSubmission(string $webformId, array $submissionData) : WebformSubmissionInterface | array | null {
    $webform = $this->entityTypeManager->getStorage('webform')->load($webformId);
    if (!$webform) {
      throw new \InvalidArgumentException('The webform could no be loaded.');
    }
    $isOpen = WebformSubmissionForm::isOpen($webform);
    if ($isOpen !== TRUE) {
      throw new \Exception($isOpen);
    }
    $values = [
      'webform_id' => 'contact',
      'entity_type' => NULL,
      'entity_id' => NULL,
      'data' => $submissionData,
    ];
    // The WebformSubmissionForm::submitFormValues() will return an array with
    // errors, if there are validation errors, otherwise it will return a
    // webform submission entity.
    return WebformSubmissionForm::submitFormValues($values);
  }

}
