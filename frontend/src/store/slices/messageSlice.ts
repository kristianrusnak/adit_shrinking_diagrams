import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  file?: File | { name: string; content: string } | null; // optional file (not stored in localStorage)
  timestamp: number;
}

interface MessageState {
  messages: ChatMessage[];
  isLoading: boolean; // optional: sending state
}

// Load messages from localStorage if available
const LS_KEY = "chat_conversation";
const persistedMessages = localStorage.getItem(LS_KEY);
const initialState: MessageState = {
  messages: persistedMessages ? JSON.parse(persistedMessages) : [],
  isLoading: false,
};

const messageSlice = createSlice({
  name: "messageStore",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<ChatMessage, "id" | "timestamp">>) => {
      const newMessage: ChatMessage = {
        id: uuidv4(),
        timestamp: Date.now(),
        ...action.payload,
      };

      state.messages.push(newMessage);

      // Persist only messages without file to localStorage
      const messagesForStorage = state.messages.map(msg => ({
        ...msg,
        file: null,
      }));
      localStorage.setItem(LS_KEY, JSON.stringify(messagesForStorage));
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
      const messagesForStorage = action.payload.map(msg => ({
        ...msg,
        file: null,
      }));
      localStorage.setItem(LS_KEY, JSON.stringify(messagesForStorage));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearMessages: state => {
      state.messages = [];
      localStorage.removeItem(LS_KEY);
    },
  },
});

export const { addMessage, setMessages, setLoading, clearMessages } = messageSlice.actions;

// Selectors
export const selectMessages = (state: any) => state.messageStore.messages;
export const selectIsLoading = (state: any) => state.messageStore.isLoading;

export default messageSlice.reducer;
