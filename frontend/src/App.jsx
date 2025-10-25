import "./App.css";
import FileUploadButton from "./components/ui/FileUploadButton.tsx";
import FilePreview from "./components/ui/FilePreview.tsx";
import { ErrorProvider } from "./context/ErrorProvider.jsx";
import { Box } from "@mui/material";
import DummyResponseComponent from "./components/ui/DummyResponseComponent";

function App() {
  return (
    <ErrorProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <FileUploadButton />
        <FilePreview />

        <DummyResponseComponent />
      </Box>
    </ErrorProvider>
  );
}

export default App;
