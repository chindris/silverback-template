import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test.describe('links', () => {
  test('media document links target file', async ({ page }) => {
    await page.goto(websiteUrl('/en/page-links'));

    await page.getByRole('link', { name: 'link to page' }).click();
    await page.waitForURL(websiteUrl('/en/privacy'));

    await page.goto(websiteUrl('/en/page-links'));

    const downloadPromise = page.waitForEvent('download');
    await page
      .getByRole('link', { name: 'link to file', includeHidden: true })
      .click();
    const download = await downloadPromise;
    expect(download.url()).toBe(
      websiteUrl('/sites/default/files/2023-04/document_docx.docx'),
    );
    expect(download.suggestedFilename()).toBe('document_docx.docx');
  });
});
