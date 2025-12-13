import { Box, Grid, Stack } from "@mui/material";
import FilePreview from "../../components/ui/FilePreview";
import MessageInput from "../../components/ui/MessageInput";
import Chat from "../../components/ui/Chat";
import styles from "./AppPage.module.css";
import Sidebar from "../../components/ui/Sidebar";
import { ErrorProvider } from "../../context/ErrorProvider";
import SimpleFilePreview from "@/components/ui/SimpleFilePreview";

export default function AppPage() {
  return (
    <>
      <title>Shrinking Diagrams</title>
      <div className={styles.page}>
        <div className={styles.layout}>
          <Box className={styles.sidebar}>
            <Sidebar />
          </Box>
          <Grid
            container
            spacing={1}
            sx={{
              width: "100%",
            }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 8,
              }}
            >
              <Box className={styles.content}>
                <Chat />
                <MessageInput />
              </Box>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <Stack direction="column">
                <SimpleFilePreview
                  title="Placeholder gpt response"
                  sx={{
                    borderRadius: 2,
                    minWidth: "200px",
                    height: "auto",
                    marginTop: 12,
                    backgroundColor: "primary.light",
                  }}
                />
                <SimpleFilePreview
                  title="Shrunk diagram"
                  sx={{
                    borderRadius: 2,
                    minWidth: "200px",
                    height: "auto",
                    // marginTop: 12,
                    backgroundColor: "primary.light",
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}
