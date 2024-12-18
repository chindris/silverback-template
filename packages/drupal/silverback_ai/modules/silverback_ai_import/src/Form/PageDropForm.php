<?php

declare(strict_types=1);

namespace Drupal\silverback_ai_import\Form;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;

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

    // End debug
    // ---------------------.
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
      '#maxlength' => 2048,
      '#size' => 128,
      '#states' => [
        'required' => [
          'input[name="import_type"]' => ['value' => 'url'],
        ],
      ],
    ];

    $form['import']['container_output'] = [
      '#type' => 'container',
    ];
    $form['import']['container_output']['output'] = [
      '#type' => 'item',
      '#prefix' => '<div id="edit-output">',
      '#suffix' => '</div>',
    ];

    // $form['actions']['submit']['#submit'][] = '_silverback_ai_import_form_submit';
    $form['actions'] = [
      '#type' => 'actions',
      '#states' => [
        'visible' => [
          'input[name="import_type"]' => ['value' => 'docx'],
        ],
      ],
      'submit' => [
        '#type' => 'submit',
        '#value' => $this->t('Process document'),
      /*         '#attributes' => [
          'class' => [
            'use-ajax-submit',
          ],
        ],
        '#ajax' => [
          '#progress_indicator' => 'throbber',
          '#progress_message' => $this->t('Validating input'),
          'callback' => '::myAjaxCallbackDocx',
          'event' => 'click',
          'wrapper' => 'edit-output',
        ], */
      ],
    ];

    return $form;
  }

  /**
   * The textbox with the selected text.
   */
  public function myAjaxCallbackDocx(array &$form, FormStateInterface $form_state) {
    $file = $form_state->getValue('file');

    $response = new AjaxResponse();

    $response->addCommand(new ReplaceCommand('#edit-output', '<div id="edit-output"><em>' . $this->t('Please upload a file') . '</em></div>'));
    return $response;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    $file = $form_state->getValue('file');
    $type = $form_state->getValue('import_type');
    if ($type == 'docx' && empty($file['uploaded_files'])) {
      $form_state->setErrorByName('file', $this->t('Please upload a file to import.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $type = $form_state->getValue('import_type');
    if ($type == 'docx') {
      $file = $form_state->getValue('file');
      $filepath = $file['uploaded_files'][0]['path'];
      $directory = 'public://converted';
      $file_system = \Drupal::service('file_system');
      $file_system->prepareDirectory($directory, FileSystemInterface:: CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS);
      $file_system->copy($filepath, $directory . '/' . basename($filepath), FileSystemInterface::EXISTS_REPLACE);

      $file = File::create([
        'filename' => basename($filepath),
        'uri' => "{$directory}/" . basename($filepath),
        'status' => NodeInterface::PUBLISHED,
        'uid' => \Drupal::currentUser()->id() ?? 1,
      ]);

      $file->setPermanent();
      $file->save();

      if ($file) {
        $service = \Drupal::service('silverback_ai_import.content');
        $ast = $service->getAstFromFilePath($file);

        $markdown = file_get_contents($ast->outputDirectory . '/content.md');
        $openai = \Drupal::service('silverback_ai_import.content');
        $data = $openai->extractBaseDataFromMarkdown($markdown);
        if (isset($data['choices'][0]['message']['content'])) {
          $content = \Drupal::service('silverback_ai_import.batch.import');
          $data = json_decode($data['choices'][0]['message']['content'], TRUE);
          $entity = Node::create([
            'type' => 'page',
            'title' => $data['title'],
            'langcode' => strtolower($data['language']),
          ]);
          $entity->save();
          $ast = $service->getAstFromFilePath($file);
          $flatten = $service->flattenAst($ast->content);
          $content->create($flatten, $entity);
          $form_state->setRedirectUrl($entity->toUrl());
        }
      }
    }

  }

}
