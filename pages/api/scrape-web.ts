import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import TurndownService from "turndown";

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
    let puppeteer = require("puppeteer");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent(
      "Opera/9.80 (J2ME/MIDP; Opera Mini/5.1.21214/28.2725; U; ru) Presto/2.8.119 Version/11.10"
    );
    await page.goto(url, { waitUntil: "networkidle2" });

    // Scroll to the bottom of the page
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Scrape the content of the page
    const content = await page.evaluate(() => {
      const body = document.querySelector("body");
      return body ? body.innerText : null;
    });
    if (!content) {
      throw new Error("Failed to scrape website");
    }
    // const content = await page.content();

    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(content);

    await browser.close();

    res.status(200).json({ markdown });
  } catch (error) {
    res.status(500).json({ error: `Failed to scrape website ${error}` });
  }
};

export default handler;
