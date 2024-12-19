import crypto from 'crypto';
import fs from 'fs-extra';
import { applyFixes } from 'markdownlint';
import { lint as lintSync } from 'markdownlint/sync';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const isLagoon = !!process.env.LAGOON;
const __filename = fileURLToPath(import.meta.url);
const __dirname = isLagoon
  ? '/app/web/sites/default/files/converted'
  : path.dirname(__filename);

function generateFolderName(content) {
  const hash = crypto.createHash('md5').update(content).digest('hex');
  return hash.substring(0, 12);
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

export async function fetchContentJinaAi(url) {
  const apiKey =
    process.env.JINA_AI_API_KEY ||
    'jina_c436e2d8a5474a71b232f4286de387d6n0MVWKn1aOY3BNfVGE0gJH300OI0';

  try {
    // Encode the URL to handle special characters
    const encodedUrl = encodeURIComponent(url);

    // Make the request to the Jina API
    const response = await fetch(`https://r.jina.ai/${encodedUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse and return the response
    const fetchedContent = await response.json();

    const folderName = generateFolderName(url);
    const outputDir = path.join(__dirname, folderName);
    const imagesDir = path.join(outputDir, 'images');

    await fs.ensureDir(outputDir);
    await fs.ensureDir(imagesDir);

    let markdown = fetchedContent?.data.content || '';

    // Clean up the markdown
    markdown = markdown
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/!\[\]\(/g, '![image](')
      .trim();

    const results = lintSync({ strings: { content: markdown } });
    const fixed = applyFixes(markdown, results.content);
    const { markdown: fixedMarkdown, warnings } = validateAndFixMarkdown(fixed);

    const fixEmptyMarkdownLinks = (markdown) => {
      // Regular expression to match markdown links with empty URL but with title
      // Captures: []("title")
      const emptyLinkRegex = /\[\]\(([^)]+)\s+"([^"]+)"\)/g;

      // Replace empty links with their title text as link text
      return markdown.replace(emptyLinkRegex, (match, url, title) => {
        return `[${title}](${url} "${title}")`;
      });
    };

    const fixedLinksMarkdown = fixEmptyMarkdownLinks(fixedMarkdown);

    const mdPath = path.join(outputDir, 'content.md');
    await fs.writeFile(mdPath, fixedLinksMarkdown);

    return {
      markdownPath: mdPath,
      warnings: warnings,
      outputDir,
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}
