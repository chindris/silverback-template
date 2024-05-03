<?php

namespace Drupal\gutenberg_blocks\Plugin\Validation\GutenbergValidator;

use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\silverback_gutenberg\GutenbergValidation\GutenbergValidatorBase;

/**
 * @GutenbergValidator(
 *   id="accordion_item_text_validator",
 *   label = @Translation("Accordion Item Text validator")
 * )
 */
class AccordionItemTextValidator extends GutenbergValidatorBase {
  use StringTranslationTrait;

  /**
   * {@inheritDoc}
   */
  public function applies(array $block): bool {
    return $block['blockName'] === 'custom/accordion-item-text';
  }

  /**
   * {@inheritDoc}
   */
  public function validatedFields($block = []): array {
    return [
      'title' => [
        'field_label' => $this->t('Title'),
        'rules' => ['required'],
      ],
      // @todo check if we want text as rich text or inner blocks.
    ];
  }

}
