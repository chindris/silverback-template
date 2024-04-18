<?php

namespace Drupal\entity_create_split;

use Drupal\Core\Render\Element;

/**
 * Form operations service class.
 */
class FormOperations implements FormOperationsInterface {

  /**
   * {@inheritDoc}
   */
  public function hideOptionalFields(array &$elements): void {
    $children = Element::children($elements);
    // If there are no children elements, there's nothing to check, so return.
    if (empty($children)) {
      return;
    }
    // Use a flag for when all the children of an element are hidden. If true,
    // then hide the element as well. This is useful for the case when there is
    // a nested structure of elements, and only the last one will be marked as
    // hidden (deny the access to it). In this case, the wrapper elements (like
    // fieldsets) will still be visible, and we need to hide them as well.
    $allChildrenHidden = TRUE;
    foreach  ($children as $child) {
      $this->hideOptionalFields($elements[$child]);
      if ($this->shouldHideField($elements[$child])) {
        $elements[$child]['#access'] = FALSE;
      }
      // Set the $allChildrenHidden flag to false in case this child is allowed
      // to be rendered.
      if (!isset($elements[$child]['#access']) || $elements[$child]['#access']) {
        $allChildrenHidden = FALSE;
      }
    }
    // And let's check now if we should hide the element completely (if all its
    // children are hidden).
    if ($allChildrenHidden) {
      $elements['#access'] = FALSE;
    }
  }

  /**
   * {@inheritDoc}
   */
  public function shouldHideField(array $field): bool {
    // Right now, we deny the access of all the elements which are not hidden or
    // value, and they have the #required flag set to false.
    return isset($field['#type']) &&
      $field['#type'] !== 'hidden' &&
      $field['#type'] !== 'value' &&
      isset($field['#required']) &&
      $field['#required'] === FALSE;
  }
}
