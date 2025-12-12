import UserMenu from "./UserMenu";

export default function UserMenuFloating() {
  return (
    <div
      style={{
        position: "fixed",
        top: 34,
        right: 16,
        zIndex: 1000,
      }}>
      <UserMenu />
    </div>
  );
}
