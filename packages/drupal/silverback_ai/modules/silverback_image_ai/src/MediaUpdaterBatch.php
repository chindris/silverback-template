<?php

declare(strict_types=1);

namespace Drupal\silverback_image_ai;

use Drupal\Core\Batch\BatchBuilder;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Methods for running the ConfigImporter in a batch.
 *
 * @see \Drupal\Core\Config\ConfigImporter
 */
class MediaUpdaterBatch {
  use StringTranslationTrait;

  /**
   * The logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $loggerChannel;

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
   * {@inheritdoc}
   */
  public function create(array $items): void {

    /** @var \Drupal\Core\Batch\BatchBuilder $batchBuilder */
    $batchBuilder = (new BatchBuilder())
      ->setTitle($this->t('Running media image updates...'))
      ->setFinishCallback([self::class, 'finish'])
      ->setInitMessage('The initialization message (optional)')
      ->setProgressMessage('Completed @current of @total. See other placeholders.');

    $total = count($items);
    $count = 0;
    // Create multiple batch operations based on the $batchSize.
    foreach ($items as $item) {
      $batch = [
        'item' => $item,
        'count' => $count++,
        'total' => $total,
      ];
      $batchBuilder->addOperation([MediaUpdaterBatch::class, 'process'], [$batch]);
    }

    batch_set($batchBuilder->toArray());
    if (function_exists('drush_backend_batch_process') && PHP_SAPI === 'cli') {
      drush_backend_batch_process();
    }
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
    // Process elements stored in the each batch (operation).
    // $context['results'][] = $item;.
    $processed = !empty($context['results']) ? count($context['results']) : $batch['count'];
    $entity = $batch['item']['entity'];

    $service = \Drupal::service('silverback_image_ai.utilities');
    $alt_text = '-';
    $file = $entity->field_media_image->entity;
    if ($file) {
      $alt_text = $service->generateImageAlt($file, $batch['item']['langcode']);
      $service->setMediaImageAltText($entity, $alt_text);
    }

    $context['message'] = t('Processing media item @processed/@total @label with id: @id (@langcode) ALT: @alt', [
      '@processed' => $processed,
      '@total' => $batch['total'],
      '@label' => substr($entity->label(), 0, 12) . '..',
      '@id' => $entity->id(),
      '@langcode' => $batch['item']['langcode'],
      '@alt' => substr($alt_text, 0, 64) . '..',
    ]);

    sleep(1);
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
  public static function finish($success, $results, $operations) {
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
