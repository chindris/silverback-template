<?php

declare(strict_types=1);

namespace Drupal\silverback_ai;

/**
 * @todo Interface for the token usage service.
 */
interface TokenUsageInterface {

  /**
   *
   */
  public function addTokenUsage(array $context): void;

}
