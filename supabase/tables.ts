import { BotInfo } from "@/interfaces";
import { showSnackbar } from "@/utils";
import { supabase } from "@/utils/SupabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";

import fetch from "isomorphic-unfetch";

interface ApiResponse {
  success: boolean;
  error?: string;
}

export async function fetchBotCount(userId: string): Promise<number> {
  const { data, error, count } = await supabase
    .from("bots")
    .select("user_id", { count: "exact" })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching bot count:", error.message);
    return 0;
  }

  return count!;
}

export async function fetchSourceCount(userId: string): Promise<number> {
  const { data, error, count } = await supabase
    .from("sources")
    .select("user_id", { count: "exact" })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching source count:", error.message);
    return 0;
  }

  return count!;
}

export async function fetchQuestionCount(userId: string): Promise<number> {
  const { data, error, count } = await supabase
    .from("qna")
    .select("user_id", { count: "exact" })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching question count:", error.message);
    return 0;
  }

  return count!;
}

export async function fetchBotQuestionCount(
  userId: string,
  botId: string
): Promise<number> {
  const { data, error, count } = await supabase
    .from("qna")
    .select("user_id", { count: "exact" })
    .eq("user_id", userId)
    .eq("bot_id", botId);

  if (error) {
    console.error("Error fetching question count:", error.message);
    return 0;
  }

  return count!;
}

export async function fetchUserPlan(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("plan")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user plan:", error.message);
    return "";
  }

  return data ? data.plan : "";
}

export const CheckNAddUserInfo = async (user) => {
  console.log(`user CheckNAddUserInfo`, user);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user?.user_id);

  if (error) {
    console.log(`Error CheckNAddUserInfo: ${error.message}`);
    return false;
  }
  console.log(`data`, data);

  // add user email to mailerlite
  await addEmailToGroup(user?.email, "signed-up");

  if (data?.length === 0) {
    const { data, error } = await supabase
      .from("users")
      .insert({ email: user?.email, user_id: user?.id, plan: "free" });
    if (error) {
      console.log(`Error CheckNAddUserInfo: ${error.message}`);
      return false;
    }
    console.log(`user info added succesfully`, data);
    return true;
  } else {
    console.log(`user info already exists`);
    return true;
  }
};

async function addEmailToGroup(
  email: string,
  groupName: string
): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/add-email-to-mailerlite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, groupName }),
    });

    if (!response.ok) {
      throw new Error("Failed to add email to group");
    }

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling API:", error);
    return { success: false, error: error.message };
  }
}

export async function fetchUserByEmail(email) {
  try {
    console.log(`fetchUserByEmail`, email);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export const getBotInfo = async (bot_id) => {
  const { data, error } = await supabase
    .from("bots")
    .select("*")
    .eq("bot_id", bot_id);

  if (error) {
    console.log(`Error getBotInfo: ${error.message}`);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
};

export const getAllBotsInfo = async (user_id): Promise<any> => {
  const { data, error } = await supabase
    .from("bots")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.log(`Error getAllBots: ${error.message}`);
    return false;
  }

  return data;
};

export const uploadBotInfo = async (
  user_id,
  botInfo: BotInfo
): Promise<any> => {
  // botInfo = {
  //     name: botInfo.name,
  //     description: botInfo.description,
  //     lastupdated: serverTimestamp(),
  //     language: botInfo.language,
  //   };

  const { data, error } = await supabase
    .from("bots")
    .insert({ ...botInfo, user_id: user_id });

  if (error) {
    console.log(`Error uploadBotInfo: ${error.message}`);
    return { success: false, error: error.message };
  }

  console.log(`bot info added succesfully`, data);
  return { success: true, data: data };
};

export const getSources = async (bot_id) => {
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("bot_id", bot_id);

  if (error) {
    console.log(`Error getSources: ${error.message}`);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
};

export const updateBotInfoInitialMessage = async (bot_id, initialMessage) => {
  console.log(`updateBotInfoInitialMessage`, bot_id, initialMessage);
  const { data, error } = await supabase
    .from("bots")
    .update({ initial_message: initialMessage })
    .eq("bot_id", bot_id);

  if (error) {
    console.log(`Error updateBotInfo: ${error.message}`);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
};

export async function deleteSource(
  botId: string,
  source: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("bot_id", botId)
      .filter("metadata", "source", source);

    if (error) {
      console.error("Error deleting rows:", error);
      return;
    }

    console.log("Rows deleted successfully.");
  } catch (error) {
    console.error("Error executing deleteRows function:", error);
  }
}
