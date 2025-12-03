import "./assets/styles/main.css";
import { AuthProvider } from "./context/AuthProvider";
import { ErrorProvider } from "./context/ErrorProvider";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <ErrorProvider>
        <AppRoutes />
      </ErrorProvider>
    </AuthProvider>
  );
}
