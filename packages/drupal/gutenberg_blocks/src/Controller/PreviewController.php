<?php declare(strict_types = 1);

namespace Drupal\gutenberg_blocks\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use \Drupal\silverback_external_preview\ExternalPreviewLink;

/**
 * Returns responses for Gutenberg Blocks routes.
 */
final class PreviewController extends ControllerBase {

  /**
   * The controller constructor.
   */
  public function __construct(
    private readonly ExternalPreviewLink $silverbackExternalPreviewExternalPreviewLink,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('silverback_external_preview.external_preview_link'),
    );
  }

  /**
   * Builds the response.
   */
  public function __invoke(NodeInterface $node): array {

    // @todo buttons.
    $build['buttons'] = [
      '#type' => 'item',
      '#markup' => $this->t('Preview buttons'),
    ];

    if (!$node instanceof Node) {
      throw new \InvalidArgumentException('The node parameter is missing.');
    }

    /** @var \Drupal\silverback_external_preview\ExternalPreviewLink $externalPreviewLink */
    $externalPreviewLink = \Drupal::service('silverback_external_preview.external_preview_link');
    $previewUrl = $externalPreviewLink->createPreviewUrlFromEntity($node, 'preview')->toString();
    $liveUrl = $externalPreviewLink->createPreviewUrlFromEntity($node, 'live')->toString();
    $build['preview'] = [
      '#theme' => 'silverback_external_preview_iframe',
      '#preview_url' => $previewUrl,
      '#live_url' => $liveUrl,
      '#width' => '100%',
      '#height' => '900',
    ];

    return $build;
  }

}
