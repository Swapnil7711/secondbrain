import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import NextCors from "nextjs-cors";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseApiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseApiKey);

const handleAddQnA = async (req: NextApiRequest, res: NextApiResponse) => {
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { bot_id, question, answer } = req.body;

  if (!bot_id || !question || !answer) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const { data: botData, error: botError } = await supabase
      .from("bots")
      .select("user_id")
      .eq("bot_id", bot_id)
      .single();

    if (botError) {
      throw botError;
    }

    if (!botData) {
      res.status(404).json({ error: "Bot not found" });
      return;
    }

    const user_id = botData.user_id;
    console.log(`user_id:`, user_id);

    const { data, error } = await supabase.from("qna").insert([
      {
        user_id,
        bot_id,
        question,
        answer,
      },
    ]);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: "QnA added successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default handleAddQnA;
