<?php

declare(strict_types=1);

namespace Drupal\silverback_ai_import;

use Drupal\Core\Batch\BatchBuilder;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\node\Entity\Node;

/**
 * Methods for running the ConfigImporter in a batch.
 *
 * @see \Drupal\Core\Config\ConfigImporter
 */
class ContentImportBatch {
  use StringTranslationTrait;

  /**
   * The logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected LoggerChannelInterface $loggerChannel;

  /**
   * Constructor.
   *
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $loggerFactory
   *   The logger factory.
   */
  public function __construct(LoggerChannelFactoryInterface $loggerFactory) {
    $this->loggerChannel = $loggerFactory->get('silverback_image_ai');
  }

  /**
   * Creates a batch operation to process media image updates.
   *
   * This method initializes a batch process for updating media images, setting
   * up the batch operations and conditions for Drush integration if run via CLI.
   *
   * @param array $items
   *   An array of items to be processed in the batch. Each item represents
   *   a single media entity requiring updates.
   *
   * @return void
   */
  public function create(array $chunks, $entity): void {

    $batchBuilder = (new BatchBuilder())
      ->setTitle($this->t('Running import...'))
      ->setFinishCallback([self::class, 'finish'])
      ->setInitMessage('The initialization message (optional)')
      ->setProgressMessage('Completed @current of @total.');

    $total = count($chunks);
    $count = 0;
    // Create multiple batch operations based on the $batchSize.
    foreach ($chunks as $chunk) {
      $item = [
        'chunk' => $chunk,
        'nid' => $entity->id(),
      ];
      $batch = [
        'item' => $item,
        'count' => $count++,
        'total' => $total,
      ];
      $batchBuilder->addOperation([ContentImportBatch::class, 'process'], [$batch]);
    }
    batch_set($batchBuilder->toArray());
  }

  /**
   * Batch operation callback.
   *
   * @param array $batch
   *   Information about batch (items, size, total, ...).
   * @param array $context
   *   Batch context.
   */
  public static function process(array $batch, array &$context) {
    $processed = !empty($context['results']) ? count($context['results']) : $batch['count'];
    $service = \Drupal::service('silverback_ai_import.content');
    $content = $service->processChunk($batch['item']['chunk']);
    // $content = '<!-- wp:paragraph -->xxx<!-- /wp:paragraph -->';
    \Drupal::logger('silverback_ai_import')->debug($content);
    $context['results']['content'][] = $content;
    $context['results']['nid'] = $batch['item']['nid'];

    $context['message'] = t('Processing chunk @processed/@total', [
      '@processed' => $processed,
      '@total' => $batch['total'],
    ]);
  }

  /**
   * Finish batch.
   *
   * This function is a static function to avoid serializing the ConfigSync
   * object unnecessarily.
   *
   * @param bool $success
   *   Indicate that the batch API tasks were all completed successfully.
   * @param array $results
   *   An array of all the results that were updated in update_do_one().
   * @param array $operations
   *   A list of the operations that had not been completed by the batch API.
   */
  public static function finish(bool $success, array $results, array $operations) {
    $nid = $results['nid'];
    if (!empty($nid)) {
      $node = Node::load($nid);

      // @todo Possible we need more process here.
      $results['content'] = array_map(function ($item) {
        return str_replace('<p></p>', '', $item);
      }, $results['content']);

      // @todo Improve that to respect also templates
      $implode = implode(PHP_EOL, $results['content']);
      $content = <<<EOD
      <!-- wp:custom/content -->
      $implode
      <!-- /wp:custom/content -->
      EOD;

      $node->body->value = $content;
      $node->save();
    }

    $messenger = \Drupal::messenger();
    if ($success) {
      $messenger->addStatus(t('Items processed successfully.'));
    }
    else {
      // An error occurred.
      // $operations contains the operations that remained unprocessed.
      $error_operation = reset($operations);
      $message = t('An error occurred while processing %error_operation with arguments: @arguments',
      ['%error_operation' => $error_operation[0], '@arguments' => print_r($error_operation[1], TRUE)]);
      $messenger->addError($message);
    }
  }

}
