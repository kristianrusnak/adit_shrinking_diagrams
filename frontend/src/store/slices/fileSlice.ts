import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileState {
  file: File | null; // pump file
  fileReduced: File | null; // reduced file
  message: string; // openai prompt
}

// Keys for localStorage
const LS_FILE_KEY = "chat_file";
const LS_FILE_REDUCED_KEY = "chat_file_reduced";

// Helper to serialize File to localStorage
const serializeFile = async (file: File | null): Promise<string | null> => {
  if (!file) return null;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const serialized = JSON.stringify({
        name: file.name,
        type: file.type,
        content: reader.result, // base64 string
      });
      resolve(serialized);
    };
    reader.readAsDataURL(file);
  });
};

// Helper to deserialize File from localStorage
const deserializeFile = (serialized: string | null): File | null => {
  if (!serialized) return null;
  
  try {
    const data = JSON.parse(serialized);
    // Convert base64 back to File
    const byteString = atob(data.content.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: data.type });
    return new File([blob], data.name, { type: data.type });
  } catch (e) {
    console.error("Error deserializing file:", e);
    return null;
  }
};

// Load files from localStorage on init
const persistedFile = deserializeFile(localStorage.getItem(LS_FILE_KEY));
const persistedFileReduced = deserializeFile(localStorage.getItem(LS_FILE_REDUCED_KEY));

const initialState: FileState = {
  file: persistedFile,
  fileReduced: persistedFileReduced,
  message: "",
};

// selectors
export const selectFile = (state: any): File | null => state.fileStore.file;
export const selectFileReduced = (state: any): File | null =>
  state.fileStore.fileReduced;
export const selectMessage = (state: any): string => state.fileStore.message;

const fileSlice = createSlice({
  name: "fileStore",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File | null>) => {
      state.file = action.payload;
      if (action.payload) {
        serializeFile(action.payload).then((serialized) => {
          if (serialized) localStorage.setItem(LS_FILE_KEY, serialized);
        });
      } else {
        localStorage.removeItem(LS_FILE_KEY);
      }
    },
    setFileReduced: (state, action: PayloadAction<File | null>) => {
      state.fileReduced = action.payload;
      if (action.payload) {
        serializeFile(action.payload).then((serialized) => {
          if (serialized) localStorage.setItem(LS_FILE_REDUCED_KEY, serialized);
        });
      } else {
        localStorage.removeItem(LS_FILE_REDUCED_KEY);
      }
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setFile, setFileReduced, setMessage } = fileSlice.actions;
export default fileSlice.reducer;
