import {Box} from "@mui/material";
import FilePreview from "../../components/ui/FilePreview";
import MessageInput from "../../components/ui/MessageInput";
import Chat from "../../components/ui/Chat";
import styles from "./AppPage.module.css";
import Sidebar from "../../components/ui/Sidebar";
import { ErrorProvider } from "../../context/ErrorProvider";
import ShrinkButton from "@/components/ui/ShrinkButton";

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
              <Box
                sx={{
                  display: "flex",
                  color: "inherit",
                  alignItems: "center",
                  position: "fixed",   // always fixed relative to viewport
                  bottom: 16,          // distance from bottom
                  left: 0,
                  right: 0,
                  px: 2, // horizontal padding
                  maxWidth: "900px",
                  margin: "0 auto", // center horizontally
                  width: "100%",
                  zIndex: 1000, // make sure it's above chat
                  gap: 2,
                }}
              >
                <MessageInput />
                <ShrinkButton />
              </Box>
            </Box>

          </div>
        </ErrorProvider>
      </div>
    </>
  );
}
