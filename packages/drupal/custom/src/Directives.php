<?php declare(strict_types = 1);

namespace Drupal\custom;

use Drupal\Core\Datetime\DateFormatterInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\user\Entity\User;

/**
 * Custom GraphQL directives.
 */
final class Directives {

  /**
   * Constructs a Directives object.
   */
  public function __construct(
    private readonly AccountProxyInterface $currentUser,
    private readonly DateFormatterInterface $dateFormatter,
  ) {}

  /**
   * Wrapper of current user data to be used for the OAuth demo.
   */
  public function currentUser(): array|null {
    $account = \Drupal::currentUser();
    if ($this->currentUser->isAnonymous()) {
      return NULL;
    }
    else {
      $user = User::load($account->id());
      $memberFor = $this->dateFormatter->formatTimeDiffSince($user->getCreatedTime());
      return [
        'id' => $account->id(),
        'name' => $account->getDisplayName(),
        'email' => $account->getEmail(),
        'memberFor' => $memberFor,
      ];
    }
  }

}
