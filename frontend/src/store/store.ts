import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/fileSlice";

export const store = configureStore({
  reducer: {
    fileStore: fileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // we dont care about serialization
    }),
});

// Infer types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
