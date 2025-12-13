import { Box, Card, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectFile, selectFileReduced } from "../../store/slices/fileSlice";
import { selectSelectedAlgorithm } from "../../store/slices/algorithmSlice";
import { useEffect, useState } from "react";
import { useProcessPumlMutation, useSendMockMutation } from "../../api/api";
import { logger } from "../../utils/logger";
import { useError } from "../../context/useError.jsx";

import { grey } from "@mui/material/colors";

import { algorithms } from "../../pages/DiagramPage/DiagramPage";

interface SimpleFilePreviewProps {
  title?: string;
  sx?: any;
}
// only preview the "reduced" file
// TODO: in future we wanna convert puml to png and hsow it here
const SimpleFilePreview = ({ title, sx }: SimpleFilePreviewProps) => {
  const selectedFile = useSelector(selectFile)?.name ?? "";
  const selectedFileReduced = useSelector(selectFileReduced);
  const selectedAlgorithmId = useSelector(selectSelectedAlgorithm);
  const selectedAlgorithmName =
    algorithms.find((a) => a.id === selectedAlgorithmId)?.name ?? "";

  const [selectedFileText, setSelectedFileText] = useState("");

  useEffect(() => {
    if (!selectedFileReduced) {
      return;
    }

    const getText = async () => {
      const text = await selectedFileReduced.text();
      setSelectedFileText(text);
    };

    getText();
  }, [selectedFileReduced]);

  const bg1 = grey[50];

  return (
    selectedFile && (
      <Card
        sx={{
          minWidth: "800px",
          color: "#000",
          p: 2, // padding inside card
          marginBottom: 2,
          // backgroundColor: "background.paper", // theme-aware background
          // alignItems: "stretch",
          maxHeight: "250px",
          overflow: "auto",
          backgroundColor: `${bg1}`,
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
          boxShadow: 3, // optional floating effect
          ...sx, // override sx so we can reuse this component
        }}
      >
        <Typography variant="h6">{title ? title : selectedFile}</Typography>
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {selectedFileText}
        </Typography>
      </Card>
    )
  );
};

export default SimpleFilePreview;
