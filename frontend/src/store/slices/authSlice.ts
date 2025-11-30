import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string;
  refreshToken: string;
}

// persist state through page reloads but also have it as redux state for reactivity
const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token")?.replace(/"/g, "") || "", // localStorage likes to add quotes around the token when its strigified
  refreshToken: localStorage.getItem("refresh_token")?.replace(/"/g, "") || "",
};

export const selectAccessToken = (state: any): string =>
  state.authStore.accessToken;
export const selectRefreshToken = (state: any): string =>
  state.authStore.refreshToken;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
