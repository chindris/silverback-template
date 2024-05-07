<?php

namespace Drupal\entity_create_split\EventSubscriber;

use Drupal\Core\Entity\EntityDisplayRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Core\Url;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class EntityCreateSplitRequestSubscriber implements EventSubscriberInterface {

  /**
   * The current route match service.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * The entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity display repository service.
   * @var \Drupal\Core\Entity\EntityDisplayRepositoryInterface
   */
  protected $entityDisplayRepository;

  /**
   * Constructs a EntityCreateSplitRequestSubscriber object.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   */
  public function __construct(
    RouteMatchInterface $route_match,
    EntityTypeManagerInterface $entity_type_manager,
    EntityDisplayRepositoryInterface $entity_display_repository
  ) {
    $this->routeMatch = $route_match;
    $this->entityTypeManager = $entity_type_manager;
    $this->entityDisplayRepository = $entity_display_repository;
  }

  /**
   * {@inheritDoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['onKernelRequest', 0];
    return $events;
  }

  public function onKernelRequest(RequestEvent $event) {
    $supportedRoutes = $this->supportedRoutes();
    $currentRouteName = $this->routeMatch->getRouteName();
    if (empty($supportedRoutes[$currentRouteName])) {
      return;
    }
    $entityTypeId = $supportedRoutes[$currentRouteName];
    $entityTypeDefinition =$this->entityTypeManager->getDefinition($entityTypeId);
    // Make sure the entity has the split form class handler defined.
    if (!$entityTypeDefinition->getFormClass('split')) {
      return;
    }
    $bundleEntityType = $entityTypeDefinition->getBundleEntityType();
    $bundle = $this->routeMatch->getParameter($bundleEntityType);
    // If, for some reason, we can't load the bundle from the current request,
    // then we just stop here.
    if (empty($bundle)) {
      return;
    }
    $formModes = $this->entityDisplayRepository->getFormModeOptionsByBundle($entityTypeId, $bundle->id());
    // If the "split" form mode is not setup on the current entity bundle, then
    // we also just stop here.
    if (empty($formModes['split'])) {
      return;
    }

    // If we got here, it means that we are on a entity add route, and the
    // entity bundle has the split form mode configure, which means we need to
    // redirect to the entity_create_split.create route for that entity bundle.
    $createSplitUrl = Url::fromRoute('entity_create_split.create', [
      'entity_type' => $entityTypeId,
      'bundle' => $bundle->id(),
    ]);
    $response = new TrustedRedirectResponse($createSplitUrl->setAbsolute()
      ->toString(), 302);
    $event->setResponse($response);
  }

  /**
   * Helper, temporary, method to define the routes which are checked by the
   * event subscriber for redirecting the user to the split form.
   *
   * @return string[]
   */
  protected function supportedRoutes() {
    return [
      'node.add' => 'node',
      'media.add' => 'media',
    ];
  }
}
