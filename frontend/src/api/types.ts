type ProcessPumlResponse = {
  parsed: any;
  reduced: any;
  result_puml: string;
};

type UserInfo = {
  id: number;
  email: string;
  access_token: string;
  refresh_token: string;
};

type PumlPayload = {
  file: File;
  algorithm: string;
  settings: Record<string, any>;
};

type ChatMessage = {
  id: number;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  files: any[];
};
