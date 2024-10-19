<?php

declare(strict_types=1);

namespace Drupal\silverback_ai;

use Drupal\Core\Database\Connection;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * @todo Add class description.
 */
final class TokenUsage implements TokenUsageInterface {

  /**
   * Constructs a TokenUsage object.
   */
  public function __construct(
    private readonly Connection $connection,
    private readonly AccountProxyInterface $currentUser,
    private readonly LoggerChannelFactoryInterface $loggerFactory,
  ) {}

  /**
   * {@inheritdoc}
   */
  public function addTokenUsage(array $context): void {

    // @todo Validate input array
    try {
      $this->connection
        ->insert('silverback_ai_usage')
        ->fields([
          'id' => '',
          'uid' => $this->currentUser->id(),
          'timestamp' => (new DrupalDateTime())->getTimestamp(),
          'target_entity_type_id' => '',
          'target_entity_id' => '',
          'target_entity_revision_id' => '',
          'tokens_in' => $context['tokens_in'],
          'tokens_out' => $context['tokens_out'],
          'totalcount' => $context['totalcount'],
          'provider' => '',
          'model' => '',
          'module' => '',
        ])
        ->execute();
    }
    catch (\Exception $e) {
      // @todo do something
    }
  }

  /**
   * Return an array of token usage entries.
   */
  public function getTokenUsage(array $context = []): void {
    // @todo
  }

}
