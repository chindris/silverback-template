import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test('All blocks are rendered', async ({ page }) => {
  await page.goto(websiteUrl('/en/blocks-complete'));

  // Hero
  await expect(
    page.locator('img[data-test-id=hero-image][alt="A beautiful landscape."]'),
  ).toHaveCount(2);
  await expect(
    page.locator('h1:text("All kinds of blocks with maximum data")'),
  ).toHaveCount(1);
  await expect(page.locator('text="Lead text"')).toHaveCount(1);

  // Paragraph
  await expect(
    page.locator('p:text("A standalone paragraph with markup and link")'),
  ).toHaveCount(1);
  await expect(
    page.locator('a:text("link")[href="/en/architecture"]'),
  ).toHaveCount(1);

  // Horizontal separator.
  await expect(page.locator('hr')).toHaveCount(1);

  // Image and ImageWithText block
  await expect(
    page.locator(
      'img:not([data-test-id=hero-image])[alt="A beautiful landscape."]',
    ),
  ).toHaveCount(2);
  await expect(page.locator('figcaption:text("Media image")')).toHaveCount(1);

  // Video
  await expect(
    page.locator('video[src*="/video_mp4_belt.mp4"][controls]'),
  ).toHaveCount(1);
  await expect(page.locator('figcaption:text("Media video")')).toHaveCount(1);

  // Table
  await expect(page.locator('figure.wp-block-table > table')).toHaveCount(1);
  await expect(
    page.locator('figure.wp-block-table > figcaption:text("Table caption")'),
  ).toHaveCount(1);

  // List
  await expect(page.locator('ul > li:text("list 1")')).toHaveCount(1);
  await expect(page.locator('ol > li:text("list 2.2")')).toHaveCount(1);

  // Heading
  await expect(page.locator('h3:text("Heading 3")')).toHaveCount(1);

  // Quote
  await expect(
    page.locator(
      'blockquote p:text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis nisi nec neque porta, a ornare ligula efficitur.")',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator('blockquote p.not-prose:text("John Doe")'),
  ).toHaveCount(1);
  await expect(
    page.locator('blockquote p.not-prose span:text("Project manager")'),
  ).toHaveCount(1);
  await expect(
    page.locator('blockquote img[alt="The silverback"]'),
  ).toHaveCount(1);

  // CTA blocks
  await expect(page.locator('a:text("Internal CTA")')).toHaveCount(1);
  await expect(page.locator('a:text("External CTA")')).toHaveCount(1);
  await expect(page.locator('a:text("CTA with link to media")')).toHaveCount(1);

  // Form
  await expect(
    page.locator('.silverback-iframe iframe').last(),
  ).toHaveAttribute('src', 'http://127.0.0.1:8000/en/form/contact?iframe=true');
});
