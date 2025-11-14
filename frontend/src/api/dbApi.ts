import { apiSlice } from "./apiSlice";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation<string, { file: File; message: string }>({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("message", data.message);

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
  }),
  overrideExisting: false,
});

export const { useSendMessageMutation, useSendMockMutation } = extendedApi;
