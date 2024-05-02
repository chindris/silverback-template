import { saveWebpage } from '@amazeelabs/save-webpage';
import { expect, Page, test } from '@playwright/test';
import { execSync } from 'child_process';

import { cmsUrl } from '../helpers/url';

const baseDir = '../../packages/ui/static/stories/webforms';
const iframeResizerSelector =
  'script[src*="silverback_iframe/js/iframeResizer.contentWindow.min.js"]';

test('Export webforms for styling', async ({ page }) => {
  execSync(`rm -rf ${baseDir}`);

  const baseUrl = cmsUrl('/en/form/styling?iframe=true&no_css=true');

  await page.goto(baseUrl);
  await expect(page.locator(iframeResizerSelector)).toHaveCount(1);
  await savePage(page, 'idle');

  await page.getByLabel('Email with a confirmation').fill('asd@asd');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(
    page.locator('[data-drupal-messages] [role="alert"]'),
  ).toBeVisible();
  await expect(page.locator(iframeResizerSelector)).toHaveCount(1);
  await savePage(page, 'error');
});

async function savePage(page: Page, name: string) {
  await saveWebpage({
    directory: `${baseDir}/${name}`,
    url: page.url(),
    content: await page.content(),
  });
}
