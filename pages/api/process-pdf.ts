// pages/api/process-pdf.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import pdfParse from "pdf-parse";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/utils/SupabaseClient";

async function parsePDFBuffer(
  buffer: Buffer
): Promise<{ text: string; title: string }> {
  const data = await pdfParse(buffer);
  return { text: data.text, title: data.info.Title || "" };
}

function chunkText(
  text: string,
  wordsPerChunk = 200
): { chunk: string; pageNumber: number }[] {
  const words = text.split(/\s+/).map((word) => word.trim());

  const chunks: { chunk: string; pageNumber: number }[] = [];

  let pageNumber = 1;
  let chunkStartIndex = 0;

  while (chunkStartIndex < words.length) {
    const chunkEndIndex = Math.min(
      chunkStartIndex + wordsPerChunk,
      words.length
    );
    const chunk = words.slice(chunkStartIndex, chunkEndIndex).join(" ");
    chunks.push({ chunk, pageNumber });
    chunkStartIndex = chunkEndIndex;
    pageNumber++;
  }

  return chunks;
}

async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: text,
        model: "text-embedding-ada-002",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      }
    );
    console.log(
      `text: ${text} response.data.data[0].embedding:`,
      response.data.data[0].embedding
    );
    return response.data.data[0].embedding;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function addSourceToSupbase(
  url: string,
  user_id: string,
  bot_id: string,
  pdfTitle: string
): Promise<any> {
  try {
    var source_id = uuidv4();
    // Insert the new row into the table
    const { data, error } = await supabase.from("sources").insert({
      url: url,
      type: "PDF",
      user_id: user_id,
      bot_id: bot_id,
      source_id: source_id,
      is_indexed: false,
      title: pdfTitle,
    });
    if (error) throw error;
    console.log("Source added successfully.");
    return { success: true, source_id: source_id };
  } catch (error) {
    console.error("Error inserting row:", error);
    return { success: false, source_id: null };
  }
}

function isSupabaseStorageUrl(url) {
  const regex = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/storage\/.*$/;
  return regex.test(url);
}

async function addInfoToSupabase({
  source,
  title,
  chunk,
  embedding,
  source_id,
  user_id,
  bot_id,
  pageNumber,
}: {
  source: string;
  title: string;
  chunk: string;
  embedding: number[];
  source_id: string;
  user_id: string;
  bot_id: string;
  pageNumber: number;
}): Promise<any> {
  try {
    // Insert the new row into the table

    console.log(
      `addInfoToSupabase : ${source} ${title} ${chunk} ${embedding} ${source_id} ${user_id} ${bot_id} ${pageNumber}}`
    );

    const datatoUpload = {
      content: chunk.replace(/\u0000/g, " "),
      metadata: {
        source: source,
        contentLength: chunk.length,
        pageNumber: pageNumber,
        title: title,
      },
      embedding: embedding,
      user_id: user_id,
      bot_id: bot_id,
      source_id: source_id,
      source_url: source,
    };

    console.log("datatoUpload", datatoUpload);

    const { data, error } = await supabase
      .from("documents")
      .insert(datatoUpload);
    if (error) throw error;
    console.log("Row inserted successfully.");
  } catch (error) {
    console.error("Error inserting row:", error);
  }
}

async function updateSourceToIndexed(url: string): Promise<any> {
  try {
    // Insert the new row into the table
    const { data, error } = await supabase
      .from("sources")
      .update({
        is_indexed: true,
      })
      .match({ url: url });
    if (error) throw error;
    console.log(`Updated source: ${url} to indexed.`);
    return true;
  } catch (error) {
    console.error("Error inserting row:", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { pdfUrl, user_id, bot_id, fileName } = req.body;

      //make sure pdfUrl, bot_id and user_id are not empty
      if (!pdfUrl || !user_id || !bot_id) {
        res
          .status(400)
          .json({ error: "No pdfUrl, user_id or bot_id provided" });
        return;
      }

      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
      });

      const pdfBuffer = Buffer.from(response.data);
      var { text: pdfText, title: pdfTitle } = await parsePDFBuffer(pdfBuffer);
      if (!pdfTitle) {
        // if fileName is not empty, use it as title
        if (fileName) {
          pdfTitle = fileName;
        }
      }
      const chunks = chunkText(pdfText);

      const { success, source_id } = await addSourceToSupbase(
        pdfUrl,
        user_id,
        bot_id,
        pdfTitle
      );

      if (!success) {
        res.status(500).json({ error: "Failed to add source to Supabase" });
        return;
      }

      for (const chunk of chunks) {
        const embedding = await generateEmbeddings(chunk["chunk"]);

        if (!embedding) {
          res.status(500).json({ error: "Embedding failed" });
          return;
        }

        await addInfoToSupabase({
          source: pdfUrl,
          title: pdfTitle,
          chunk: chunk.chunk,
          embedding: embedding,
          source_id: source_id,
          user_id: user_id,
          bot_id: bot_id,
          pageNumber: chunk["pageNumber"],
        });
      }

      await updateSourceToIndexed(pdfUrl);
      res.status(200).json({
        message: `PDF processed successfully ${pdfUrl} added with title ${pdfTitle} chunks: ${chunks.length} source_id: ${source_id}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
