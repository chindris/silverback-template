<?php

namespace Drupal\entity_create_split;

/**
 * Interface for the form operations service class.
 */
interface FormOperationsInterface {

  /**
   * Hides all the optional fields of a set of form elements.
   *
   * @param array $elements
   *  An array of form elements.
   *
   * @return void
   */
  public function hideOptionalFields(array &$elements): void;

  /**
   * Checks if a field should be hidden.
   *
   * @param array $field
   *  A form field.
   *
   * @return bool
   */
  public function shouldHideField(array $field): bool;
}
