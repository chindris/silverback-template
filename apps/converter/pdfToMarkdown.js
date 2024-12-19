import pdf2md from '@opendocsg/pdf2md';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// @todo Fix this to work locally and live
const isLagoon = !!process.env.LAGOON;
const __filename = fileURLToPath(import.meta.url);
const __dirname = isLagoon
  ? '/app/web/sites/default/files/converted'
  : path.dirname(__filename);

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

export function generateFolderName(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5').update(fileContent).digest('hex');
  return hash.substring(0, 12);
}

export async function pdfToMarkdown(pdfPath) {
  try {
    // Validate input file exists and is a PDF
    if (!fs.existsSync(pdfPath) || !pdfPath.toLowerCase().endsWith('.pdf')) {
      throw new Error('Invalid PDF file path');
    }

    // Generate output folder name
    const folderName = generateFolderName(pdfPath);
    const outputDir = path.join(__dirname, folderName);
    const imagesDir = path.join(outputDir, 'images');

    // Create output directories
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const fullMarkdown = await pdf2md(pdfBuffer);

    // const fullMarkdown = await convertToMarkdown(markdown);
    const { markdown: fixedMarkdown, warnings } =
      validateAndFixMarkdown(fullMarkdown);

    // Save markdown file
    const mdPath = path.join(outputDir, 'content.md');
    await fs.writeFile(mdPath, fixedMarkdown);

    return {
      markdownPath: mdPath,
      warnings: warnings, // You could add warnings for failed image downloads etc.
      outputDir,
    };
  } catch (error) {
    throw new Error(`PDF conversion failed: ${error.message}`);
  }
}
