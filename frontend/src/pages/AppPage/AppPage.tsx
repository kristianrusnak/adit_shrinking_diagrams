import {ErrorProvider} from "../../context/ErrorProvider";
import {Box} from "@mui/material";
import FileUploadButton from "../../components/ui/FileUploadButton";
import FilePreview from "../../components/ui/FilePreview";
import MessageInput from "../../components/ui/MessageInput";
import DummyResponseComponent from "../../components/ui/DummyResponseComponent";
import styles from "./AppPage.module.css";
import {useEffect} from "react";

export default function AppPage() {
  useEffect(() => {
    document.title = "Shrinking Diagrams";
  }, []);

  return (
    <div className={styles.page}>
      <ErrorProvider>
        <Box className={styles.content}>
          <FileUploadButton />
          <FilePreview />
          <MessageInput />
          <DummyResponseComponent />
        </Box>
      </ErrorProvider>
    </div>
  )
}
