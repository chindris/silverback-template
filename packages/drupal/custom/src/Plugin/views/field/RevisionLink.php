<?php

namespace Drupal\custom\Plugin\views\field;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Access\AccessResultInterface;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Drupal\views\Plugin\views\field\LinkBase;
use Drupal\views\ResultRow;

/**
 * Field handler to present a link to a node revision.
 *
 * Can be used to provide the same UX as the core 'content' view
 * when it's replaced by the 'moderated_content' view for the same purpose:
 * - Use the latest revision route if the node has a pending revision.
 * - Otherwise, use the canonical node route.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("custom__node_revision_link")
 */
class RevisionLink extends LinkBase {

  /**
   * {@inheritdoc}
   */
  protected function getUrlInfo(ResultRow $row) {
    // Stub. This method is not used in this implementation.
    // The URL is determined in renderLink() to keep the language context.
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  protected function checkUrlAccess(ResultRow $row): AccessResultInterface {
    // getUrlInfo() can wrongly negotiate the language context of the node.
    // which can lead to access issues, even though the row is displayed, which is confusing.
    // So, simplifying the access check to use a generic permission.
    return AccessResult::allowedIfHasPermission($this->currentUser(), 'view any unpublished content');
  }

  /**
   * {@inheritdoc}
   */
  protected function renderLink(ResultRow $row) {
    /** @var \Drupal\node\NodeInterface $node */
    $node = $this->getEntity($row);
    if (!$node || !$node->getRevisionid()) {
      return '';
    }

    $node = $this->getTranslatedNode($row, $node);

    $moderation_info = \Drupal::service('content_moderation.moderation_information');
    $translatedNode = $this->getTranslatedNode($row, $node);
    $url = $moderation_info->hasPendingRevision($node) ?
      Url::fromRoute('entity.node.latest_version', ['node' => $node->id()]) :
      $translatedNode->toUrl();

    $this->options['alter']['make_link'] = TRUE;
    $this->options['alter']['url'] = $url;
    $text = $node->label();
    $this->addLangcode($row);
    return $text;
  }

  /**
   * Returns the translated node based on the row language.
   */
  private function getTranslatedNode(ResultRow $row, NodeInterface $node) {
    $result = $node;
    $langcode = $node->language()->getId();
    $rowLangcode = $this->getEntityTranslationByRelationship($node, $row)->language()->getId();
    if ($rowLangcode !== $langcode && $node->hasTranslation($rowLangcode)) {
      $result = $node->getTranslation($rowLangcode);
    }
    return $result;
  }

}
