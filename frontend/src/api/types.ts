export type ProcessPumlResponse = {
  parsed: any;
  reduced: any;
  result_puml: string;
};

export type UserInfo = {
  id: number;
  email: string;
  access_token: string;
  refresh_token: string;
};

export type PumlPayload = {
  file: File;
  algorithm: string;
  settings: Record<string, any>;
};

export type ChatThread = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  last_diagram_file_id: number | null;
};

export type ChatMessage = {
  id: number;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  files: any[];
};

export type ThreadRenameRequest = {
  thread_id: string;
  new_title: string;
};

export type ThreadCreateResponse = {
  thread: ChatThread;
  response: ChatMessage;
};
