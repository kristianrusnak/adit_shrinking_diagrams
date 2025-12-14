import { apiSlice } from "./apiSlice";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getThreadById: build.query<ChatMessage[], string>({
      query: (id) => ({
        url: `api/threads/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Thread", id }],
    }),
    sendPrompt: build.mutation<
      ChatMessage,
      { message: string; thread_id: string; file?: File }
    >({
      query: ({ message, thread_id, file }) => {
        const formData = new FormData();
        formData.append("message", message);
        formData.append("thread_id", thread_id);
        if (file) {
          formData.append("file", file);
        }
        return {
          url: `api/chat/sendPrompt`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { thread_id }) => [
        { type: "Thread", id: thread_id },
      ],
    }),
  }),
});

export const { useGetThreadByIdQuery, useSendPromptMutation } = extendedApi;
