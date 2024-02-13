<?php

namespace Drupal\custom;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\graphql_directives\DirectiveArguments;
use Drupal\silverback_iframe\WebformSubmissionForm;

class Contact {
  use StringTranslationTrait;

  /**
   * The entity type manager, to query and load pages.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * Contact constructor.
   */
  public function __construct(
    EntityTypeManagerInterface $entityTypeManager
  ) {
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * Creates a contact webform entry.
   */
  public function create(DirectiveArguments $args): array {
    $webform = $this->entityTypeManager->getStorage('webform')->load('contact');
    $values = [
      'webform_id' => 'contact',
      'entity_type' => NULL,
      'entity_id' => NULL,
      'data' => [
        'name' => $args->args['contact']['name'],
        'email' => $args->args['contact']['email'],
        'subject' => $args->args['contact']['subject'],
        'message' => $args->args['contact']['message'],
      ],
    ];
    $isOpen = WebformSubmissionForm::isOpen($webform);
    if ($isOpen === TRUE) {
      // Validate submission.
      $errors = WebformSubmissionForm::validateFormValues($values);

      // Check there are no validation errors.
      if (!empty($errors)) {
        $contactSubmissionErrors = [];
        foreach ($errors as $fieldName => $error) {
          $contactSubmissionErrors[] = [
            'message' => $error->__toString(),
            'key' => $fieldName,
            'field' => $fieldName,
          ];
        }
        return [
          'errors' => $contactSubmissionErrors,
          'contact' => NULL,
        ];
      }
      else {
        // Submit values and get submission ID.
        $webformSubmission = WebformSubmissionForm::submitFormValues($values);
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
    }
    return [
      'errors' => [
        [
          'message' => $this->t('The contact form is not open'),
          'key' => 'contact_not_open',
        ]
      ],
      'contact' => NULL,
    ];
  }
}
