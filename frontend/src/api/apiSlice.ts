import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./authBaseQuery";

// this is the entry point for the api
// we can extend it later with more endpoints based on functionality (auth, model query, ...)
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [], // this can be used for caching later
  endpoints: (builder) => ({}),
});
