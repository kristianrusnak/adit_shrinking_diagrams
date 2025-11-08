import { Routes, Route } from "react-router-dom";
import IntroPage from "../pages/IntroPage/IntroPage";
import AppPage from "../pages/AppPage/AppPage";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </>
  );
}
