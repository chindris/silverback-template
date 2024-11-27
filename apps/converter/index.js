import { parse } from '@textlint/markdown-to-ast';
import express from 'express';
import { readFileSync } from 'fs';
import { toHtml } from 'hast-util-to-html';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';

import { htmlToMarkdown } from './htmlToMarkdown.js';
import { wordToMarkdown } from './wordToMarkdown.js';

const app = express();
const PORT = 3000;

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

    mdast.children.forEach(async (element, index) => {
      const hast = toHast(element, { allowDangerousHtml: true });
      const html = toHtml(hast, { allowDangerousHtml: true });
      element.htmlValue = html;
      element.type = ast.children[index].type;
      element.raw = ast.children[index].raw;
      if (element.type == 'Table') {
        element.htmlValue = markdownToHtmlTable(html);
      }

      if (ast.children[index].children[0].type == 'Image') {
        element.type = 'Image';
        element.src = `${outputDir}/${ast.children[index].children[0].url}`;
      }
    });

    // Return the processed content along with conversion info
    res.json({
      content: mdast.children,
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
      element.htmlValue = html;
      element.type = ast.children[index].type;
      element.raw = ast.children[index].raw;
      if (element.type == 'Table') {
        element.htmlValue = markdownToHtmlTable(html);
      }

      if (ast.children[index].children[0].type == 'Image') {
        element.type = 'Image';
        element.src = `${outputDir}/${ast.children[index].children[0].url}`;
      }
    });

    // Return the processed content along with conversion info
    res.json({
      content: mdast.children,
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
