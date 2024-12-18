import { parse } from '@textlint/markdown-to-ast';
import express from 'express';
import { readFileSync } from 'fs';
import { toHtml } from 'hast-util-to-html';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';

import { htmlToMarkdown } from './htmlToMarkdown.js';
import { pdfToMarkdown } from './pdfToMarkdown.js';
import { wordToMarkdown } from './wordToMarkdown.js';

const app = express();
const PORT = 3000;

async function enhanceMdastNodesRecursive(tree, outputDir) {
  // Process a single node and its children
  async function processNode(node) {
    // First process all children recursively to ensure they have htmlValue
    if (node.children && Array.isArray(node.children)) {
      await Promise.all(node.children.map((child) => processNode(child)));
    }

    const hast = toHast(node, { allowDangerousHtml: true });
    const html = toHtml(hast, { allowDangerousHtml: true });

    const type = node.type;
    node.type = type.charAt(0).toUpperCase() + type.slice(1);
    node.outputDir = outputDir;

    if (!node.htmlValue) {
      node.htmlValue = html;
    }

    if (node.type == 'Table') {
      node.htmlValue = markdownToHtmlTable(html);
    }

    if (node.type == 'Image') {
      node.src = `${outputDir}/${node.url}`;
    }

    return node;
  }

  // Helper function to generate HTML for each node type
  function generateHtml(node) {
    switch (node.type.toLowerCase()) {
      case 'paragraph':
        return `<p>${node.children?.map((child) => child.htmlValue || '').join('')}</p>`;
      case 'heading':
        return `<h${node.depth}>${node.children?.map((child) => child.htmlValue || '').join('')}</h${node.depth}>`;
      case 'text':
        return node.value;
      case 'emphasis':
        return `<em>${node.children?.map((child) => child.htmlValue || '').join('')}</em>`;
      case 'strong':
        return `<strong>${node.children?.map((child) => child.htmlValue || '').join('')}</strong>`;
      case 'link':
        return `<a href="${node.url}">${node.children?.map((child) => child.htmlValue || '').join('')}</a>`;
      case 'image':
        return `<img src="${node.url}" alt="${node.alt || ''}" />`;
      case 'list':
        const tag = node.ordered ? 'ol' : 'ul';
        return `<${tag}>${node.children?.map((child) => child.raw || '').join('')}</${tag}>`;
      case 'listItem':
        return `<li>${node.children?.map((child) => child.htmlValue || '').join('')}</li>`;
      case 'blockquote':
        return `<blockquote>${node.children?.map((child) => child.htmlValue || '').join('')}</blockquote>`;
      case 'code':
        return `<pre><code${node.lang ? ` class="language-${node.lang}"` : ''}>${node.value}</code></pre>`;
      case 'inlineCode':
        return `<code>${node.value}</code>`;
      case 'thematicBreak':
        return '<hr />';
      default:
        return '';
    }
  }

  return processNode(tree);
}

function markdownToHtmlTable(markdownTable) {
  // Split the markdown table into lines
  const lines = markdownTable.trim().split('\n');

  // Extract headers (first line)
  const headers = lines[0]
    .split('|')
    .map((header) => header.trim())
    .map((header) => header.replace(/^<p>/, '').replace(/<\/p>$/, ''))
    .filter((header) => header !== '');

  // Remove separator line (second line with ---)
  const dataLines = lines.slice(2);

  // Create HTML table
  let htmlTable = '<table>\n<thead>\n<tr>';

  // Add headers
  headers.forEach((header) => {
    htmlTable += `\n<th>${header}</th>`;
  });

  htmlTable += '\n</tr>\n</thead>\n<tbody>';

  // Add table rows
  dataLines.forEach((line) => {
    const cells = line
      .split('|')
      .map((cell) => cell.trim())
      .map((cell) => cell.replace(/^<p>/, '').replace(/<\/p>$/, ''))
      .filter((cell) => cell !== '');

    if (cells.length > 0) {
      htmlTable += '\n<tr>';
      cells.forEach((cell) => {
        htmlTable += `\n<td>${cell}</td>`;
      });
      htmlTable += '\n</tr>';
    }
  });
  htmlTable += '\n</tbody>\n</table>';

  return htmlTable;
}

