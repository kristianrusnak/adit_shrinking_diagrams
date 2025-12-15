import UserMenu from "./UserMenu";

export default function UserMenuFloating() {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: 24,
        zIndex: 1400,
      }}>
      <UserMenu />
    </div>
  );
}
