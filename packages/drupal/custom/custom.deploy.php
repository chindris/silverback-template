<?php

/**
 * Set up the Publisher OAuth Consumer and delete the Default one.
 */
function custom_deploy_set_consumers(array &$sandbox): string {
  // Skip for Silverback environments.
  // It might be used for OAuth development purpose only in Silverback
  // and can be set manually for this case.
  // Matches the default Publisher behavior
  // that disables Publisher OAuth for non Lagoon environments.
  if (getenv('SB_ENVIRONMENT')) {
    return t('Skipping for Silverback environment.');
  }

  // Check requirements.
  $publisherUrl = getenv('PUBLISHER_URL');
  if (!$publisherUrl) {
    throw new \Exception('PUBLISHER_URL environment variable is not set. It is required to setup the Publisher OAuth Consumer.');
  }

  $clientSecret = getenv('PUBLISHER_OAUTH2_CLIENT_SECRET');
  if (!$clientSecret) {
    throw new \Exception('PUBLISHER_OAUTH2_CLIENT_SECRET environment variable is not set. It is required to setup the Publisher OAuth Consumer.');
  }

  $entityTypeManager = \Drupal::entityTypeManager();
  $consumersStorage = $entityTypeManager->getStorage('consumer');
  $existingConsumers = $consumersStorage->loadMultiple();
  $hasPublisherConsumer = FALSE;
  /** @var \Drupal\consumers\Entity\ConsumerInterface $consumer */
  foreach ($existingConsumers as $consumer) {
    // As a side effect, delete the default consumer.
    // It is installed by the Consumers module.
    if ($consumer->getClientId() === 'default_consumer') {
      $consumer->delete();
    }
    if ($consumer->getClientId() === 'publisher') {
      $hasPublisherConsumer = TRUE;
    }
  }

  // Create the Publisher Consumer if it does not exist.
  if (!$hasPublisherConsumer) {
    $oAuthCallback = $publisherUrl . '/oauth/callback';
    $consumersStorage->create([
      'label' => 'Publisher',
      'client_id' => 'publisher',
      'is_default' => TRUE,
      'secret' => $clientSecret,
      'redirect' => $oAuthCallback,
    ])->save();
    return t('Created Publisher OAuth Consumer.');
  }

  return t('Publisher OAuth Consumer already exists.');
}

/**
 * Set up the Website OAuth Consumer.
 */
function custom_deploy_set_website_consumer(array &$sandbox): string {
  // Skip for Silverback environments.
  if (getenv('SB_ENVIRONMENT')) {
    return t('Skipping for Silverback environment.');
  }

  // Check requirements.
  $websiteUrl = getenv('NETLIFY_URL');
  if (!$websiteUrl) {
    throw new \Exception('NETLIFY_URL environment variable is not set. It is required to setup the Website OAuth Consumer.');
  }

  $clientSecret = getenv('WEBSITE_OAUTH2_CLIENT_SECRET');
  if (!$clientSecret) {
    throw new \Exception('WEBSITE_OAUTH2_CLIENT_SECRET environment variable is not set. It is required to setup the Website OAuth Consumer.');
  }

  $entityTypeManager = \Drupal::entityTypeManager();
  $consumersStorage = $entityTypeManager->getStorage('consumer');
  $existingConsumers = $consumersStorage->loadMultiple();
  $hasWebsiteConsumer = FALSE;
  /** @var \Drupal\consumers\Entity\ConsumerInterface $consumer */
  foreach ($existingConsumers as $consumer) {
    if ($consumer->getClientId() === 'website') {
      $hasWebsiteConsumer = TRUE;
    }
  }

  // Create the Website Consumer if it does not exist.
  if (!$hasWebsiteConsumer) {
    $oAuthCallback = $websiteUrl . '/api/auth/callback/drupal';
    $consumersStorage->create([
      'label' => 'Website',
      'client_id' => 'website',
      'is_default' => FALSE,
      'secret' => $clientSecret,
      'redirect' => $oAuthCallback,
    ])->save();
    return t('Created Website OAuth Consumer.');
  }

  return t('Website OAuth Consumer already exists.');
}
