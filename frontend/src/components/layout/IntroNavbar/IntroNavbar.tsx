import CardNav from "./CardNav";

export default function IntroNavbar() {
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
      links: [
        { label: "Log in", ariaLabel: "Log in", href: "login" },
        { label: "Register", ariaLabel: "Register", href: "register" },
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
