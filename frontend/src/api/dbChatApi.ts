import { apiSlice } from "./apiSlice";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getThreadById: build.query<ChatMessage[], string>({
      query: (id) => ({
        url: `api/threads/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetThreadByIdQuery } = extendedApi;
