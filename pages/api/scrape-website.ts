import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import TurndownService from "turndown";
import cheerio from "cheerio";

const normalizeUrl = (url) => {
  const urlObj = new URL(url);
  urlObj.protocol = "https:"; // Always use the HTTPS version of the URL
  urlObj.hash = ""; // Remove the fragment identifier
  return urlObj.toString();
};

const chunkMarkdown = (
  markdownString: string,
  wordsPerChunk: number = 200
): string[] => {
  console.log(`Chunking markdown string:`, markdownString);
  const paragraphs = markdownString.split(/\n\s*\n/); // Split markdown into individual paragraphs
  const chunks = [];
  let chunk = "";

  // Group paragraphs into chunks of 2-3 based on average word count
  for (let i = 0; i < paragraphs.length; i++) {
    const words = paragraphs[i].trim().split(/\s+/);

    if (chunk && words.length + chunk.split(/\s+/).length > wordsPerChunk) {
      chunks.push(chunk.trim());
      chunk = "";
    }

    chunk += paragraphs[i] + "\n\n";

    if (i === paragraphs.length - 1) {
      chunks.push(chunk.trim());
      console.log(`Generated chunks:`, chunks);
    }
  }

  return chunks;
};

const scrapeUrl = async (url, scrapedUrls = [], urlCount = 0, maxUrls = 25) => {
  const normalizedUrl = normalizeUrl(url);

  if (urlCount >= maxUrls || scrapedUrls.includes(normalizedUrl)) {
    console.log(
      "Reached the maximum URL limit or URL has already been scraped."
    );
    return { chunks: [], urls: [] };
  }

  console.log(`Scraping URL: ${normalizedUrl}`);
  scrapedUrls.push(normalizedUrl); // Add the URL to the list of already scraped URLs

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(normalizedUrl, { waitUntil: "networkidle2" });

  const content = await page.content();
  const $ = cheerio.load(content);

  const baseUrl = new URL(normalizedUrl);

  // Update all anchor elements' href attributes to absolute URLs
  const urlsToScrape = [];
  $("a").each((_, elem) => {
    const href = $(elem).attr("href");
    const absoluteHref = new URL(href, normalizedUrl).toString();
    const absoluteUrl = new URL(absoluteHref);

    // Check if the domain matches the base domain
    if (
      absoluteUrl.hostname === baseUrl.hostname &&
      !absoluteHref.match(/\.(png|jpg|jpeg|gif|webp|mp4|avi|mov|webm)$/i)
    ) {
      urlsToScrape.push(absoluteHref);
    }

    $(elem).attr("href", absoluteHref);
  });

  const filteredUrlsToScrape = urlsToScrape.filter(
    (url) => !scrapedUrls.includes(url) && urlCount + 1 < maxUrls
  );

  if (filteredUrlsToScrape.length === 0) {
    console.log("No more URLs to scrape.");
    return { chunks: [], urls: [] };
  }

  const updatedContent = $.html();

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(updatedContent);

  await browser.close();

  let combinedChunks = chunkMarkdown(markdown);
  let combinedUrls = [normalizedUrl];

  for (const nextUrl of filteredUrlsToScrape) {
    const { chunks: nextChunks, urls: nextUrls } = await scrapeUrl(
      nextUrl,
      scrapedUrls,
      urlCount + 1,
      maxUrls
    );
    combinedChunks = combinedChunks.concat(nextChunks);
    combinedUrls = combinedUrls.concat(nextUrls);
  }

  return { chunks: combinedChunks, urls: combinedUrls };
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    res
      .status(400)
      .json({ error: "URL parameter is required and must be a string" });
    return;
  }

  try {
    const { chunks, urls } = await scrapeUrl(url);

    res.status(200).json({ chunks, urls, success: true });
  } catch (error) {
    console.error(`Failed to scrape website ${url}: ${error}`);
    res
      .status(500)
      .json({ error: `Failed to scrape website ${error}`, success: false });
  }
};

export default handler;
