import "./App.css";
import FileUploadButton from "./components/ui/FileUploadButton.tsx";
import FilePreview from "./components/ui/FilePreview.tsx";
import { ErrorProvider } from "./context/ErrorProvider.jsx";
import { Box } from "@mui/material";

function App() {
  return (
    <ErrorProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <FileUploadButton />

        <FilePreview />
      </Box>
    </ErrorProvider>
  );
}

export default App;
