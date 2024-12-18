<?php

declare(strict_types=1);

namespace Drupal\silverback_ai_import\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Provides a Silverback Import AI form.
 */
final class PageDropForm extends FormBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'silverback_ai_import_page_drop';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {

    $form['message'] = [
      '#type' => 'item',
      '#markup' => Markup::create('<em>Create content by importing either a file or an existing URL.</em>'),
    ];

    $form['import'] = [
      '#type' => 'details',
      '#title' => $this->t('Create content'),
      '#open' => TRUE,
      '#weight' => 99,
    ];
    $form['import']['import_type'] = [
      '#type' => 'radios',
      '#title' => $this->t('Create content from:'),
      '#options' => [
        'docx' => $this->t('Microsoft Word file'),
        // 'pdf' => t("PDF file"),
        'url' => $this->t("Remote HTML page"),
      ],
      '#default_value' => 'none',
      '#required' => TRUE,
    ];

    $form['import']['container_docx'] = [
      '#type' => 'container',
      '#states' => [
        'visible' => [
          'input[name="import_type"]' => ['value' => 'docx'],
        ],
      ],
    ];

    $form['import']['container_docx']['file'] = [
      '#title' => t('Drag and drop a Microsoft Word file'),
      '#type' => 'dropzonejs',
      '#required' => TRUE,
      '#dropzone_description' => 'Drag and drop a file here',
      '#max_filesize' => '1M',
      '#max_files' => 1,
      '#extensions' => 'doc docx',
      '#upload_location' => 'public://converted/',
      '#states' => [
        'required' => [
          'input[name="import_type"]' => ['value' => 'docx'],
        ],
      ],
    ];

    $form['import']['container_url'] = [
      '#type' => 'container',
      '#states' => [
        'visible' => [
          'input[name="import_type"]' => ['value' => 'url'],
        ],
      ],
    ];

    $form['import']['container_url']['url_value'] = [
      '#type' => 'url',
      '#title' => $this->t('URL'),
      '#maxlength' => 1024,
      '#states' => [
        'required' => [
          'input[name="import_type"]' => ['value' => 'url'],
        ],
      ],
    ];

    $form['actions']['submit']['#submit'][] = '_silverback_ai_import_form_submit';

    // Better to have this unpublished originally, and then
    // we will display a message to the user (esp. if there is AI content)
    $form['moderation_state']['#access'] = FALSE;
    $form['actions']['submit']['#value'] = t('Create');

    $form['actions'] = [
      '#type' => 'actions',
      'submit' => [
        '#type' => 'submit',
        '#value' => $this->t('Create'),
      ],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    // @todo Validate the form here.
    // Example:
    // @code
    //   if (mb_strlen($form_state->getValue('message')) < 10) {
    //     $form_state->setErrorByName(
    //       'message',
    //       $this->t('Message should be at least 10 characters.'),
    //     );
    //   }
    // @endcode
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->messenger()->addStatus($this->t('The message has been sent.'));
  }

}
