import { apiSlice } from "./apiSlice";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getThreadById: build.query<ChatMessage[], string>({
      query: (id) => ({
        url: `api/threads/${id}`,
        method: "GET",
      }),
      // providesTags: (result, error, id) => [{ type: "Thread", id }],
    }),

    sendPrompt: build.mutation<
      ChatMessage,
      { message: string; thread_id: string; file?: File }
    >({
      query: ({ message, thread_id, file }) => {
        const formData = new FormData();
        formData.append("message", message);
        formData.append("thread_id", thread_id);
        if (file) formData.append("file", file);

        return {
          url: `api/chat/sendPrompt`,
          method: "POST",
          body: formData,
        };
      },

      // optional for full cache invalidation
      // invalidatesTags: (result, error, { thread_id }) => [
      //   { type: "Thread", id: thread_id },
      // ],

      async onQueryStarted(
        { message, thread_id },
        { dispatch, queryFulfilled },
      ) {
        // optimistic update -> add the user message into the thread onto the frontend cache stack
        // if the request fails undo this message
        const patchResult = dispatch(
          extendedApi.util.updateQueryData(
            "getThreadById",
            thread_id,
            (draft) => {
              draft.push({
                id: Math.floor(Math.random() * 1000000), // temporary ID
                thread_id: thread_id,
                role: "user",
                content: message,
                created_at: new Date().toISOString(),
                files: [],
              });
            },
          ),
        );

        try {
          const { data: response } = await queryFulfilled;

          dispatch(
            extendedApi.util.updateQueryData(
              "getThreadById",
              thread_id,
              (draft) => {
                draft.push(response);
              },
            ),
          );
        } catch {
          // roll back if the request fails
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetThreadByIdQuery, useSendPromptMutation } = extendedApi;
