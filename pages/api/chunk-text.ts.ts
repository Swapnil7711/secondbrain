// pages/api/chunk-text.ts
import { NextApiRequest, NextApiResponse } from "next";

function chunkText(textString: string, wordsPerChunk: number = 150): string[] {
  const words = textString.split(/\s+/).map((word) => word.trim());
  const chunks = [];
  let chunk = [];

  for (let i = 0; i < words.length; i++) {
    chunk.push(words[i]);

    if (chunk.length === wordsPerChunk || i === words.length - 1) {
      chunks.push(chunk.join(" "));
      chunk = [];
    }
  }

  return chunks;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { textString, wordsPerChunk } = req.body;

    if (!textString) {
      return res
        .status(400)
        .json({ error: "The textString parameter is required." });
    }

    try {
      const chunks = chunkText(textString, wordsPerChunk);
      return res.status(200).json({ chunks });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while processing the text string." });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  }
}
