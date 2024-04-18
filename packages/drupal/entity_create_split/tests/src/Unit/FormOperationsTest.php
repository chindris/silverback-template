<?php

namespace Drupal\entity_create_split\Tests\Unit;
use Drupal\entity_create_split\FormOperations;
use Drupal\Tests\UnitTestCase;

/**
 * Unit tests for Drupal\entity_create_split\FormOperations
 */
class FormOperationsTest extends UnitTestCase {

  /**
   * @var \Drupal\entity_create_split\FormOperations
   */
  protected $formOperations;

  /**
   * {@inheritDoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->formOperations = new FormOperations();
  }

  /**
   * @covers \Drupal\entity_create_split\FormOperations::shouldHideField
   * @dataProvider shouldHideFieldProvider
   */
  public function testShouldHideField(array $field, bool $expected) {
    $this->assertEquals($expected, $this->formOperations->shouldHideField($field));
  }

  public function shouldHideFieldProvider() {
    return [
      // 1. No type set on the form element.
      [
        [
          '#property1' => 'lorem',
          '#property2' => 'ipsum',
          'children' => ['dolor'],
        ],
        FALSE,
      ],
      // 2. A hidden field.
      [
        [
          '#type' => 'hidden',
          '#value' => 'this is a hidden field',
        ],
        FALSE,
      ],
      // 3. A value field.
      [
        [
          '#type' => 'value',
          '#value' => 'this is a value field',
        ],
        FALSE,
      ],
      // 3. A required field.
      [
        [
          '#type' => 'textfield',
          '#title' => 'this is a text field',
          '#required' => TRUE,
        ],
        FALSE,
      ],
      // 3. An optional field.
      [
        [
          '#type' => 'textfield',
          '#title' => 'this is a text field',
          '#required' => FALSE,
        ],
        TRUE,
      ],
      // 3. A field with no required property set (this should not be hidden.
      // To hide a field, the required property has to be specified).
      [
        [
          '#type' => 'textfield',
          '#title' => 'this is a text field',
        ],
        FALSE,
      ],
    ];
  }

  /**
   * @covers \Drupal\entity_create_split\FormOperations::hideOptionalFields
   */
  public function testHideOptionalFields() {
    $formStructure = [
      '#some_attribute' => 'some_value',
      'optional' => [
        '#type' => 'textfield',
        '#title' => 'optional textfield',
        '#required' => FALSE,
      ],
      'required' => [
        '#type' => 'textfield',
        '#title' => 'required textfield',
        '#required' => TRUE,
      ],
      'optional_group' => [
        '#title' => 'optional group',
        'first_element' => [
          '#title' => 'First optional element',
          'widget' => [
            '#type' => 'select',
            '#required' => FALSE,
          ],
        ],
        'second_element' => [
          '#title' => 'Second optional element',
          'widget' => [
            '#type' => 'checkboxes',
            '#required' => FALSE,
          ],
        ],
      ],
      'required_group' => [
        '#title' => 'required group',
        'first_element' => [
          '#title' => 'First required element',
          'widget' => [
            '#type' => 'textfield',
            '#required' => TRUE,
          ],
        ],
        'second_element' => [
          '#title' => 'Second required element',
          'widget' => [
            '#type' => 'textarea',
            '#required' => TRUE,
          ],
        ],
      ],
      'mixed_group' => [
        '#title' => 'mixed group',
        'first_element' => [
          '#title' => 'First mixed element - required',
          'widget' => [
            '#type' => 'radios',
            '#required' => TRUE,
          ],
        ],
        'second_element' => [
          '#title' => 'Second mixed element - optional',
          'widget' => [
            '#type' => 'textarea',
            '#required' => FALSE,
          ],
        ],
      ],
    ];
    $expectedResult = $formStructure;
    $expectedResult['optional']['#access'] = FALSE;
    $expectedResult['optional_group']['first_element']['widget']['#access'] = FALSE;
    $expectedResult['optional_group']['second_element']['widget']['#access'] = FALSE;
    $expectedResult['optional_group']['first_element']['#access'] = FALSE;
    $expectedResult['optional_group']['second_element']['#access'] = FALSE;
    $expectedResult['optional_group']['#access'] = FALSE;
    $expectedResult['mixed_group']['second_element']['widget']['#access'] = FALSE;
    $expectedResult['mixed_group']['second_element']['#access'] = FALSE;
    $this->formOperations->hideOptionalFields($formStructure);
    $this->assertEquals($expectedResult, $formStructure);
  }

}
