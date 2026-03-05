import { Snackbar, Button, Modal, Box, Card, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectFile,
  selectFileReduced,
  selectFileGpt,
} from "../../store/slices/fileSlice";
import { selectSelectedAlgorithm } from "../../store/slices/algorithmSlice";
import { useEffect, useState } from "react";

import { grey } from "@mui/material/colors";

import { algorithms } from "../../pages/DiagramPage/DiagramPage";
import { encodePlantUml } from "@/utils/pumlencoder";
import PreviewModal from "@/components/ui/PreviewModal";

interface SimpleFilePreviewProps {
  title?: string;
  sx?: any;
  type: "gpt" | "reduced";
}
const SimpleFilePreview = ({ title, sx, type }: SimpleFilePreviewProps) => {
  const selectedFile = useSelector(selectFile)?.name ?? "";
  const selectedFileReduced = useSelector(selectFileReduced);
  const selectedFileGpt = useSelector(selectFileGpt);
  const selectedAlgorithmId = useSelector(selectSelectedAlgorithm);
  const selectedAlgorithmName =
    algorithms.find((a) => a.id === selectedAlgorithmId)?.name ?? "";

  const [selectedFileText, setSelectedFileText] = useState("");
  const [pumlUrl, setPumlUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
  });

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleSnackbarOpen = (message: string) => {
    setSnackbarState({
      open: true,
      message: message,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarState({
      open: false,
      message: "",
    });
  };

  const PUML_URL_BASE = "https://www.plantuml.com/plantuml/png/";

  useEffect(() => {
    const getText = async (file: File) => {
      const text = await file.text();
      const encoded = encodePlantUml(text);
      setSelectedFileText(text);
      setPumlUrl(PUML_URL_BASE + encoded);
    };
    if (type === "reduced") {
      if (!selectedFileReduced) {
        return;
      }
      getText(selectedFileReduced);
    } else if (type === "gpt") {
      if (!selectedFileGpt) {
        return;
      }
      getText(selectedFileGpt);
    }
  }, [type, selectedFileReduced, selectedFileGpt]);

  const bg1 = grey[50];

  const shouldRender =
    type === "reduced" ? !!selectedFileReduced : !!selectedFileGpt;
  return (
    shouldRender && (
      <Card
        sx={{
          minWidth: "800px",
          color: "#000",
          p: 2,
          mb: 2,
          display: "flex",
          overflow: "visible",
          flexDirection: "column",
          backgroundColor: grey[50],
          boxShadow: 3,
          borderRadius: 2,
          ...sx,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
          {title ?? selectedFile}
        </Typography>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            borderRadius: 1,
            backgroundColor: grey[100],
          }}
        >
          <Box
            component="img"
            src={pumlUrl}
            alt="PlantUML Diagram"
            onClick={handleOpen}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              cursor: "pointer",
              display: "block",
            }}
          />
        </Box>

        <Modal open={modalOpen} onClose={handleClose}>
          <PreviewModal
            url={pumlUrl}
            puml={selectedFileText}
            handleClose={handleClose}
            handleSnackbarOpen={handleSnackbarOpen}
          />
        </Modal>

        <Snackbar
          open={snackbarState.open}
          autoHideDuration={3500}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          onClose={handleSnackbarClose}
          message={snackbarState.message}
        />
      </Card>
    )
  );
};

export default SimpleFilePreview;
