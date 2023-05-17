import { supabase } from "@/utils/SupabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data, error } = await supabase.from("users").select("email");
    if (error) throw error;

    const csvData = data.map((user) => user.email).join("\n");
    const csvBuffer = Buffer.from(csvData, "utf-8");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user-emails.csv"
    );
    res.setHeader("Content-Length", csvBuffer.length.toString());

    res.status(200).send(csvBuffer);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Error fetching emails" });
  }
}
