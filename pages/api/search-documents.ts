// pages/api/searchDocuments.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseApiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseApiKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { query_embedding, match_count, query_bot_id } = req.body;

    if (!query_embedding || !match_count) {
      return res
        .status(400)
        .json({ error: "query_embedding and match_count are required" });
    }

    try {
      const { data, error } = await supabase.rpc("match_documents", {
        query_bot_id,
        query_embedding,
        match_count,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Unexpected error occurred" });
    }
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }
}
