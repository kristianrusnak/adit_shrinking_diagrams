import { Routes, Route } from "react-router-dom";
import IntroPage from "../pages/IntroPage/IntroPage";
import AppPage from "../pages/AppPage/AppPage";
import IntroNavbarPage from "../pages/IntroNavbarPage/IntroNavbarPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import DocsPage from "../pages/DocsPage/DocsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TestRegisterLogin from "@/pages/Test/TestRegisterLogin";
import DiagramPage from "../pages/DiagramPage/DiagramPage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ProtectedRoute from "./ProtectedRoute";
import UserChat from "@/components/ui/UserChat";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroNavbarPage />}>
          <Route path="" element={<IntroPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="diagrams" element={<DiagramPage />} />
          <Route path="app" element={<AppPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute redirectTo="/app" />}>
            <Route
              path="chat/:id"
              element={<AppPage isUserLoggedIn={true} />}
            />
          </Route>
        </Route>
        <Route path="testauth" element={<TestRegisterLogin />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
