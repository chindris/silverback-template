## INTRODUCTION

The Silverback AI module is a base module

## REQUIREMENTS

- Webform (using some webform elements on reporting)

## INSTALLATION

Install as you would normally install a contributed Drupal module.
See: <https://www.drupal.org/node/895232> for further information.

## CONFIGURATION

- Open AI credentials can be set on: `/admin/config/system/silverback-ai-settings`.
It is recommended though to add the Open AI Api key as environment variable (`OPEN_AI_API_KEY`).

## USAGE TRACKING

- All Silverback AI modules should report token usage using the `TokenUsage` service. The report can be seen at: `/admin/reports/silverback-ai-usage`.
