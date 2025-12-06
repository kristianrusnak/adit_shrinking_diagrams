import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "@/store/store";
import { setTokens, clearTokens } from "@/store/slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).authStore.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// intercept 401 errors (unauthorized) and attempt to automatically refresh access token if refresh token exists
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = state.authStore.refreshToken;
    if (!refreshToken) {
      // no refresh token available, clear everything and redirect to login
      api.dispatch(clearTokens());
      localStorage.clear();
      window.location.href = "/login";
      return result;
    }

    // request new access token
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).access_token;

      // update redux store
      api.dispatch(setTokens({ accessToken: newAccessToken, refreshToken }));

      // update local storage
      localStorage.setItem("access_token", newAccessToken);

      // retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // refresh token is invalid or expired, logout user
      api.dispatch(clearTokens());
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return result;
};

export default baseQueryWithReauth;
