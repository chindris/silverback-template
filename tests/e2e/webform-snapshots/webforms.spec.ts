import { expect, Page, test } from '@playwright/test';
import { execSync } from 'child_process';
import scrape from 'website-scraper';

import { cmsUrl } from '../helpers/url';

const baseDir = '../../packages/ui/static/public/webforms';

test('Export webforms for styling', async ({ page }) => {
  execSync(`rm -rf ${baseDir}`);

  const baseUrl = cmsUrl('/en/form/styling?iframe=true&no_css=true');

  await page.goto(baseUrl);
  await savePage(page, 'idle');

  await page.getByLabel('Email with a confirmation').fill('asd@asd');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(
    page.locator('[data-drupal-messages] [role="alert"]'),
  ).toBeVisible();
  await savePage(page, 'error');
});

async function savePage(page: Page, name: string) {
  await scrape({
    directory: `${baseDir}/${name}`,
    urls: [page.url()],
    plugins: [new ScrapePlugin(await page.content())],
  });
}

// Replaces the first request response with given content.
class ScrapePlugin {
  isFirstRequest = true;

  constructor(public firstRequestResponse: string) {}

  apply(
    registerAction: (
      event: 'afterResponse',
      handler: <T>(args: { response: T }) => Promise<
        | T
        | {
            body: string;
            encoding: 'utf8';
            metadata: {};
          }
      >,
    ) => void,
  ): void {
    registerAction('afterResponse', async ({ response }) => {
      if (this.isFirstRequest) {
        this.isFirstRequest = false;
        return {
          body: this.firstRequestResponse,
          encoding: 'utf8',
          metadata: {},
        };
      } else {
        this.isFirstRequest = false;
        return response;
      }
    });
  }
}
