// pages/api/scrapePDF.ts
import { NextApiRequest, NextApiResponse } from "next";
import pdfParse from "pdf-parse";
import axios from "axios";

export async function parsePDFBuffer(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { pdfUrl } = req.body;

      if (!pdfUrl) {
        res.status(400).json({ error: "No PDF URL provided" });
        return;
      }

      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
      });

      const pdfBuffer = Buffer.from(response.data);
      const pdfText = await parsePDFBuffer(pdfBuffer);

      res.status(200).json({ text: pdfText });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
