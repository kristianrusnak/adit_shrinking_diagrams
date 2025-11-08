import {ErrorProvider} from "../../context/ErrorProvider";
import {Box} from "@mui/material";
import FileUploadButton from "../../components/ui/FileUploadButton";
import FilePreview from "../../components/ui/FilePreview";
import MessageInput from "../../components/ui/MessageInput";
import DummyResponseComponent from "../../components/ui/DummyResponseComponent";
import './AppPage.module.css';

export default function AppPage() {
  return (
    <>
      <ErrorProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "600px",
          }}
        >
          <FileUploadButton />
          <FilePreview />
          <MessageInput />
          <DummyResponseComponent />
        </Box>
      </ErrorProvider>
    </>
  )
}
