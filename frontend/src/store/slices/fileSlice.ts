import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface FileState {
  file: File | null; // pump file
  fileReduced: File | null; // reduced file
  message: string; // openai prompt
  isLoadingFile: boolean; // indicates if file is being saved to localStorage
  isLoadingFileReduced: boolean; // indicates if reduced file is being saved to localStorage
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
  isLoadingFile: false,
  isLoadingFileReduced: false,
};

// Async thunks for setting files with localStorage persistence
export const setFileAsync = createAsyncThunk(
  'fileStore/setFileAsync',
  async (file: File | null) => {
    if (file) {
      const serialized = await serializeFile(file);
      if (serialized) {
        localStorage.setItem(LS_FILE_KEY, serialized);
      }
    } else {
      localStorage.removeItem(LS_FILE_KEY);
    }
    return file;
  }
);

export const setFileReducedAsync = createAsyncThunk(
  'fileStore/setFileReducedAsync',
  async (file: File | null) => {
    if (file) {
      const serialized = await serializeFile(file);
      if (serialized) {
        localStorage.setItem(LS_FILE_REDUCED_KEY, serialized);
      }
    } else {
      localStorage.removeItem(LS_FILE_REDUCED_KEY);
    }
    return file;
  }
);

// selectors
export const selectFile = (state: any): File | null => state.fileStore.file;
export const selectFileReduced = (state: any): File | null =>
  state.fileStore.fileReduced;
export const selectMessage = (state: any): string => state.fileStore.message;
export const selectIsLoadingFile = (state: any): boolean => state.fileStore.isLoadingFile;
export const selectIsLoadingFileReduced = (state: any): boolean => state.fileStore.isLoadingFileReduced;
export const selectIsAnyFileLoading = (state: any): boolean => 
  state.fileStore.isLoadingFile || state.fileStore.isLoadingFileReduced;

const fileSlice = createSlice({
  name: "fileStore",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File | null>) => {
      state.file = action.payload;
    },
    setFileReduced: (state, action: PayloadAction<File | null>) => {
      state.fileReduced = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // setFileAsync
      .addCase(setFileAsync.pending, (state) => {
        state.isLoadingFile = true;
      })
      .addCase(setFileAsync.fulfilled, (state, action) => {
        state.file = action.payload;
        state.isLoadingFile = false;
      })
      .addCase(setFileAsync.rejected, (state) => {
        state.isLoadingFile = false;
      })
      // setFileReducedAsync
      .addCase(setFileReducedAsync.pending, (state) => {
        state.isLoadingFileReduced = true;
      })
      .addCase(setFileReducedAsync.fulfilled, (state, action) => {
        state.fileReduced = action.payload;
        state.isLoadingFileReduced = false;
      })
      .addCase(setFileReducedAsync.rejected, (state) => {
        state.isLoadingFileReduced = false;
      });
  },
});

export const { setFile, setFileReduced, setMessage } = fileSlice.actions;
export default fileSlice.reducer;
