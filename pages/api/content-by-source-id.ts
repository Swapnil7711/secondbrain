import { supabase } from "@/utils/SupabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const sourceID = req.query.id;

    if (!sourceID) {
      res.status(400).json({ error: 'Missing "url" query parameter' });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("source_id", sourceID)
        // if create_time is not null then sort by create_time
        .order("create_time", { ascending: true });

      if (error) {
        throw error;
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
