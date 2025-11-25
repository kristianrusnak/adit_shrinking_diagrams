import React, { createContext, useContext, useState } from "react";
import {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetUserInfoQuery,
} from "../api/dbAuthApi";
import { useLocalStorage } from "./useLocalStorage";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTokens,
  selectAccessToken,
  selectRefreshToken,
  setTokens,
} from "../store/slices/authSlice";
import { apiSlice } from "@/api/apiSlice";

interface AuthContextInterface {
  isRegistering: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  register: (email: string, password: string) => Promise<UserInfo>;
  login: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  refresh: () => Promise<string>; // returns new access token
  userInfo?: UserInfo;
}

export const AuthContext = createContext({} as AuthContextInterface);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);

  // sadly i realized that this hook doesnt work well with RTK so we use setters only and fetch access/refresh tokens from redux store which is synced with local storage manually
  const [, setAccessToken] = useLocalStorage("access_token", "");
  const [, setRefreshToken] = useLocalStorage("refresh_token", "");

  const [registerMutation, { isLoading: isRegistering }] =
    useRegisterMutation();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [refreshMutation] = useRefreshMutation();

  // console.log(accessToken);

  const { data } = useGetUserInfoQuery(accessToken ? undefined : skipToken);

  // these might throw errors but we bubble them up and handle them using the useError provider further up
  // it is up to whoever uses this to handle errors
  const handleRegister = async (email: string, password: string) => {
    const response = await registerMutation({ email, password }).unwrap();
    setAccessToken(response.access_token);
    setRefreshToken(response.refresh_token);

    dispatch(
      setTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      }),
    );
    return response;
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await loginMutation({ email, password }).unwrap();
    setAccessToken(response.access_token);
    setRefreshToken(response.refresh_token);

    dispatch(
      setTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      }),
    );
    return response;
  };

  const handleLogout = async () => {
    if (refreshToken) {
      await logoutMutation(refreshToken).unwrap();
    }
    setAccessToken("");
    setRefreshToken("");

    dispatch(clearTokens());
  };

  const handleRefresh = async () => {
    if (!refreshToken) throw new Error("No refresh token");
    const response = await refreshMutation(refreshToken).unwrap();
    setAccessToken(response.access_token);

    dispatch(setTokens({ accessToken: response.access_token, refreshToken }));
    return response.access_token;
  };

  return (
    <AuthContext.Provider
      value={{
        isRegistering,
        isLoggingIn,
        isLoggingOut,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        refresh: handleRefresh,
        userInfo: data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
