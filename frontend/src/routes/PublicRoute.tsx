import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "@/store/slices/authSlice";
import { useAuth } from "@/context/AuthProvider";
import type { ReactNode } from "react";

export default function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const accessToken = useSelector(selectAccessToken);
  const { userInfo, isUserLoading } = useAuth();
  const isAuthenticated = Boolean(accessToken && userInfo);
  if (accessToken && isUserLoading) {
    return null;
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
