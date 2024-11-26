import crypto from "crypto";
import fs from "fs-extra";
import imageType from "image-type";
import mammoth from "mammoth";
import path from "path";
import TurndownService from "turndown";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lagoon_dirname = '/tmp/converted';

async function getImageExtension(buffer) {
  const type = await imageType(buffer);
  return type ? `.${type.ext}` : ".png";
}

function generateFolderName(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const hash = crypto.createHash("md5").update(fileContent).digest("hex");
  return hash.substring(0, 12);
}

export async function wordToMarkdown(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist: " + filePath);
  }

  const folderName = generateFolderName(filePath);
  // const outputDir = path.join(__dirname, folderName);
  const outputDir = path.join(lagoon_dirname, folderName);
  const imagesDir = path.join(outputDir, "images");

  await fs.ensureDir(outputDir);
  await fs.ensureDir(imagesDir);

  const options = {
    convertImage: mammoth.images.imgElement(async (image) => {
      const imageBuffer = await image.read();
      const extension = await getImageExtension(imageBuffer);
      const filename = `image-${crypto.randomBytes(4).toString("hex")}${extension}`;
      const imagePath = path.join(imagesDir, filename);

      await fs.writeFile(imagePath, imageBuffer);

      return {
        src: path.join("images", filename),
      };
    }),
  };

  const result = await mammoth.convertToHtml({ path: filePath }, options);

  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    hr: "---",
    bulletListMarker: "-",
    strongDelimiter: "**",
  });

  turndownService.addRule("tables", {
    filter: "table",
    replacement: function (content, node) {
      const rows = node.querySelectorAll("tr");
      const headers = Array.from(rows[0]?.querySelectorAll("th,td") || [])
        .map((cell) => cell.textContent.trim())
        .join(" | ");

      const separator = headers
        .split("|")
        .map(() => "---")
        .join(" | ");

      const body = Array.from(rows)
        .slice(1)
        .map((row) =>
          Array.from(row.querySelectorAll("td"))
            .map((cell) => cell.textContent.trim())
            .join(" | ")
        )
        .join("\n");

      return `\n${headers}\n${separator}\n${body}\n\n`;
    },
  });

  let markdown = turndownService.turndown(result.value);

  markdown = markdown
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .replace(/!\[\]\(/g, "![image](")
    .trim();

  const mdPath = path.join(outputDir, "content.md");
  await fs.writeFile(mdPath, markdown);

  return {
    markdownPath: mdPath,
    warnings: result.messages,
    outputDir,
  };
}
