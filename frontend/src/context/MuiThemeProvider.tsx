// DarkThemeProvider.tsx
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme } from "@/theme/theme";

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default MuiThemeProvider;
