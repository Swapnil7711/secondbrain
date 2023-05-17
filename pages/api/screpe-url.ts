// pages/api/scrape.ts

import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

async function scrapeWebsite(url: string): Promise<string[]> {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const elements = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("a"));
      return anchors.map((anchor) => anchor.textContent);
    });

    await browser.close();
    return elements;
  } catch (error) {
    console.error(`Error scraping website: ${error.message}`);
    return [];
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Invalid or missing URL parameter" });
    return;
  }

  const scrapedData = await scrapeWebsite(url);
  res.status(200).json({ data: scrapedData });
};
