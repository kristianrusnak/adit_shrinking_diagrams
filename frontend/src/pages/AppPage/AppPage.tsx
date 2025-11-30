import { Box } from "@mui/material";
import FilePreview from "../../components/ui/FilePreview";
import MessageInput from "../../components/ui/MessageInput";
import Chat from "../../components/ui/Chat";
import styles from "./AppPage.module.css";

export default function AppPage() {
  return (
    <>
      <title>Shrinking Diagrams</title>
      <div className={styles.page}>
        <Box className={styles.content}>
          <FilePreview />
          <Chat />
          <MessageInput />
        </Box>
      </div>
    </>
  );
}
