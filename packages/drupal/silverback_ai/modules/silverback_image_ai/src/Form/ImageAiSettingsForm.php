<?php

declare(strict_types=1);

namespace Drupal\silverback_image_ai\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Configure Silverback Alt AI settings for this site.
 */
final class ImageAiSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'silverback_image_ai_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(): array {
    return ['silverback_image_ai.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {

    // ?? getenv('OPEN_AI_API_KEY');
    $open_ai_api_key = $this->configFactory->get('silverback_ai.settings')->get('open_ai_api_key');

    // ..
    if (!$open_ai_api_key) {
      $url = Url::fromRoute('silverback_ai.ai_settings');
      \Drupal::messenger()->addWarning($this->t('Open AI API key is missing. <strong><a href="@link">Click here</a></strong> to add your key.', [
        '@link' => $url->toString(),
      ]));
    }

    $form['credentials'] = [
      '#type' => 'details',
      '#title' => $this->t('Open AI model'),
      '#open' => TRUE,
    ];

    // @todo Make this dynamically
    $form['credentials']['ai_model'] = [
      '#type' => 'select',
      '#title' => $this->t('Model'),
      '#options' => [
        'gpt-4o-mini' => 'gpt-4o-mini',
        'gpt-4o-mini-2024-07-18' => 'gpt-4o-mini-2024-07-18',
      ],
      '#empty_option' => $this->t('- Select model -'),
      '#description' => $this->t('Leave empty to use the default <strong><em>gpt-4o-mini</em></strong> model.') . '<br />' .
      $this->t('<strong><a href="@href" target="_blank">Learn more</a></strong> about the models.', [
        '@href' => 'https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence',
      ]),
    ];

    $form['general'] = [
      '#type' => 'details',
      '#title' => $this->t('General settings'),
      '#open' => TRUE,
    ];

    $form['general']['debug_mode'] = [
      '#title' => $this->t('Debug mode'),
      '#type' => 'checkbox',
      '#default_value' => $this->configFactory->get('silverback_image_ai.settings')->get('debug_mode') ?? FALSE,
    ];

    $form['general']['words_length'] = [
      '#type' => 'number',
      '#title' => $this->t('Number of ALT text words to generate'),
      '#description' => $this->t('Define the number of ALT text words to be generated. Should be between 40 and 60 words.'),
      '#min' => 20,
      '#max' => 60,
      '#default_value' => $this->config('silverback_image_ai.settings')->get('words_length') ?? 30,
      '#field_suffix' => $this->t(' words'),
    ];

    $form['general']['alt_prefix'] = [
      '#type' => 'textfield',
      '#maxlength' => 40,
      '#title' => $this->t('Prefix'),
      '#default_value' => $this->config('silverback_image_ai.settings')->get('alt_prefix'),
      '#description' => $this->t("Optionally you can define a prefix which will be prepended to ALT text upon generation. Keep it short."),
    ];
    $form['general']['alt_suffix'] = [
      '#type' => 'textfield',
      '#maxlength' => 40,
      '#title' => $this->t('Suffix'),
      '#default_value' => $this->config('silverback_image_ai.settings')->get('alt_suffix'),
      '#description' => $this->t("Optionally you can define a suffix which will be appended to ALT text upon generation. Keep it short."),
    ];
    // Not working as expected.
    $form['general']['ai_context'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Context'),
      '#rows' => 3,
      '#access' => FALSE,
      '#description' => $this->t('Optionally, you can use a context to generate your ALT text. Keep it short and precise.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->config('silverback_image_ai.settings')
      ->set('ai_model', $form_state->getValue('ai_model'))
      ->set('debug_mode', $form_state->getValue('debug_mode'))
      ->set('words_length', intval($form_state->getValue('words_length')))
      ->set('alt_prefix', trim($form_state->getValue('alt_prefix')))
      ->set('alt_suffix', trim($form_state->getValue('alt_suffix')))
      ->set('ai_context', trim($form_state->getValue('ai_context')))
      ->save();
    parent::submitForm($form, $form_state);
  }

}