// Express endpoint
app.get('/convert', async (req, res) => {
  const filePath = req.query.path;

  if (!filePath) {
    return res.status(400).json({
      error: "Please provide a Word document path as 'path' query parameter",
    });
  }

  try {
    // First convert Word to Markdown
    const { markdownPath, warnings, outputDir } =
      await wordToMarkdown(filePath);

    // Then read and process the Markdown
    const markdown = readFileSync(markdownPath, 'utf-8');
    const mdast = fromMarkdown(markdown);
    const md = readFileSync(markdownPath, 'utf-8');
    const ast = parse(md);

    // This is to correct some types
    mdast.children.forEach(async (element, index) => {
      const hast = toHast(element, { allowDangerousHtml: true });
      const html = toHtml(hast, { allowDangerousHtml: true });
      element.type = ast.children[index].type;
      element.raw = ast.children[index].raw;
      element.htmlValue = html;
    });

    const enhanced = await enhanceMdastNodesRecursive(mdast, outputDir);

    // Return the processed content along with conversion info
    res.json({
      content: enhanced.children,
      outputDirectory: outputDir,
      warnings: warnings,
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: `File not found: ${filePath}` });
    } else {
      res.status(500).json({
        error: 'Error processing document',
        details: error.message,
      });
    }
  }
});

app.get('/html-convert', async (req, res) => {
  const filePath = req.query.path;

  if (!filePath) {
    return res.status(400).json({
      error: "Please provide a URLas 'path' query parameter",
    });
  }

  try {
    // First convert Word to Markdown
    const { markdownPath, warnings, outputDir } =
      await htmlToMarkdown(filePath);

    // Then read and process the Markdown
    const markdown = readFileSync(markdownPath, 'utf-8');
    const mdast = fromMarkdown(markdown);

    const md = readFileSync(markdownPath, 'utf-8');
    const ast = parse(md);

    mdast.children.forEach(async (element, index) => {
      const hast = toHast(element, { allowDangerousHtml: true });
      const html = toHtml(hast, { allowDangerousHtml: true });
      element.type = ast.children[index].type;
      element.raw = ast.children[index].raw;
      element.htmlValue = html;
    });

    const enhanced = await enhanceMdastNodesRecursive(mdast, outputDir);
    // Return the processed content along with conversion info
    res.json({
      content: enhanced.children,
      outputDirectory: outputDir,
      warnings: warnings,
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: `File not found: ${filePath}` });
    } else {
      res.status(500).json({
        error: 'Error processing document',
        details: error.message,
      });
    }
  }
});

app.get('/pdf-convert', async (req, res) => {
  const filePath = req.query.path;

  if (!filePath) {
    return res.status(400).json({
      error: "Please provide a URLas 'path' query parameter",
    });
  }

  try {
    // First convert Word to Markdown
    const { markdownPath, outputDir } = await pdfToMarkdown(filePath);

    // Then read and process the Markdown
    const markdown = readFileSync(markdownPath, 'utf-8');
    const mdast = fromMarkdown(markdown);

    const md = readFileSync(markdownPath, 'utf-8');
    const ast = parse(md);

    mdast.children.forEach(async (element, index) => {
      const hast = toHast(element, { allowDangerousHtml: true });
      const html = toHtml(hast, { allowDangerousHtml: true });
      element.type = ast.children[index].type;
      element.raw = ast.children[index].raw;
      element.htmlValue = html;
    });

    const enhanced = await enhanceMdastNodesRecursive(mdast, outputDir);

    // Return the processed content along with conversion info
    res.json({
      content: enhanced.children,
      outputDirectory: outputDir,
      // warnings: warnings,
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: `File not found: ${filePath}` });
    } else {
      res.status(500).json({
        error: 'Error processing document',
        details: error.message,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
