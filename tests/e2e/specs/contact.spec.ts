import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test.describe('contact (mutation example)', () => {
  test('succesfull contact submission', async ({ page }) => {
    await page.goto(websiteUrl('/en/contact'));
    const content = await page.getByRole('main');
    await content.getByPlaceholder('Name').fill('John Doe');
    await content.getByPlaceholder('Email').fill('john@doe.com');
    await content.getByPlaceholder('Subject').fill('Lorem ipsum');
    await content
      .getByPlaceholder('Message')
      .fill(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pretium aliquam magna.',
      );
    await content.getByText('Submit').click();
    await expect(
      content.getByText('The contact has been submitted.'),
    ).toBeVisible();
  });

  test('invalid e-mail address', async ({ page }) => {
    await page.goto(websiteUrl('/en/contact'));
    const content = await page.getByRole('main');
    await content.getByPlaceholder('Name').fill('John Doe');
    await content.getByPlaceholder('Email').fill('john');
    await content.getByPlaceholder('Subject').fill('Lorem ipsum');
    await content
      .getByPlaceholder('Message')
      .fill(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pretium aliquam magna.',
      );
    await content.getByText('Submit').click();
    await expect(
      content.getByText(
        'The email address john is not valid. Use the format user@example.com.',
      ),
    ).toBeVisible();
  });
});
