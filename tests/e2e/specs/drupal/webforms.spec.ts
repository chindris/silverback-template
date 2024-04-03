import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test('Webforms work', async ({ page }) => {
  await page.goto(websiteUrl('/en/blocks-complete'));

  // Webform can be submitted.
  await page
    .frameLocator('.silverback-iframe iframe')
    .getByRole('button', { name: 'Send message' })
    .click();

  // Webform redirects to confirmation page.
  await expect(page).toHaveURL(websiteUrl('/en/page-minimal'));

  // Confirmation message is shown.
  await expect(
    page.locator(':text("Confirmation message for Contact webform")'),
  ).toHaveCount(1);

  // Confirmation message is gone after the page reload.
  await page.reload();
  await expect(
    page.locator(':text("Confirmation message for Contact webform")'),
  ).toHaveCount(0);

  // Webform from the German page redirects to the German confirmation page.
  await page.goto(websiteUrl('/de/blocks-complete'));
  await page
    .frameLocator('.silverback-iframe iframe')
    .getByRole('button', { name: 'Send message' })
    .click();
  // TODO: Find out why it does not work.
  //await expect(page).toHaveURL(websiteUrl('/de/page-minimal'));

  // TODO: Move all silverback-mono tests here?
  //  https://github.com/AmazeeLabs/silverback-mono/tree/development/packages/tests/silverback-iframe/playwright-tests
});
