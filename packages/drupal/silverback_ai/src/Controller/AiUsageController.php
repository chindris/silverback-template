<?php

declare(strict_types=1);

namespace Drupal\silverback_ai\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\silverback_ai\TokenUsageInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Returns responses for Silverback AI routes.
 */
class AiUsageController extends ControllerBase {

  use StringTranslationTrait;

  /**
   * The entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The token usage service.
   *
   * @var \Drupal\silverback_ai\TokenUsage
   */
  protected $silverbackAiTokenUsage;

  /**
   * The account object.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The controller constructor.
   */
  public function __construct(
    EntityTypeManagerInterface $entityTypeManager,
    TokenUsageInterface $silverbackAiTokenUsage,
    AccountProxyInterface $currentUser,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('entity_type.manager'),
      $container->get('silverback_ai.token.usage'),
      $container->get('current_user'),
    );
  }

  /**
   * Builds the response.
   */
  public function __invoke(): array {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('It works!'),
    ];

    $header = [
      'timestamp' => $this->t('Timestamp'),
      'username' => $this->t('User'),
      'entity_id' => $this->t('Entity'),
      'tokens_total' => $this->t('Tokens'),
      'ai_provider' => $this->t('Provider'),
      'module_name' => $this->t('Module'),
    ];

    $build['table'] = [
      '#type' => 'tableselect',
      '#header' => $header,
      '#options' => [],
      '#empty' => $this->t('No records found'),
    ];

    return $build;
  }

}
