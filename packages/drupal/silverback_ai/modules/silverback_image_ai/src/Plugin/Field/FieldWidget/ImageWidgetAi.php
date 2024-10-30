<?php

declare(strict_types=1);

namespace Drupal\silverback_image_ai\Plugin\Field\FieldWidget;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Image\ImageFactory;
use Drupal\Core\Render\ElementInfoManagerInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\file\Entity\File;
use Drupal\file\Plugin\Field\FieldWidget\FileWidget;
use Drupal\image\Entity\ImageStyle;

/**
 * Defines the 'image_image_ai' field widget.
 *
 * @FieldWidget(
 *   id = "image_image_ai",
 *   label = @Translation("Image AI"),
 *   field_types = {
 *     "image"
 *   }
 * )
 */
class ImageWidgetAi extends FileWidget {

  /**
   * The image factory service.
   *
   * @var \Drupal\Core\Image\ImageFactory
   */
  protected $imageFactory;

  /**
   * Constructs an ImageWidgetAi object.
   *
   * @param string $plugin_id
   *   The plugin_id for the widget.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the widget is associated.
   * @param array $settings
   *   The widget settings.
   * @param array $third_party_settings
   *   Any third party settings.
   * @param \Drupal\Core\Render\ElementInfoManagerInterface $element_info
   *   The element info manager service.
   * @param \Drupal\Core\Image\ImageFactory $image_factory
   *   The image factory service.
   */
  public function __construct($plugin_id, $plugin_definition, FieldDefinitionInterface $field_definition, array $settings, array $third_party_settings, ElementInfoManagerInterface $element_info, ImageFactory $image_factory = NULL) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $third_party_settings, $element_info);
    $this->imageFactory = $image_factory ?: \Drupal::service('image.factory');
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'progress_indicator' => 'throbber',
      'preview_image_style' => 'thumbnail',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element = parent::settingsForm($form, $form_state);

    $element['preview_image_style'] = [
      '#title' => $this->t('Preview image style'),
      '#type' => 'select',
      '#options' => image_style_options(FALSE),
      '#empty_option' => '<' . $this->t('no preview') . '>',
      '#default_value' => $this->getSetting('preview_image_style'),
      '#description' => $this->t('The preview image will be shown while editing the content.'),
      '#weight' => 15,
    ];

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = parent::settingsSummary();

    $image_styles = image_style_options(FALSE);
    // Unset possible 'No defined styles' option.
    unset($image_styles['']);
    // Styles could be lost because of enabled/disabled modules that defines
    // their styles in code.
    $image_style_setting = $this->getSetting('preview_image_style');
    if (isset($image_styles[$image_style_setting])) {
      $preview_image_style = $this->t('Preview image style: @style', ['@style' => $image_styles[$image_style_setting]]);
    }
    else {
      $preview_image_style = $this->t('No preview');
    }

    array_unshift($summary, $preview_image_style);

    return $summary;
  }

  /**
   * Overrides \Drupal\file\Plugin\Field\FieldWidget\FileWidget::formMultipleElements().
   *
   * Special handling for draggable multiple widgets and 'add more' button.
   */
  protected function formMultipleElements(FieldItemListInterface $items, array &$form, FormStateInterface $form_state) {
    $elements = parent::formMultipleElements($items, $form, $form_state);

    $cardinality = $this->fieldDefinition->getFieldStorageDefinition()->getCardinality();
    $file_upload_help = [
      '#theme' => 'file_upload_help',
      '#description' => '',
      '#upload_validators' => $elements[0]['#upload_validators'],
      '#cardinality' => $cardinality,
    ];
    if ($cardinality == 1) {
      // If there's only one field, return it as delta 0.
      if (empty($elements[0]['#default_value']['fids'])) {
        $file_upload_help['#description'] = $this->getFilteredDescription();
        $elements[0]['#description'] = \Drupal::service('renderer')->renderPlain($file_upload_help);
      }
    }
    else {
      $elements['#file_upload_description'] = $file_upload_help;
    }

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element = parent::formElement($items, $delta, $element, $form, $form_state);

    $field_settings = $this->getFieldSettings();

    // Add image validation.
    $element['#upload_validators']['FileIsImage'] = [];

    // Add upload dimensions validation.
    if ($field_settings['max_resolution'] || $field_settings['min_resolution']) {
      $element['#upload_validators']['FileImageDimensions'] = [
        'maxDimensions' => $field_settings['max_resolution'],
        'minDimensions' => $field_settings['min_resolution'],
      ];
    }

    $extensions = $field_settings['file_extensions'];
    $supported_extensions = $this->imageFactory->getSupportedExtensions();

    // If using custom extension validation, ensure that the extensions are
    // supported by the current image toolkit. Otherwise, validate against all
    // toolkit supported extensions.
    $extensions = !empty($extensions) ? array_intersect(explode(' ', $extensions), $supported_extensions) : $supported_extensions;
    $element['#upload_validators']['FileExtension']['extensions'] = implode(' ', $extensions);

    // Add mobile device image capture acceptance.
    $element['#accept'] = 'image/*';

    // Add properties needed by process() method.
    $element['#preview_image_style'] = $this->getSetting('preview_image_style');
    $element['#title_field'] = $field_settings['title_field'];
    $element['#title_field_required'] = $field_settings['title_field_required'];
    $element['#alt_field'] = $field_settings['alt_field'];
    $element['#alt_field_required'] = $field_settings['alt_field_required'];
    // Default image.
    $default_image = $field_settings['default_image'];
    if (empty($default_image['uuid'])) {
      $default_image = $this->fieldDefinition->getFieldStorageDefinition()->getSetting('default_image');
    }
    // Convert the stored UUID into a file ID.
    if (!empty($default_image['uuid']) && $entity = \Drupal::service('entity.repository')->loadEntityByUuid('file', $default_image['uuid'])) {
      $default_image['fid'] = $entity->id();
    }
    $element['#default_image'] = !empty($default_image['fid']) ? $default_image : [];
    return $element;
  }

  /**
   * Form API callback: Processes an image_image field element.
   *
   * Expands the image_image type to include the alt and title fields.
   *
   * This method is assigned as a #process callback in formElement() method.
   */
  public static function process($element, FormStateInterface $form_state, $form) {
    $item = $element['#value'];
    $item['fids'] = $element['fids']['#value'];

    $element['#theme'] = 'image_widget';
    // Add the image preview.
    if (!empty($element['#files']) && $element['#preview_image_style']) {
      $file = reset($element['#files']);
      $variables = [
        'style_name' => $element['#preview_image_style'],
        'uri' => $file->getFileUri(),
      ];

      $dimension_key = $variables['uri'] . '.image_preview_dimensions';
      // Determine image dimensions.
      if (isset($element['#value']['width']) && isset($element['#value']['height'])) {
        $variables['width'] = $element['#value']['width'];
        $variables['height'] = $element['#value']['height'];
      }
      elseif ($form_state->has($dimension_key)) {
        $variables += $form_state->get($dimension_key);
      }
      else {
        $image = \Drupal::service('image.factory')->get($file->getFileUri());
        if ($image->isValid()) {
          $variables['width'] = $image->getWidth();
          $variables['height'] = $image->getHeight();
        }
        else {
          $variables['width'] = $variables['height'] = NULL;
        }
      }

      // Add the additional alt and title fields.
      $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
        <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
          </svg>';

      $element['ai_container'] = [
        '#type' => 'container',
        '#attributes' => [
          'style' => ['text-align: right'],
        ],
      ];
      $element['ai_container']['alt_ai_generate'] = [
        '#type' => 'submit',
        '#value' => Markup::create('Re-generate Alt text'),
        '#weight' => -12,
        '#suffix' => Markup::create($icon),
        '#attributes' => [
          'class' => ['button--extrasmall', 'button', 'js-form-submit', 'form-submit'],
          'style' => ['width: 164px; float: right'],
        ],
        '#ajax' => [
          'callback' => static::class . '::myAjaxCallback',
          'event' => 'click',
          'wrapper_id' => $element['#attributes']['data-drupal-selector'] . '-alt',
            // 'wrapper' => $form['field_media_image']['#id'],
          'fids' => $item['fids'],
          'langcode' => $form_state->get('langcode'),
          'progress' => [
            'type' => 'throbber',
            'message' => t('Generating alt text...'),
          ],
        ],
      ];

      $element['preview'] = [
        '#weight' => -10,
        '#theme' => 'image_style',
        '#width' => $variables['width'],
        '#height' => $variables['height'],
        '#style_name' => $variables['style_name'],
        '#uri' => $variables['uri'],
      ];

      // Store the dimensions in the form so the file doesn't have to be
      // accessed again. This is important for remote files.
      $form_state->set($dimension_key, ['width' => $variables['width'], 'height' => $variables['height']]);

      // [AI utilities]
      if (!isset($item['alt'])) {
        $service = \Drupal::service('silverback_image_ai.utilities');
        $langcode = $form_state->get('langcode') ?? 'en';
        $item['alt'] = $service->generateImageAlt($file, $langcode);
      }
      // [end AI utilities]
    }
    elseif (!empty($element['#default_image'])) {
      $default_image = $element['#default_image'];
      $file = File::load($default_image['fid']);
      if (!empty($file)) {
        $element['preview'] = [
          '#weight' => -10,
          '#theme' => 'image_style',
          '#width' => $default_image['width'],
          '#height' => $default_image['height'],
          '#style_name' => $element['#preview_image_style'],
          '#uri' => $file->getFileUri(),
        ];
      }
    }

    $element['alt'] = [
      '#title' => new TranslatableMarkup('Alternative text'),
      '#type' => 'textfield',
      '#default_value' => $item['alt'] ?? '',
      '#description' => new TranslatableMarkup('Short description of the image used by screen readers and displayed when the image is not loaded. This is important for accessibility.'),
      // @see https://www.drupal.org/node/465106#alt-text
      '#maxlength' => 512,
      '#weight' => -12,
      '#access' => (bool) $item['fids'] && $element['#alt_field'],
      '#required' => $element['#alt_field_required'],
      '#element_validate' => $element['#alt_field_required'] == 1 ? [[static::class, 'validateRequiredFields']] : [],
      '#attributes' => [
        'id' => [$element['#attributes']['data-drupal-selector'] . '-alt'],
      ],
    ];

    $element['title'] = [
      '#type' => 'textfield',
      '#title' => new TranslatableMarkup('Title'),
      '#default_value' => $item['title'] ?? '',
      '#description' => new TranslatableMarkup('The title is used as a tool tip when the user hovers the mouse over the image.'),
      '#maxlength' => 1024,
      '#weight' => -11,
      '#access' => (bool) $item['fids'] && $element['#title_field'],
      '#required' => $element['#title_field_required'],
      '#element_validate' => $element['#title_field_required'] == 1 ? [[static::class, 'validateRequiredFields']] : [],
    ];
    return parent::process($element, $form_state, $form);
  }

  /**
   * Validate callback for alt and title field, if the user wants them required.
   *
   * This is separated in a validate function instead of a #required flag to
   * avoid being validated on the process callback.
   */
  public static function validateRequiredFields($element, FormStateInterface $form_state) {
    // Only do validation if the function is triggered from other places than
    // the image process form.
    $triggering_element = $form_state->getTriggeringElement();
    if (!empty($triggering_element['#submit']) && in_array('file_managed_file_submit', $triggering_element['#submit'], TRUE)) {
      $form_state->setLimitValidationErrors([]);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function calculateDependencies() {
    $dependencies = parent::calculateDependencies();
    $style_id = $this->getSetting('preview_image_style');
    /** @var \Drupal\image\ImageStyleInterface $style */
    if ($style_id && $style = ImageStyle::load($style_id)) {
      // If this widget uses a valid image style to display the preview of the
      // uploaded image, add that image style configuration entity as dependency
      // of this widget.
      $dependencies[$style->getConfigDependencyKey()][] = $style->getConfigDependencyName();
    }
    return $dependencies;
  }

  /**
   * {@inheritdoc}
   */
  public function onDependencyRemoval(array $dependencies) {
    $changed = parent::onDependencyRemoval($dependencies);
    $style_id = $this->getSetting('preview_image_style');
    /** @var \Drupal\image\ImageStyleInterface $style */
    if ($style_id && $style = ImageStyle::load($style_id)) {
      if (!empty($dependencies[$style->getConfigDependencyKey()][$style->getConfigDependencyName()])) {
        /** @var \Drupal\image\ImageStyleStorageInterface $storage */
        $storage = \Drupal::entityTypeManager()->getStorage($style->getEntityTypeId());
        $replacement_id = $storage->getReplacementId($style_id);
        // If a valid replacement has been provided in the storage, replace the
        // preview image style with the replacement.
        if ($replacement_id && ImageStyle::load($replacement_id)) {
          $this->setSetting('preview_image_style', $replacement_id);
        }
        // If there's no replacement or the replacement is invalid, disable the
        // image preview.
        else {
          $this->setSetting('preview_image_style', '');
        }
        // Signal that the formatter plugin settings were updated.
        $changed = TRUE;
      }
    }
    return $changed;
  }

  // Get the value from example select field and fill.

  /**
   * The textbox with the selected text.
   */
  public static function myAjaxCallback(array &$form, FormStateInterface $form_state) {
    $triggering_element = $form_state->getTriggeringElement();
    $wrapper_id = $triggering_element['#ajax']['wrapper_id'];
    $fids = $triggering_element['#ajax']['fids'];
    $langcode = $triggering_element['#ajax']['langcode'] ?? 'en';
    // @todo get the file
    $fid = reset($fids);
    $file = NULL;
    // $url = NULL;
    if ($fid) {
      $file = File::load($fid);
    }
    $response = new AjaxResponse();
    if ($file) {
      $service = \Drupal::service('silverback_image_ai.utilities');
      $alt_text = $service->generateImageAlt($file, $langcode);
      if ($alt_text) {
        $response->addCommand(new InvokeCommand('#' . $wrapper_id, 'val', [$alt_text]));
      }
    }
    return $response;
  }

}
