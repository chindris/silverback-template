<?php

declare(strict_types=1);

namespace Drupal\silverback_ai;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Database\Connection;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\user\Entity\User;

/**
 * @todo Add class description.
 */
final class TokenUsage implements TokenUsageInterface {

  private const USER_ADMIN = 1;

  /**
   * Constructs a TokenUsage object.
   */
  public function __construct(
    private readonly Connection $connection,
    private readonly AccountProxyInterface $currentUser,
    private readonly LoggerChannelFactoryInterface $loggerFactory,
    private readonly ConfigFactoryInterface $configFactory,
  ) {}

  /**
   * {@inheritdoc}
   */
  public function createUsageEntry(array $context): void {

    $model = $this->configFactory->get('silverback_image_ai.settings')->get('ai_model') ?: 'gpt-4o-mini';
    $tokens_out = $context['usage']['prompt_tokens'];
    $tokens_in = $context['usage']['completion_tokens'];
    $tokens_total = $context['usage']['total_tokens'];

    $uid = self::USER_ADMIN;
    if ($this->currentUser) {
      $uid = $this->currentUser->id();
    }

    // @todo Validate input array
    try {
      $this->connection
        ->insert('silverback_ai_usage')
        ->fields([
          'uid' => $uid,
          'timestamp' => (new DrupalDateTime())->getTimestamp(),
          'target_entity_type_id' => '',
          'target_entity_id' => '',
          'target_entity_revision_id' => '',
          'tokens_in' => $tokens_in,
          'tokens_out' => $tokens_out,
          'total_count' => $tokens_total,
          'provider' => 'Open AI',
          'model' => $model,
          'module' => $context['module'],
          'response' => json_encode($context),
        ])
        ->execute();
      $this->loggerFactory->get('silverback_ai')->notice('Logged usage successfully');
    }
    catch (\Exception $e) {
      // @todo do something
      $this->loggerFactory->get('silverback_ai')->error($e->getMessage());
    }
  }

  /**
   *
   */
  public function getEntries(int $offset = 0, $limit = 25) {
    $query = $this->connection->select('silverback_ai_usage', 's')
      ->range(0, $limit)
      ->fields('s', [
        'id',
        'uid',
        'timestamp',
        'tokens_in',
        'tokens_out',
        'total_count',
        'provider',
        'model',
        'module',
        'response',
      ])
      ->orderBy('id', 'DESC');
    $rsc = $query->execute();
    $rows = [];
    foreach ($rsc->fetchAll() as $row) {
      $rows[] = [
        'timestamp' => DrupalDateTime::createFromTimestamp($row->timestamp)->format('d.m.Y H:i'),
        'username' => User::load($row->id)->getDisplayName(),
        'entity_id' => '',
        'tokens_total' => $row->total_count,
        'ai_provider' => $row->provider . ' / ' . ($row->model ?: 'gpt-4o-mini'),
        'module_name' => $row->module,
      ];
    }
    return $rows;
  }

}
