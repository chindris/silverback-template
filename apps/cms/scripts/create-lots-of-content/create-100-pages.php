<?php

use Drupal\Component\Utility\Random;
use Drupal\media\Entity\Media;
use Drupal\node\Entity\Node;


/** @var \Drupal\file\FileRepositoryInterface $fileRepository */
$fileRepository = \Drupal::service('file.repository');
$random = new Random();

$imageData = file_get_contents(__DIR__ . '/tiny.png');

for ($pageIndex = 1; $pageIndex <= 100; $pageIndex++) {

  // Prepare images.
  /** @var \Drupal\file\FileInterface[] $images */
  $images = [];
  for ($i = 1; $i <= 4; $i++) {
    $images[$i] = $fileRepository->writeData($imageData, "public://" . $random->machineName(32) . ".png");
  }

  // Prepare image media entities.
  /** @var \Drupal\media\MediaInterface[] $media */
  $media = [];
  foreach ($images as $i => $image) {
    $media[$i] = Media::create([
      'name' => $random->name(),
      'bundle' => 'image',
      'uid' => 1,
      'status' => TRUE,
      'field_media_image' => [
        'target_id' => $image->id(),
        'alt' => 'Alt text',
        'title' => 'Title text',
      ],
    ]);
    $media[$i]->save();
  }
  $mediaIds = array_map(fn ($media) => $media->id(), $media);

  // Create a page.
  $title = $random->name();
  $node = Node::create([
    'type' => 'page',
    'status' => TRUE,
    'uid' => 1,
    'title' => $title,
    'moderation_state' => 'published',
    'body' => [
      'value' => pageBody($mediaIds, FALSE),
      'format' => 'gutenberg',
      'summary' => '',
    ],
  ]);
  $node->addTranslation('de', [
    'title' => $title . ' DE',
    'uid' => 1,
    'body' => [
      'value' => pageBody($mediaIds, TRUE),
      'format' => 'gutenberg',
      'summary' => '',
    ],
  ]);
  $node->save();
}

function pageBody(array $mediaIds, bool $isGerman): string {
  $suffix = $isGerman ? ' DE' : '';
  return <<<EOT
<!-- wp:custom/hero {"mediaEntityIds":["$mediaIds[1]"],"headline":"Stub page$suffix","lead":"Lead text$suffix"} /-->

<!-- wp:custom/content -->
<!-- wp:paragraph -->
<p>Some content$suffix</p>
<!-- /wp:paragraph -->

<!-- wp:drupalmedia/drupal-media-entity {"mediaEntityIds":["$mediaIds[2]"],"caption":"Caption$suffix"} /-->

<!-- wp:paragraph -->
<p>Some content$suffix</p>
<!-- /wp:paragraph -->

<!-- wp:drupalmedia/drupal-media-entity {"mediaEntityIds":["$mediaIds[3]"],"caption":"Caption$suffix"} /-->

<!-- wp:paragraph -->
<p><meta charset="utf-8">Some content$suffix</p>
<!-- /wp:paragraph -->

<!-- wp:drupalmedia/drupal-media-entity {"mediaEntityIds":["$mediaIds[4]"],"caption":"Caption$suffix"} /-->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
<!-- /wp:custom/content -->
EOT;
}


