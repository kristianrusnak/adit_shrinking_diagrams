import { apiSlice } from "./apiSlice";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<UserInfo, { email: string; password: string }>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: build.mutation<
      { access_token: string; token_type: string },
      string
    >({
      query: (refreshToken) => ({
        url: "auth/logout",
        method: "POST",
        body: {
          refresh_token: refreshToken,
        },
      }),
    }),
    refresh: build.mutation<
      { access_token: string; token_type: string },
      string
    >({
      query: (refreshToken) => ({
        url: "auth/refresh",
        method: "POST",
        body: {
          refresh_token: refreshToken,
        },
      }),
    }),
    getUserInfo: build.query<UserInfo, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetUserInfoQuery,
} = extendedApi;
