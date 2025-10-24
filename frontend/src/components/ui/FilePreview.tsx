import { Card, Box, Divider, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectFile } from "../../store/slices/fileSlice";
import { useEffect, useState } from "react";

const FilePreview = () => {
  const selectedFile = useSelector(selectFile);
  const [previewText, setPreviewText] = useState("");

  // console.log(selectedFile);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewText("");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setPreviewText(text);
    };

    reader.onerror = () => {
      // TODO: maybe use the error provider here? this should technically not happen though
      setPreviewText("Error reading file");
    };

    reader.readAsText(selectedFile);

    console.log(selectedFile);
  }, [selectedFile]);

  // TODO: add nicer preview (proper formatting?? scrolling text??)
  return (
    <Card>
      <Box sx={{ p: 2, minWidth: "250px" }}>
        <Typography variant="h6" gutterBottom>
          {selectedFile?.name ?? "No file selected"}
        </Typography>
        <Divider />
        <Typography variant="body2" textAlign="left" gutterBottom>
          {previewText}
        </Typography>
      </Box>
    </Card>
  );
};

export default FilePreview;
