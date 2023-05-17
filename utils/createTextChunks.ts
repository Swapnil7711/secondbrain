// utils/createTextChunks.js
import axios from "axios";
import mammoth from "mammoth";
import { JSDOM } from "jsdom";
import { simpleParser } from "mailparser";
import pdfjsLib from "pdfjs-dist";
import Pptx2Html from "pptx2html";

type Metadata = {
  pageNumber?: number;
  type?: string;
};

type Chunk = {
  text: string;
  metadata: Metadata;
};

async function createTextChunks(
  url: string,
  options: Metadata
): Promise<Chunk[]> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const arrayBuffer = response.data;
  const type = options.type;

  if (!type) {
    throw new Error("File type is not provided");
  }
  switch (type) {
    case "txt":
      const textDecoder = new TextDecoder("utf-8");
      const text = textDecoder.decode(arrayBuffer);
      return textToChunks(text, options);

    case "docx":
      const docxText = await mammoth.extractRawText({ arrayBuffer });
      return textToChunks(docxText.value, options);

    case "html":
      const htmlDOM = new JSDOM(arrayBuffer);
      const htmlText = htmlDOM.window.document.documentElement.textContent;
      return textToChunks(htmlText, options);

    case "eml":
      const eml = await simpleParser(arrayBuffer);
      const emlText = eml.text || "";
      return textToChunks(emlText, options);

    case "pdf":
      const pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
      let pdfChunks = [];

      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = (content.items as { str: string }[])
          .filter((item) => "str" in item)
          .map((item) => item.str)
          .join(" ");

        pdfChunks.push(
          ...textToChunks(pageText, { ...options, pageNumber: pageNum })
        );
      }

      return pdfChunks;

    case "pptx": {
      const pptxText = await extractTextFromPPTX(arrayBuffer);
      return textToChunks(pptxText, options);
    }

    default:
      throw new Error("Unsupported file type");
  }
}

function textToChunks(text, metadata) {
  const words = text.split(" ");
  const chunks = [];

  while (words.length) {
    const chunkWords = words.splice(0, 200);
    const chunk = {
      text: chunkWords.join(" "),
      metadata,
    };
    chunks.push(chunk);
  }

  return chunks;
}

async function extractTextFromPPTX(arrayBuffer) {
  const pptx2html = new Pptx2Html(arrayBuffer);
  const html = pptx2html.render();
  const dom = new JSDOM(html);
  const slides = dom.window.document.querySelectorAll(".pptx2html-slide");

  let extractedText = "";

  slides.forEach((slide, slideIndex) => {
    const slideText = slide.textContent.trim();
    extractedText += `Slide ${slideIndex + 1}: ${slideText}\n`;
  });

  return extractedText;
}

export { createTextChunks, textToChunks, extractTextFromPPTX };
