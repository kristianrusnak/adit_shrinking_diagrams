import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

interface ProtectedRouteProps {
  redirectTo: string;
}

const ProtectedRoute = ({ redirectTo }: ProtectedRouteProps) => {
  const { userInfo, isUserLoading } = useAuth();

  // console.log(userInfo);
  if (isUserLoading) return <div>Loading...</div>;

  if (!userInfo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
