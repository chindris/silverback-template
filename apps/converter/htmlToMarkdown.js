import crypto from 'crypto';
import fs from 'fs-extra';
import imageType from 'image-type';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import path from 'path';
import TurndownService from 'turndown';
import { fileURLToPath } from 'url';

// @todo Fix this to work locally and live
const isLagoon = !!process.env.LAGOON;
const __filename = fileURLToPath(import.meta.url);
const __dirname = isLagoon
  ? '/app/web/sites/default/files/converted'
  : path.dirname(__filename);

async function extractMainContent(htmlString) {
  const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
  const match = htmlString.match(bodyRegex);
  // Return the captured group (content between tags) or null if no match
  const html = match ? match[1] : null;

  if (html) {
    // Create a new JSDOM instance and parse the HTML string
    const dom = new JSDOM(html);
    // Extract the <main> element content
    let mainElement = dom.window.document.querySelector('main');
    if (!mainElement) {
      mainElement = dom.window.document.querySelector('article');
    }
    // Return the inner HTML of the <main> tag, or an empty string if not found
    return mainElement ? mainElement.innerHTML : '';
  }
}

async function getImageExtension(buffer) {
  const type = await imageType(buffer);
  return type ? `.${type.ext}` : '.png';
}

function generateFolderName(content) {
  const hash = crypto.createHash('md5').update(content).digest('hex');
  return hash.substring(0, 12);
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.warn(
      `Warning: Failed to download image from ${url}:`,
      error.message,
    );
    return null;
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export async function htmlToMarkdown(url) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided: ' + url);
  }

  // Fetch HTML content
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.statusText}`);
  }
  const fullHtml = await response.text();

  const html = await extractMainContent(fullHtml);
  // Generate folder name based on HTML content
  const folderName = generateFolderName(html);
  const outputDir = path.join(__dirname, folderName);
  const imagesDir = path.join(outputDir, 'images');

  await fs.ensureDir(outputDir);
  await fs.ensureDir(imagesDir);

  // Parse HTML using JSDOM
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Process images before conversion
  const images = document.querySelectorAll('img');
  const imageMap = new Map();

  for (const img of images) {
    const srcAttribute = img.getAttribute('src');
    if (!srcAttribute) continue;

    // Resolve relative URLs to absolute URLs
    const absoluteUrl = new URL(srcAttribute, url).href;

    const imageBuffer = await downloadImage(absoluteUrl);
    if (!imageBuffer) continue;

    const extension = await getImageExtension(imageBuffer);
    const filename = `image-${crypto.randomBytes(4).toString('hex')}${extension}`;
    const imagePath = path.join(imagesDir, filename);

    await fs.writeFile(imagePath, imageBuffer);
    imageMap.set(srcAttribute, path.join('images', filename));
    img.setAttribute('src', path.join('images', filename));
  }

  // Configure Turndown
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    hr: '---',
    bulletListMarker: '-',
    strongDelimiter: '**',
  });

  // Add custom rules
  turndownService.addRule('tables', {
    filter: 'table',
    replacement: function (content, node) {
      const rows = node.querySelectorAll('tr');
      const headers = Array.from(rows[0]?.querySelectorAll('th,td') || [])
        .map((cell) => cell.textContent.trim())
        .join(' | ');

      const separator = headers
        .split('|')
        .map(() => '---')
        .join(' | ');

      const body = Array.from(rows)
        .slice(1)
        .map((row) =>
          Array.from(row.querySelectorAll('td'))
            .map((cell) => cell.textContent.trim())
            .join(' | '),
        )
        .join('\n');

      return `\n${headers}\n${separator}\n${body}\n\n`;
    },
  });

  // Convert to Markdown
  let markdown = turndownService.turndown(document.body);

  // Clean up the markdown
  markdown = markdown
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/!\[\]\(/g, '![image](')
    .trim();

  // Save markdown file
  const mdPath = path.join(outputDir, 'content.md');
  await fs.writeFile(mdPath, markdown);

  return {
    markdownPath: mdPath,
    warnings: [], // You could add warnings for failed image downloads etc.
    outputDir,
  };
}
