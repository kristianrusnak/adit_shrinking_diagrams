import { Routes, Route } from "react-router-dom";
import IntroPage from "../pages/IntroPage/IntroPage";
import AppPage from "../pages/AppPage/AppPage";
import IntroNavbarPage from "../pages/IntroNavbarPage/IntroNavbarPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import DocsPage from "../pages/DocsPage/DocsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TestRegisterLogin from "@/pages/Test/TestRegisterLogin";
import DiagramPage from "../pages/DiagramPage/DiagramPage";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroNavbarPage />}>
          <Route path="" element={<IntroPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="diagrams" element={<DiagramPage />} />
        </Route>
        <Route path="/app" element={<AppPage />} />
        <Route path="/testauth" element={<TestRegisterLogin />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
