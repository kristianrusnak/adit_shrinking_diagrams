import { Box } from "@mui/material";
import FilePreview from "../../components/ui/FilePreview";
import MessageInput from "../../components/ui/MessageInput";
import Chat from "../../components/ui/Chat";
import styles from "./AppPage.module.css";
import Sidebar from "../../components/ui/Sidebar";

export default function AppPage() {
  return (
    <>
      <title>Shrinking Diagrams</title>
      <div className={styles.page}>
        <ErrorProvider>
          <div className={styles.layout}>
            <Box className={styles.sidebar}>
              <Sidebar />
            </Box>
            <Box className={styles.content}>
              <FilePreview />
              <Chat />
              <MessageInput />
            </Box>

          </div>
        </ErrorProvider>
      </div>
    </>
  );
}
