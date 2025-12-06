import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/fileSlice";
import messageReducer from "./slices/messageSlice";
import authReducer from "./slices/authSlice";
import algorithmReducer from "./slices/algorithmSlice";
import { apiSlice } from "../api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    fileStore: fileReducer,
    messageStore: messageReducer,
    authStore: authReducer,
    algorithmStore: algorithmReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // we dont care about serialization
    }).concat([apiSlice.middleware]),
});

// Infer types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
