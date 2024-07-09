<?php

namespace Drupal\custom\EventSubscriber;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Core\Url;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class EntityLanguageRedirectSubscriber implements EventSubscriberInterface {

  protected LanguageManagerInterface $languageManager;

  protected RouteMatchInterface $routeMatch;

  public function __construct(LanguageManagerInterface $language_manager, RouteMatchInterface $route_match) {
    $this->languageManager = $language_manager;
    $this->routeMatch = $route_match;
  }

  public static function getSubscribedEvents() {
    // We need this subscriber to run after the router_listener service (which
    // has priority 32) so that the parameters are set into the request, but
    // before the EntityCanonicalViewSubscriber one (with the priority 28). So,
    // we set the priority to 30.
    return [
      KernelEvents::REQUEST => [
        ['onKernelRequest', 30],
      ]
    ];
  }

  public function onKernelRequest(RequestEvent $event): void {
    // In case the user tries to access a node in a language entity is not
    // translated to, we redirect to the entity in the original language and
    // display a warning message.
    if ($this->routeMatch->getRouteName() === 'entity.node.canonical') {
      $entity = $this->routeMatch->getCurrentRouteMatch()->getParameter('node');
      $requestedLanguageId = $this->languageManager->getCurrentLanguage(LanguageInterface::TYPE_CONTENT)->getId();
      if ($entity->language()->getId() != $requestedLanguageId) {
        $routeOptions = [
          'language' => $entity->language(),
        ];
        $routeParameters = [
          'node' => $entity->id(),
        ];
        $url = Url::fromRoute('entity.node.canonical', $routeParameters, $routeOptions);
        // Make sure we keep any query strings.
        $queryString = (string) $event->getRequest()->getQueryString();
        if ($queryString !== '') {
          $queryString .= '&';
        }
        $urlString = $url->toString() . '?' . $queryString . 'content_language_not_available=true&requested_language=' . $requestedLanguageId;

        // Add the necessary cache contexts to the response, as redirect
        // responses are cached as well.
        $metadata = new CacheableMetadata();
        $metadata->addCacheContexts(['languages:language_interface', 'url.query_args']);
        $response = new TrustedRedirectResponse($urlString);
        $response->addCacheableDependency($entity);
        $response->addCacheableDependency($metadata);

        $event->setResponse($response);
      }
    }
  }
}
