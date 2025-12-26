import { Box, IconButton, useMediaQuery, useTheme, Drawer, Alert, Typography, CircularProgress } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MessageInput from "../../components/ui/MessageInput";
import Chat from "../../components/ui/Chat";
import styles from "./AppPage.module.css";
import Sidebar from "../../components/ui/Sidebar";
import { ErrorProvider } from "../../context/ErrorProvider";
import ShrinkButton from "@/components/ui/ShrinkButton";
import { useAuth } from "../../context/AuthProvider";
import SimpleFilePreview from "@/components/ui/SimpleFilePreview";
import { useState, useEffect } from "react";
import { NAVBAR_HEIGHT } from "@/utils/layoutStyles";
import { useSelector } from "react-redux";
import { selectIsAnyFileLoading } from "@/store/slices/fileSlice";

interface AppPageProps {
  isUserLoggedIn?: boolean;
}

export default function AppPage({ isUserLoggedIn = false }: AppPageProps) {
  const { userInfo } = useAuth();
  const isLoggedIn = isUserLoggedIn || !!userInfo;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletOrBelow = useMediaQuery(theme.breakpoints.down('md'));
  const isFileLoading = useSelector(selectIsAnyFileLoading);
  
  // Sidebar je na mobile defaultne skrytý, na desktop viditeľný
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  // File preview je defaultne skrytý
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

  // Pri zmene na/z mobile automaticky adjust sidebar state
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleFilePreview = () => {
    setIsFilePreviewOpen(prev => !prev);
  };

  const handleThreadSelect = () => {
    // Na mobile zavrieme sidebar po výbere konverzácie
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <title>Shrinking Diagrams</title>
      <Box 
        className={styles.page}
        sx={{
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginTop: `${NAVBAR_HEIGHT}px`,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Toggle button keď je sidebar zatvorený */}
        {!isSidebarOpen && (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: 'fixed',
              left: 8,
              top: `${NAVBAR_HEIGHT + 28}px`,
              zIndex: 1200,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            aria-label="Open sidebar"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Sidebar - na mobile ako Drawer, na desktop ako fixný panel */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={isSidebarOpen}
            onClose={toggleSidebar}
            sx={{
              '& .MuiDrawer-paper': {
                width: '100%',
                marginTop: `${NAVBAR_HEIGHT}px`,
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
              },
            }}
          >
            <Sidebar 
              isOpen={isSidebarOpen} 
              onToggle={toggleSidebar} 
              onThreadSelect={handleThreadSelect}
            />
          </Drawer>
        ) : (
          isSidebarOpen && (
            <Box
              sx={{
                width: '280px',
                flexShrink: 0,
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={toggleSidebar} 
                onThreadSelect={handleThreadSelect}
              />
            </Box>
          )
        )}

        {/* Hlavný content - Chat v strede */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {/* Chat container s scroll */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Loading indicator */}
            {isFileLoading && (
              <Alert 
                severity="info" 
                icon={<CircularProgress size={20} />}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  Načítavam a ukladám súbor... Prosím počkajte.
                </Typography>
              </Alert>
            )}
            <Chat />
          </Box>

          {/* Message Input a Shrink Button - fixné dole */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 1,
              padding: '1rem',
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              alignItems: { xs: 'stretch', md: 'flex-end' },
            }}
          >
            <Box 
              sx={{ 
                flex: { xs: 'none', md: 1 },
                width: { xs: '100%', md: 'auto' },
                order: { xs: 2, md: 1 },
              }}
            >
              <MessageInput />
            </Box>
            <Box
              sx={{
                width: { xs: '100%', md: 'auto' },
                order: { xs: 1, md: 2 },
                display: { xs: 'flex', md: 'block' },
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <ShrinkButton />
            </Box>
          </Box>
        </Box>

        {/* Toggle button pre file preview keď je zatvorený */}
        {!isFilePreviewOpen && (
          <IconButton
            onClick={toggleFilePreview}
            sx={{
              position: 'fixed',
              right: 8,
              top: `${NAVBAR_HEIGHT + 28}px`,
              zIndex: 1200,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            aria-label="Open file preview"
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {/* File Previews - na mobile/tablete ako Drawer, na desktope ako panel */}
        {isTabletOrBelow ? (
          <Drawer
            anchor="right"
            open={isFilePreviewOpen}
            onClose={toggleFilePreview}
            sx={{
              '& .MuiDrawer-paper': {
                width: '100%',
                marginTop: `${NAVBAR_HEIGHT}px`,
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '1rem',
                height: '100%',
                overflow: 'auto',
              }}
            >
              <IconButton
                onClick={toggleFilePreview}
                sx={{
                  alignSelf: 'flex-end',
                  marginBottom: '0.5rem',
                }}
                aria-label="Close file preview"
              >
                <ChevronRightIcon />
              </IconButton>
              
              <SimpleFilePreview
                title="Placeholder gpt response"
                sx={{
                  borderRadius: 2,
                  minWidth: "200px",
                  height: "auto",
                  backgroundColor: "primary.light",
                }}
              />
              
              <SimpleFilePreview
                title="Shrunk diagram"
                sx={{
                  borderRadius: 2,
                  minWidth: "200px",
                  height: "auto",
                  backgroundColor: "primary.light",
                }}
              />
            </Box>
          </Drawer>
        ) : (
          isFilePreviewOpen && (
            <Box
              sx={{
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '1rem',
                overflow: 'auto',
                borderLeft: '1px solid',
                borderColor: 'divider',
                flexShrink: 0,
                backgroundColor: 'background.paper',
              }}
            >
              <IconButton
                onClick={toggleFilePreview}
                sx={{
                  alignSelf: 'flex-end',
                  marginBottom: '0.5rem',
                }}
                aria-label="Close file preview"
              >
                <ChevronRightIcon />
              </IconButton>
              
              <SimpleFilePreview
                title="Placeholder gpt response"
                sx={{
                  borderRadius: 2,
                  minWidth: "200px",
                  height: "auto",
                  backgroundColor: "primary.light",
                }}
              />
              
              <SimpleFilePreview
                title="Shrunk diagram"
                sx={{
                  borderRadius: 2,
                  minWidth: "200px",
                  height: "auto",
                  backgroundColor: "primary.light",
                }}
              />
            </Box>
          )
        )}
      </Box>
    </>
  );
}
