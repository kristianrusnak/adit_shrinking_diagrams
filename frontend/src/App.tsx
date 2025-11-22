import "./assets/styles/main.css";
import { ErrorProvider } from "./context/ErrorProvider";
import MuiThemeProvider from "./context/MuiThemeProvider";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ErrorProvider>
      <MuiThemeProvider>
        <AppRoutes />
      </MuiThemeProvider>
    </ErrorProvider>
  );
}
