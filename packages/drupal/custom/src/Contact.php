<?php

namespace Drupal\custom;

use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\graphql_directives\DirectiveArguments;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Helper service to create a contact
 */
class Contact {
  use StringTranslationTrait;

  /**
   * The custom webform service.
   *
   * @var \Drupal\custom\Webform
   */
  protected Webform $webformService;

  /**
   * Contact constructor.
   */
  public function __construct(
    Webform $webformService
  ) {
    $this->webformService = $webformService;
  }

  /**
   * Creates a contact webform entry.
   */
  public function create(DirectiveArguments $args): array {
    try {
      $submissionData = [
        'name' => $args->args['contact']['name'],
        'email' => $args->args['contact']['email'],
        'subject' => $args->args['contact']['subject'],
        'message' => $args->args['contact']['message'],
      ];
      $webformSubmission = $this->webformService->createSubmission('contact', $submissionData);

      // If we get an array from the createSubmission call, then it means there
      // were errors during the insert / validate operation, so we just return
      // them.
      if (is_array($webformSubmission)) {
        return [
          'errors' => $this->formatErrors($webformSubmission),
          'contact' => NULL,
        ];
      }

      // We successfully submitted the data.
      if (is_object($webformSubmission) && $webformSubmission instanceof WebformSubmissionInterface) {
        $submittedData = $webformSubmission->getData();
        return [
          'errors' => NULL,
          'contact' => [
            'id' => $webformSubmission->id(),
            'name' => $submittedData['name'],
            'email' => $submittedData['email'],
            'subject' => $submittedData['subject'],
            'message' => $submittedData['message'],
          ],
        ];
      }
    } catch (\InvalidArgumentException $e) {
      return [
        'contact' => NULL,
        'errors' => [
          [
            'message' => $e->getMessage(),
            'key' => 'invalid_webform'
          ]
        ]
      ];
    } catch (\Exception $e) {
      return [
        'contact' => NULL,
        'errors' => [
          [
            'message' => $e->getMessage(),
            'key' => 'invalid_input'
          ]
        ]
      ];
    }

    // We should actually never get here... if we do, we don't know what
    // happened.
    return [
      'contact' => NULL,
      'errors' => [
        [
          'message' => 'Unknown error',
          'key' => 'unknown_error',
        ]
      ]
    ];
  }

  /**
   * Helper method to arrange a set of webform submission errors in a way that
   * can be used by the MutationError graphl type.
   */
  protected function formatErrors(array $webformSubmissionErrors) {
    $formattedErrors = [];
    foreach ($webformSubmissionErrors as $fieldName => $error) {
      $formattedErrors[] = [
        'message' => $error->__toString(),
        'key' => 'invalid_field_' . $fieldName,
        'field' => $fieldName,
      ];
    }
    return $formattedErrors;
  }
}
