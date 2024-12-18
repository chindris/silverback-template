import { extract } from '@extractus/article-extractor';
import crypto from 'crypto';
import fs from 'fs-extra';
import imageType from 'image-type';
import { JSDOM } from 'jsdom';
import { applyFixes } from 'markdownlint';
import { lint as lintSync } from 'markdownlint/sync';
import fetch from 'node-fetch';
import path from 'path';
import TurndownService from 'turndown';
import { fileURLToPath } from 'url';

/**
 * Extracts images from markdown content while preserving their positions
 * @param {string} markdown - Original markdown content
 * @returns {{cleanMarkdown: string, extractedImages: Array<{alt: string, url: string, position: number, placeholder: string}>}}
 */
function extractImagesWithPositions(markdown) {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const extractedImages = [];
  let match;
  let cleanMarkdown = markdown;
  let index = 0;

  while ((match = imageRegex.exec(markdown)) !== null) {
    const placeholder = `__IMAGE_PLACEHOLDER_${index}__`;
    extractedImages.push({
      alt: match[1] || '',
      url: match[2],
      position: match.index,
      placeholder,
    });
    index++;
  }

  // Replace images with placeholders
  extractedImages.forEach((image) => {
    cleanMarkdown = cleanMarkdown.replace(
      `![${image.alt}](${image.url})`,
      image.placeholder,
    );
  });

  return {
    cleanMarkdown,
    extractedImages,
  };
}

/**
 * Reinserts images just above their original link positions
 * @param {string} markdown - Markdown content with placeholders
 * @param {Array<{alt: string, url: string, placeholder: string}>} images - Extracted images
 * @returns {string} - Markdown with images reinserted
 */
function reinsertImages(markdown, images) {
  let result = markdown;

  // Sort images by their position in reverse order to maintain correct positions
  const sortedImages = [...images].sort((a, b) => b.position - a.position);

  for (const image of sortedImages) {
    const imageMarkdown = `![${image.alt}](${image.url})\n\n`;
    const placeholderPosition = result.indexOf(image.placeholder);

    if (placeholderPosition !== -1) {
      // Find the start of the line containing the placeholder
      let lineStart = result.lastIndexOf('\n', placeholderPosition);
      lineStart = lineStart === -1 ? 0 : lineStart + 1;

      // Insert the image above the line containing the placeholder
      result =
        result.slice(0, lineStart) + imageMarkdown + result.slice(lineStart);

      // Remove the placeholder
      result = result.replace(image.placeholder, '');
    }
  }

  // Clean up any double blank lines created during the process
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

function validateAndFixMarkdown(markdown) {
  const warnings = [];

  // Regex to match the entire image syntax
  const imageRegex = /!\[.*?\]\(.*?\)/g;

  markdown = markdown.replace(imageRegex, (match) => {
    // Parse the components of the Markdown image syntax
    const altMatch = match.match(/!\[(.*?)\]/); // Match alt text
    const urlMatch = match.match(/\((.*?)(?=\s|$)/); // Match URL
    const titleMatch = match.match(/"([^"]*?)"\)$/); // Match title (if it exists)

    let altText = altMatch ? altMatch[1] : '';
    let url = urlMatch ? urlMatch[1] : '';
    let title = titleMatch ? titleMatch[1] : null;

    // Fix double quotes in alt text
    if (altText.includes('"')) {
      warnings.push(`Double quotes in alt text fixed: "${altText}"`);
      altText = altText.replace(/"/g, "'");
    }

    // Fix double quotes in title
    if (title && title.includes('"')) {
      warnings.push(`Double quotes in title fixed: "${title}"`);
      title = title.replace(/"/g, "'");
    }

    // Rebuild the image syntax
    return title ? `![${altText}](${url} "${title}")` : `![${altText}](${url})`;
  });

  // Trim leading and trailing whitespace
  const trimmedMarkdown = markdown.trim();
  if (markdown !== trimmedMarkdown) {
    warnings.push('Leading or trailing whitespace detected and removed.');
    markdown = trimmedMarkdown;
  }

  return { markdown, warnings };
}

// @todo Fix this to work locally and live
const isLagoon = !!process.env.LAGOON;
const __filename = fileURLToPath(import.meta.url);
const __dirname = isLagoon
  ? '/app/web/sites/default/files/converted'
  : path.dirname(__filename);

async function extractMainContentFromUrl(url) {
  try {
    const mainContent = await extract(url);
    return mainContent ? mainContent.content : '';
  } catch (err) {
    console.error(err);
  }
  return '';
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

  const html = await extractMainContentFromUrl(url);
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

  const results = lintSync({ strings: { content: markdown } });
  const fixed = applyFixes(markdown, results.content);
  const { markdown: fixedMarkdown, warnings } = validateAndFixMarkdown(fixed);

  const { cleanMarkdown, extractedImages } =
    extractImagesWithPositions(fixedMarkdown);
  const correctedMarkdown = reinsertImages(cleanMarkdown, extractedImages);

  const fixEmptyMarkdownLinks = (markdown) => {
    // Regular expression to match markdown links with empty URL but with title
    // Captures: []("title")
    const emptyLinkRegex = /\[\]\(([^)]+)\s+"([^"]+)"\)/g;

    // Replace empty links with their title text as link text
    return markdown.replace(emptyLinkRegex, (match, url, title) => {
      return `[${title}](${url} "${title}")`;
    });
  };

  const fixedLinksMarkdown = fixEmptyMarkdownLinks(correctedMarkdown);

  // Save markdown file
  const mdPath = path.join(outputDir, 'content.md');
  await fs.writeFile(mdPath, fixedLinksMarkdown);

  return {
    markdownPath: mdPath,
    warnings: warnings, // You could add warnings for failed image downloads etc.
    outputDir,
  };
}
