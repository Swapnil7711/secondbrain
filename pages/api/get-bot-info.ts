import { supabase } from "@/utils/SupabaseClient";
import NextCors from "nextjs-cors";

// Next.js API route
export default async function handler(req, res) {
  // CORS configuration
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { bot_id } = req.query;

  if (!bot_id) {
    res
      .status(400)
      .json({ success: false, error: "Missing bot_id in request body" });
    return;
  }

  const { data, error } = await supabase
    .from("bots")
    .select("*")
    .eq("bot_id", bot_id);

  // get user info from users table get column name "plan"
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("plan")
    .eq("user_id", data[0].user_id);

  if (userError) {
    console.log(`Error getBotInfo: ${userError.message}`);
    res.status(500).json({ success: false, error: userError.message });
    return;
  }

  data[0].plan = user[0].plan;

  if (error) {
    console.log(`Error getBotInfo: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.status(200).json({ success: true, data: data });
}
