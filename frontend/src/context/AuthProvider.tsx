import React, { createContext, useContext, useState } from "react";
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetUserInfoQuery,
} from "../api/dbAuthApi";
import { useLocalStorage } from "./useLocalStorage";

interface AuthContextInterface {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  refresh: () => Promise<string>; // returns new access token
  userInfo?: UserInfo;
}

export const AuthContext = createContext({} as AuthContextInterface);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh_token", "");
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [refreshMutation] = useRefreshMutation();

  const handleLogin = async (email: string, password: string) => {
    const response = await loginMutation({ email, password }).unwrap();
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setUserInfo(response);
    return response;
  };

  const handleLogout = async () => {
    if (refreshToken) {
      await logoutMutation(refreshToken).unwrap();
    }
    setAccessToken("");
    setRefreshToken("");
    setUserInfo(undefined);
  };

  const handleRefresh = async () => {
    if (!refreshToken) throw new Error("No refresh token");
    const response = await refreshMutation(refreshToken).unwrap();
    setAccessToken(response.access_token);
    return response.access_token;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggingIn,
        isLoggingOut,
        login: handleLogin,
        logout: handleLogout,
        refresh: handleRefresh,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
