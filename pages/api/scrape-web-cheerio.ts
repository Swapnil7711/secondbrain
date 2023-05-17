import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cheerio from "cheerio";
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
    const response = await axios.get(url);
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);

    const turndownService = new TurndownService();
    const markdown = turndownService.turndown($.html());

    res.status(200).json({ markdown });
  } catch (error) {
    res.status(500).json({ error: `Failed to scrape website ${error}` });
  }
};

export default handler;
