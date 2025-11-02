import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// this is the entry point for the api
// we can extend it later with more endpoints based on functionality (auth, model query, ...)
export const apiSlice = createApi({
  reducerPath: "dbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  tagTypes: [], // this can be used for caching later
  endpoints: (builder) => ({}),
});
