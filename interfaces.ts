export type Plan = "starter" | "hobby" | "power" | "pro" | "enterprise";

export interface UserInfo {
  email: string;
  username: string;
  plan?: string;
  user_id: string;
  profile_pic: string;
  emailVerified?: boolean;
}

export interface BotInfo {
  bot_id?: string;
  name: string;
  description: string;
  language: string;
  last_updated: any;
  is_private: boolean;
  is_active: boolean;
  base_prompt: string;
  model: string;
}
