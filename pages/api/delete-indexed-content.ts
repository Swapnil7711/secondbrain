import { supabase } from "@/utils/SupabaseClient";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { url, user_id } = req.query;

    console.log("sourceUrl:", url);
    console.log("userId:", user_id);

    if (!url) {
      res.status(400).json({
        success: false,
        error: 'Missing "url" query parameter',
      });
      return;
    }

    if (!user_id) {
      res.status(400).json({
        success: false,
        error: 'Missing "user_id" query parameter',
      });
      return;
    }

    try {
      // Delete rows from 'documents' table
      const { data: documentsData, error: documentsError } = await supabase
        .from("documents")
        .select("id")
        .eq("source_url", url)
        .eq("user_id", user_id);

      if (documentsError) {
        throw documentsError;
      }

      if (documentsData.length > 0) {
        const { error: deleteDocumentsError } = await supabase
          .from("documents")
          .delete()
          .eq("source_url", url)
          .eq("user_id", user_id);

        if (deleteDocumentsError) {
          throw deleteDocumentsError;
        }
      }

      // Delete rows from 'sources' table
      const { error: sourcesError } = await supabase
        .from("sources")
        .delete()
        .eq("url", url)
        .eq("user_id", user_id);

      if (sourcesError) {
        throw sourcesError;
      }

      res.status(200).json({
        success: true,
        message: "Documents and sources deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
