// pages/api/index_text.js
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { supabase } from "@/utils/SupabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { bulkText, source, customer, botInfo } = req.body;

  if (bulkText === "") {
    res.status(400).json({ message: "Please enter some text to index." });
    return;
  }

  const chunks = chunkMarkdown(bulkText);

  var { success, source_id } = await addSourceToSupbase(
    customer,
    botInfo,
    source
  );
  if (!success) {
    res.status(500).json({
      message: `Indexing failed for ${source}. source_id: ${source_id}`,
    });
    return;
  }

  var document_id;
  for (let index = 0; index < chunks.length; index++) {
    await generateEmbeddings(chunks[index]).then(async (embedding) => {
      if (embedding) {
        document_id = await addInfoToSupabase(
          customer,
          botInfo,
          source,
          chunks[index],
          embedding,
          source_id
        );
      } else {
        res.status(500).json({ message: `Indexing failed for ${source}.` });
        return;
      }
    });
  }

  await updateSourceToIndexed(source);
  res.status(200).json({
    message: `Indexed ${source} successfully. source_id: ${source_id} document_id: ${document_id}`,
  });

  async function addSourceToSupbase(customer, botInfo, source) {
    try {
      var source_id = uuidv4();
      const { data, error } = await supabase.from("sources").insert({
        name: source,
        type: "Text",
        user_id: customer.user_id,
        bot_id: botInfo.bot_id,
        source_id: source_id,
        is_indexed: false,
      });
      if (error) throw error;
      return { success: true, source_id: source_id };
    } catch (error) {
      return { success: false, source_id: null };
    }
  }

  async function addInfoToSupabase(
    customer: { user_id: string },
    botInfo: { bot_id: string },
    source: string,
    text: string,
    embedding: number[],
    source_id: string
  ) {
    try {
      const document_id = uuidv4();
      const { data, error } = await supabase.from("documents").insert({
        content: text,
        metadata: {
          source: source,
          contentLength: text.length,
        },
        embedding: embedding,
        user_id: customer.user_id,
        bot_id: botInfo.bot_id,
        source_id: source_id,
        source_url: source,
        document_id: document_id,
      });
      if (error) throw error;
      return document_id;
    } catch (error) {
      console.error("Error inserting row:", error);
    }
  }

  async function updateSourceToIndexed(source) {
    try {
      const { data, error } = await supabase
        .from("sources")
        .update({
          is_indexed: true,
        })
        .match({ name: source });
      if (error) throw error;
    } catch (error) {
      console.error("Error updating row:", error);
    }
  }

  async function generateEmbeddings(text) {
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
      return response.data.data[0].embedding;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function chunkMarkdown(markdownString, wordsPerChunk = 150) {
    const paragraphs = markdownString.split(/\n\s*\n/);
    const chunks = [];
    let chunk = "";

    for (let i = 0; i < paragraphs.length; i++) {
      const words = paragraphs[i].trim().split(/\s+/);

      if (chunk && words.length + chunk.split(/\s+/).length > wordsPerChunk) {
        chunks.push(chunk.trim());
        chunk = "";
      }

      chunk += paragraphs[i] + "\n\n";

      if (i === paragraphs.length - 1) {
        chunks.push(chunk.trim());
      }
    }

    return chunks;
  }
}
