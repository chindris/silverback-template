<?php

declare(strict_types=1);

namespace Drupal\silverback_ai_import;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\file\Entity\File;
use Drupal\file\FileInterface;
use Drupal\node\Entity\Node;
use Drupal\silverback_ai\HttpClient\OpenAiHttpClient;
use Drupal\silverback_ai\TokenUsage;
use GuzzleHttp\Exception\RequestException;

/**
 * Contains general AI services, such as a genberal request method and more.
 */
final class AiRequestService {

  private const DEFAULT_AI_MODEL = 'gpt-4o-mini';

  /**
   * Constructs a service object.
   */
  public function __construct(
    private readonly RouteMatchInterface $routeMatch,
    private readonly AccountProxyInterface $currentUser,
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly LoggerChannelFactoryInterface $loggerFactory,
    private readonly ConfigFactoryInterface $configFactory,
    private readonly OpenAiHttpClient $silverbackAiOpenaiHttpClient,
    private readonly TokenUsage $tokenUsage,
  ) {
  }

  /**
   * @todo
   */
  public function request(string $prompt, string $model = self::DEFAULT_AI_MODEL, array $context = []) {

    $payload = [
      'model' => $model,
      'messages' => [
        [
          'role' => 'user',
          'content' => [
            [
              'type' => 'text',
              'text' => $prompt,
            ],
          ],
        ],
      ],
    ];

    try {
      $response = $this->silverbackAiOpenaiHttpClient->post('chat/completions', [
        'json' => $payload,
      ]);
    } catch (\Exception $e) {
      throw new \Exception('HTTP request failed: ' . $e->getMessage());
    }

    $responseBodyContents = $response->getBody()->getContents();
    $response = json_decode($responseBodyContents, TRUE, 512, JSON_THROW_ON_ERROR);
    $this->logUsage($response, $context);

    return $response;
  }

  /**
   * Logs the usage of the Silverback Image AI module.
   *
   * This method updates the response body with module and entity details and
   * creates a new usage entry using the Silverback AI Token Usage service.
   *
   * @param array $response_body
   *   An associative array that will be enhanced with module and entity information.
   * @param \Drupal\Core\Entity\EntityInterface|null $entity
   *   The entity for which to log usage details. If provided, its id, type,
   *   and revision id will be added to the response body if the entity is revisionable.
   *
   * @throws \Exception
   */
  public function logUsage(array $response_body, array $context) {
    $response_body['module'] = $context['module'] ?? 'silverback_ai';
    if ($context['entity']) {
      $entity = $context['entity'];
      $response_body['entity_id'] = (string) $entity->id();
      $response_body['entity_type_id'] = (string) $entity->getEntityTypeId();
      if ($entity->getEntityType()->isRevisionable()) {
        $response_body['entity_revision_id'] = (string) $entity->getRevisionId();
      }
    }
    $this->tokenUsage->createUsageEntry($response_body);
  }
}
