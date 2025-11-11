import { Outlet } from "react-router-dom";
import IntroNavbar from "../../components/layout/IntroNavbar/IntroNavbar";

export default function IntroNavbarPage() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1
    }}>
      <IntroNavbar />
      <Outlet />
    </div>
  );
}
