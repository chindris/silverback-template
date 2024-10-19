<?php

namespace Drupal\silverback_image_ai\Drush\Commands;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\silverback_image_ai\MediaUpdaterBatch;
use Drush\Attributes as CLI;
use Drush\Commands\DrushCommands;
use Drush\Exceptions\UserAbortException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A Drush commandfile.
 */
final class SilverbackImageAiCommands extends DrushCommands {

  /**
   * Constructs a SilverbackImageAiCommands object.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly MediaUpdaterBatch $batch,
  ) {
    parent::__construct();
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('silverback_image_ai.batch.updater'),
    );
  }

  /**
   * Command description here.
   */
  #[CLI\Command(name: 'silverback-image-ai:alt:generate', aliases: ['slb:alt:g'])]
  #[CLI\Option(name: 'update-all', description: 'Update all image alt texts. ATTENTION: This will overwrite existing alt texts.')]
  #[CLI\Usage(name: 'silverback-image-ai:alt:generate', description: 'Generate alt text for media images.')]
  public function commandName($options = [
    'update-all' => FALSE,
  ]) {
    $media_entities = [];
    if ($options['update-all']) {
      $this->io()->warning(dt('ATTENTION: This action will overwrite all existing media image alt texts.'));
      if ($this->io()->confirm(dt('Are you sure you want to update all existing alt texts?'), FALSE)) {
        $media_entities = $this->getMediaEntities();
        $this->batch->create($media_entities);
      }
      else {
        throw new UserAbortException();
      }
    }
    else {
      $media_entities = $this->getMediaEntities(TRUE);
      $this->batch->create($media_entities);
    }

    // Temp.
    // $media_entities = array_slice($this->getMediaEntities(), 0, 2);.
    $this->logger()->success(dt('@count media images updated.', [
      '@count' => count($media_entities),
    ]));
  }

  /**
   * Gets a list of media entities with optional filtering.
   *
   * This function loads media entities of the 'image' bundle and iterates over
   * their translations. It builds and returns an array of entities with language
   * codes. If the $filter parameter is TRUE, only entities with non-empty
   * alternative text for the image field are included.
   *
   * @param bool $filter
   *   (optional) Whether to filter entities by non-empty 'alt' text. Defaults to FALSE.
   *
   * @return array
   *   An array of arrays, each containing:
   *   - entity: The media entity translation.
   *   - langcode: The language code of the translation.
   */
  private function getMediaEntities(bool $filter = FALSE) {
    $entities = [];
    $media_entities = $this->entityTypeManager->getStorage('media')->loadByProperties([
      'bundle' => 'image',
    ]);
    foreach ($media_entities as $media) {
      foreach ($media->getTranslationLanguages() as $langcode => $translation) {
        $entity = $media->getTranslation($langcode);
        if ($filter && !$entity->field_media_image->alt) {
          $entities[] = [
            'entity' => $entity,
            'langcode' => $langcode,
          ];
        }
        elseif (!$filter) {
          $entities[] = [
            'entity' => $entity,
            'langcode' => $langcode,
          ];
        }
      }
    }
    return $entities;
  }

}
