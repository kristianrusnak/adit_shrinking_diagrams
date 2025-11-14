import { Outlet } from "react-router-dom";
import IntroNavbar from "../../components/layout/IntroNavbar/IntroNavbar";
import styles from "./IntroNavbarPage.module.css";

export default function IntroNavbarPage() {
  return (
    <div
    className={styles.IntroNavbarPage}
    >
      <IntroNavbar />
      <Outlet />
    </div>
  );
}
