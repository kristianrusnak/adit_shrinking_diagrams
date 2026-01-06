import { Button, Modal, Box, Card, Typography } from "@mui/material";
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

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
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
          maxHeight: "250px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: grey[50],
          boxShadow: 3,
          borderRadius: 2,
          ...sx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {title ?? selectedFile}
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={(theme) => ({
              backgroundColor: `${theme.palette.primary.main} !important`,
              color: `${theme.palette.primary.contrastText} !important`,
              textTransform: "none",
            })}
          >
            Show Diagram
          </Button>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            borderRadius: 1,
            p: 1,
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
          <Typography variant="body2">{selectedFileText}</Typography>
        </Box>

        <Modal open={modalOpen} onClose={handleClose}>
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
            <img
              src={pumlUrl}
              alt="PlantUML Diagram"
              style={{
                width: "auto",
                maxWidth: "90vw",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                m: 1,
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Card>
    )
  );
};

export default SimpleFilePreview;
