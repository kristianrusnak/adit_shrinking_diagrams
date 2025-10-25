import { apiSlice } from "./apiSlice";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation<string, { file: string; message: string }>({
      query: (data) => ({
        url: "api/sendMessage",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data;
      },
      invalidatesTags: [],
    }),
  }),
  overrideExisting: false,
});

export const { useSendMessageMutation } = extendedApi;
