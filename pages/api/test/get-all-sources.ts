// File: pages/api/sources.ts (or any desired path within the "pages/api" directory)

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/SupabaseClient";

// Utility function to validate URLs with "https" scheme
const isValidHttpsUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "https:";
  } catch (error) {
    return false;
  }
};

const getSources = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check if the request method is GET
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("sources").select("*");

      // Check for errors
      if (error) {
        throw error;
      }

      // Map over the retrieved data and add the "is_valid_url" key
      const sourcesWithValidation = data?.map((source) => ({
        ...source,
        is_valid_url: isValidHttpsUrl(source.url),
      }));

      // Return the modified data
      return res.status(200).json({ sources: sourcesWithValidation });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Handle unsupported request methods
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default getSources;
