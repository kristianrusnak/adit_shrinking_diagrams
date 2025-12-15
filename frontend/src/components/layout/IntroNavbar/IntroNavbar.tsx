import CardNav from "./CardNav";
import { useSelector } from "react-redux";
import { selectAccessToken } from "@/store/slices/authSlice";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";


export default function IntroNavbar() {
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  const { userInfo, logout } = useAuth();
  const isAuthenticated = Boolean(accessToken && userInfo);

  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Home", ariaLabel: "Home", href: "/" },
        { label: "Information", ariaLabel: "Information", href: "/about" },
        { label: "Docs", ariaLabel: "Docs", href: "/docs" },
      ],
    },
    {
      label: "App",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Go to app", ariaLabel: "Go to app", href: "/app" },
        {
          label: "Go to diagrams",
          ariaLabel: "Go to diagrams",
          href: "/diagrams",
        },
      ],
    },
    {
      label: "Account",
      bgColor: "#271E37",
      textColor: "#fff",
      links: isAuthenticated
        ? [
          { label: "Change password", ariaLabel: "Change password", href: "/change-password" },
            {
              label: "Logout",
              ariaLabel: "Logout",
              href: "#",
              onClick: async (e: React.MouseEvent) => {
                e.preventDefault();
                await logout();
                // await navigate("/");
                window.location.reload();
              },
            },
          ]
        : [
            { label: "Log in", ariaLabel: "Log in", href: "/login" },
            { label: "Register", ariaLabel: "Register", href: "/register" },
          ],
    },
  ];

  return (
    <CardNav
      logo={""}
      logoAlt="Shrinking Diagrams"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
}
