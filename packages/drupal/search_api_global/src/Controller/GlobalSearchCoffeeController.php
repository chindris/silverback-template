<?php

namespace Drupal\search_api_global\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityMalformedException;
use Drupal\Core\Entity\Exception\UndefinedLinkTemplateException;
use Drupal\views\Views;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class GlobalSearchCoffeeController extends ControllerBase {

  public function search(Request $request) {
    $commands = [];
    $search = $request->query->get('search');
    // More advanced example to include view results.
    if ($view = Views::getView('global_search')) {
      $view->setDisplay('search');
      if (!empty($search)) {
        $view->setExposedInput(['search_api_fulltext' => $search]);
      }
      $view->preExecute();
      $view->execute();

      foreach ($view->result as $row) {
        $entity = $row->_entity;
        $url = '';
        try {
          $url = $entity->toUrl()->toString();
        } catch (UndefinedLinkTemplateException|EntityMalformedException $e) {
          // Just do nothing here, in case we could not build a URL we will just
          // show an empty value there.
        }
        $commands[] = [
          'value' => $url,
          'label' => $entity->label() . ' (' . $entity->getEntityType()->getLabel() . ')<br/> <em style="font-size: 10px">' . $row->_item->getExcerpt() . '</em>',
        ];
      }
    }
    return new JsonResponse($commands);
  }
}
