import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import PDFParser from 'pdf2json';

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
    const outputDir = path.join(path.dirname(pdfPath), folderName);
    const imagesDir = path.join(outputDir, 'images');

    // Create output directories
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    // Extract text content from all pages
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    // Combine text from all pages
    const markdownContent = data.text;

    // Save markdown content
    fs.writeFileSync(path.join(outputDir, 'content.md'), markdownContent);

    // Extract images
    const pdfParser = new PDFParser(null, 1); // Added parameter to preserve images

    return new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          // Extract and save images
          let imageCount = 0;

          if (pdfData.Pages) {
            pdfData.Pages.forEach((page, pageIndex) => {
              console.log('🚀 ~ pdfData.Pages.forEach ~ page:1');
              // Handle both Images and Bg (background) images
              const images = [...(page.Images || []), ...(page.Bg || [])];

              images.forEach((image) => {
                try {
                  // Check if image data exists and is valid
                  if (image.data) {
                    let imageBuffer;

                    // Handle different image data formats
                    if (Buffer.isBuffer(image.data)) {
                      imageBuffer = image.data;
                    } else if (typeof image.data === 'string') {
                      imageBuffer = Buffer.from(image.data, 'base64');
                    } else {
                      console.warn(
                        `Skipping invalid image data at page ${pageIndex + 1}`,
                      );
                      return;
                    }

                    const imagePath = path.join(
                      imagesDir,
                      `image_${pageIndex + 1}_${++imageCount}.png`,
                    );

                    fs.writeFileSync(imagePath, imageBuffer);
                  }
                } catch (imageError) {
                  console.warn(
                    `Error processing image at page ${pageIndex + 1}:`,
                    imageError,
                  );
                }
              });
            });
          }

          resolve({
            outputDir,
            markdownPath: path.join(outputDir, 'content.md'),
            imagesDir,
            totalPages: pdfData.Pages.length,
            totalImages: imageCount,
          });
        } catch (extractError) {
          reject(extractError);
        }
      });

      pdfParser.on('pdfParser_dataError', (error) => {
        reject(error);
      });

      pdfParser.loadPDF(pdfPath);
    });
  } catch (error) {
    throw new Error(`PDF conversion failed: ${error.message}`);
  }
}
