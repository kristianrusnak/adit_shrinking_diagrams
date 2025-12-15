import { Box, Grid, Stack, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FilePreview from "../../components/ui/FilePreview";
import MessageInput from "../../components/ui/MessageInput";
import Chat from "../../components/ui/Chat";
import styles from "./AppPage.module.css";
import Sidebar from "../../components/ui/Sidebar";
import { ErrorProvider } from "../../context/ErrorProvider";
import { useAuth } from "../../context/AuthProvider";
import SimpleFilePreview from "@/components/ui/SimpleFilePreview";
import { useState, useEffect } from "react";

interface AppPageProps {
  isUserLoggedIn?: boolean;
}

export default function AppPage({ isUserLoggedIn = false }: AppPageProps) {
  const { userInfo } = useAuth();
  const isLoggedIn = isUserLoggedIn || !!userInfo;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sidebar je na mobile defaultne skrytý, na desktop viditeľný
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Pri zmene na/z mobile automaticky adjust sidebar state
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <>
      <title>Shrinking Diagrams</title>
      <div className={styles.page}>
        <div className={styles.layout}>
          {/* Floating toggle button keď je sidebar skrytý */}
          {isLoggedIn && !isSidebarOpen && (
            <IconButton
              onClick={toggleSidebar}
              className={styles.floatingMenuButton}
              sx={{
                position: 'fixed',
                top: '2rem',
                left: '1.5rem',
                zIndex: 1000,
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                boxShadow: 3,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {isLoggedIn && isSidebarOpen && (
            <Box className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
              <Sidebar onToggle={toggleSidebar} onThreadSelect={isMobile ? toggleSidebar : undefined} />
            </Box>
          )}
          <Grid
            container
            spacing={1}
            sx={{
              width: "100%",
              marginLeft: isSidebarOpen && isLoggedIn ? '0' : '0',
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
                <MessageInput/>
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
