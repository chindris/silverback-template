<?php

namespace Drupal\silverback_image_ai\Plugin\Action;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Action\ActionBase;
use Drupal\Core\Action\Attribute\Action;
use Drupal\Core\Action\Plugin\Action\Derivative\EntityPublishedActionDeriver;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Update ALT text for media images.
 */
#[Action(
  id: 'entity:alt_ai_update_action',
  action_label: new TranslatableMarkup('Alt text update (images only)'),
  deriver: EntityPublishedActionDeriver::class
)]
class AltAiUpdateAction extends ActionBase {

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    // Do something.
    \Drupal::logger('debug')->debug(__METHOD__);
    sleep(1);
  }

  /**
   * {@inheritdoc}
   */
  public function access($object, AccountInterface $account = NULL, $return_as_object = FALSE) {
    $result = AccessResult::allowedIfHasPermission($account, 'create media');
    return $return_as_object ? $result : $result->isAllowed();
  }

}
