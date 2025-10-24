import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileState {
  file: File | null; // pump file
  message: string; // openai prompt
}

const initialState: FileState = {
  file: null,
  message: "",
};

// selectors
export const selectFile = (state: any): File | null => state.fileStore.file;
export const selectMessage = (state: any): string => state.fileStore.message;

const fileSlice = createSlice({
  name: "fileStore",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File | null>) => {
      state.file = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setFile, setMessage } = fileSlice.actions;
export default fileSlice.reducer;
