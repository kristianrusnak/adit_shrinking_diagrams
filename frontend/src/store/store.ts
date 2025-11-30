import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/fileSlice";
import authReducer from "./slices/authSlice";
import { apiSlice } from "../api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    fileStore: fileReducer,
    authStore: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // we dont care about serialization
    }).concat([apiSlice.middleware]),
});

// Infer types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
