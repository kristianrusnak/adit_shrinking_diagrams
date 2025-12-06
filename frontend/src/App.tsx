import "./assets/styles/main.css";
import { AuthProvider } from "./context/AuthProvider";
import { ErrorProvider } from "./context/ErrorProvider";
import MuiThemeProvider from "./context/MuiThemeProvider";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <ErrorProvider>
        <MuiThemeProvider>
          <AppRoutes />
        </MuiThemeProvider>
      </ErrorProvider>
    </AuthProvider>
  );
}
