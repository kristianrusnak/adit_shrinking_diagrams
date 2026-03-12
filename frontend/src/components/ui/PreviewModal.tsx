import { useState } from "react";
import { grey } from "@mui/material/colors";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// setup code highlighting
import Prism from "prismjs";
import "prismjs/components/prism-plant-uml";
import "prismjs/themes/prism.css";
// import "prismjs/themes/prism-okaidia.css";

interface PreviewModalProps {
  url: string;
  puml: string;
  handleClose: () => void;
  handleSnackbarOpen: (message: string) => void;
}

export const PreviewModal = ({
  url,
  puml,
  handleClose,
  handleSnackbarOpen,
}: PreviewModalProps) => {
  const [mode, setMode] = useState<string>("left");
  const [isPanning, setIsPanning] = useState(false);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: string,
  ) => {
    if (newMode !== null) setMode(newMode);
  };

  const handleDownload = async () => {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "diagram.png"; // correct extension
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    handleSnackbarOpen("Saving diagram...");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(puml);

    handleSnackbarOpen("Copied to clipboard!");
  };
  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        top: "50%",
        backgroundColor: "white !important",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: 24,
        borderRadius: 2,
        border: `2px solid ${theme.palette.primary.main} !important`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      })}
    >
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems="center"
        width={"100%"}
      >
        <IconButton
          sx={{
            backgroundColor: "primary.dark",
            "&:hover": {
              backgroundColor: "primary.main",
            },
            borderRadius: 2,
          }}
          onClick={mode === "left" ? handleDownload : handleCopy}
        >
          {mode === "left" ? <DownloadIcon /> : <AssignmentIcon />}
        </IconButton>

        <ToggleButtonGroup
          size="small"
          exclusive={true}
          value={mode}
          onChange={handleChange}
          sx={{ backgroundColor: "primary.dark" }}
        >
          <ToggleButton value="left" key="left">
            <ImageIcon />
          </ToggleButton>
          <ToggleButton value="right" key="right">
            <CodeIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <IconButton
          onClick={handleClose}
          sx={{
            backgroundColor: "primary.dark",
            "&:hover": {
              backgroundColor: "primary.main",
            },
            borderRadius: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      {mode === "left" ? (
        <Box
          sx={{
            width: "90vw",
            height: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            wheel={{ step: 0.15 }}
            centerOnInit
            onPanningStart={() => setIsPanning(true)}
            onPanningStop={() => setIsPanning(false)}
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                cursor: isPanning ? "grabbing" : "grab",
              }}
              contentStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={url}
                alt="PlantUML Diagram"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  display: "block",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </TransformComponent>
          </TransformWrapper>
        </Box>
      ) : (
        <Box
          component="pre"
          sx={{
            flexGrow: 1,
            minWidth: "500px",
            m: 0,
            p: 2,
            maxHeight: "70vh",
            overflow: "auto",
            borderRadius: 1,
            backgroundColor: grey[100],
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#e0e0e0",
              borderRadius: "2px",
            },
          }}
        >
          <Box
            component="code"
            className="language-plant-uml"
            sx={{
              fontFamily: "inherit",
              fontSize: "0.9rem",
              color: "black",
            }}
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                puml,
                Prism.languages["plant-uml"],
                "plant-uml",
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PreviewModal;
