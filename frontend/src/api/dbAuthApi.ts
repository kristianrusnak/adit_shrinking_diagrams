import { apiSlice } from "./apiSlice";
import type { UserInfo } from "./types";

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<UserInfo, { email: string; password: string }>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: build.mutation<UserInfo, { username: string; password: string }>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: data.username,
          password: data.password,
        }),
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
    getUserInfo: build.query<UserInfo, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetUserInfoQuery,
  useChangePasswordMutation,
} = extendedApi;
