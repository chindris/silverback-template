<?php

namespace Drupal\custom\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Menu\MenuTreeParameters;

class MiscController extends ControllerBase {

  public function websiteSettingsOverview(): array {
    // Simple version of
    /* @see \Drupal\system\Controller\SystemController::overview */

    /** @var \Drupal\Core\Menu\MenuLinkTreeInterface $menuLinkTree */
    $menuLinkTree = \Drupal::service('menu.link_tree');
    $parameters = new MenuTreeParameters();
    $parameters->setRoot('custom.website_settings')
      ->excludeRoot()
      ->setTopLevelOnly()
      ->onlyEnabledLinks();
    $tree = $menuLinkTree->load(NULL, $parameters);
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menuLinkTree->transform($tree, $manipulators);
    return $menuLinkTree->build($tree);
  }

}
