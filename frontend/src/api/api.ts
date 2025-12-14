import { apiSlice } from "./apiSlice";
import type { ProcessPumlResponse, PumlPayload, ChatThread, ChatMessage, ThreadRenameRequest, ThreadCreateResponse } from "./types";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation<string, { file: File; history?: any[] }>({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);

        if (data.history) {
          formData.append("history", JSON.stringify(data.history));
        }

        return {
          url: "api/sendMessage",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: any) => {
        return response.response;
      },
      invalidatesTags: [],
    }),
    sendMock: build.mutation<string, { file: File }>({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);

        return {
          url: "api/sendMock",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: any) => {
        return response.response;
      },
      invalidatesTags: [],
    }),
    processPuml: build.mutation<ProcessPumlResponse, PumlPayload>({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("algorithm", data.algorithm);
        formData.append("settings", JSON.stringify(data.settings));

        // debug
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }

        return {
          url: "api/processPUML",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ProcessPumlResponse) => {
        return response;
      },
      invalidatesTags: [],
    }),
    getAlgConfig: build.query<any, { algorithm: string }>({
      query: (body) => ({
        url: "/api/getAlgConfig",
        method: "POST",
        body,
      }),
    }),
    getChatThreads: build.query<ChatThread[], void>({
      query: () => ({
        url: "api/threads",
        method: "GET",
      }),
      providesTags: ["ChatThreads"],
    }),
    getChatThread: build.query<ChatMessage[], string>({
      query: (threadId) => ({
        url: `api/threads/${threadId}`,
        method: "GET",
      }),
      providesTags: (result, error, threadId) => [
        { type: "ChatThread", id: threadId },
      ],
    }),
    renameThread: build.mutation<ChatThread, ThreadRenameRequest>({
      query: (data) => ({
        url: "api/threads/rename",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ChatThreads"],
    }),
    deleteThread: build.mutation<void, string>({
      query: (threadId) => ({
        url: `api/threads/delete/${threadId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatThreads"],
    }),
    createThread: build.mutation<ChatThread, { title?: string }>({
      query: (data) => {
        const formData = new FormData();
        if (data.title) {
          formData.append("title", data.title);
        }
        return {
          url: "api/threads/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ChatThreads"],
    }),
    createThreadAndSendPrompt: build.mutation<
      ThreadCreateResponse,
      { file?: File; message?: string; title?: string }
    >({
      query: (data) => {
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }
        if (data.message) {
          formData.append("message", data.message);
        }
        if (data.title) {
          formData.append("title", data.title);
        }
        return {
          url: "api/threads/createThreadAndSendPrompt",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ChatThreads"],
    }),
    sendPromptToThread: build.mutation<
      ChatMessage,
      { threadId: string; file?: File; message?: string }
    >({
      query: (data) => {
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }
        if (data.message) {
          formData.append("message", data.message);
        }
        formData.append("thread_id", data.threadId);
        return {
          url: "api/chat/sendPrompt",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { threadId }) => [
        { type: "ChatThread", id: threadId },
      ],
    }),
    changePassword: build.mutation<
      { detail: string },
      { current_password: string; new_password: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSendMessageMutation,
  useSendMockMutation,
  useProcessPumlMutation,
  useGetAlgConfigQuery,
  useGetChatThreadsQuery,
  useGetChatThreadQuery,
  useRenameThreadMutation,
  useDeleteThreadMutation,
  useCreateThreadMutation,
  useCreateThreadAndSendPromptMutation,
  useSendPromptToThreadMutation,
  useChangePasswordMutation,
} = extendedApi;
