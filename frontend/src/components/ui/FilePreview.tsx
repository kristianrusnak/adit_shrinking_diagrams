import {
  Card,
  Box,
  Divider,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectFile } from "../../store/slices/fileSlice";
import { useEffect, useState } from "react";
import { useSendMockMutation } from "../../api/dbApi";
import { useError } from "../../context/useError.jsx";
import getSplitDiffRows from "../../utils/myersdiff";

const FilePreview = () => {
  const selectedFile = useSelector(selectFile);
  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };
  const [previewText, setPreviewText] = useState("");
  const [previewText2, setPreviewText2] = useState("");
  const [sendMock, { data, error, isLoading }] = useSendMockMutation();

  // console.log(selectedFile);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewText("");
      setPreviewText2("");
      return;
    }

    const fetchResponse = async () => {
      const beforeProcessing = await selectedFile.text();
      setPreviewText2(beforeProcessing);

      try {
        const response = await sendMock({ file: selectedFile }).unwrap();
        const filtered = response.split("\n").filter((line, idx) => idx % 2);

        setPreviewText(filtered.join("\n"));
        console.log("got response");

        const splitRows = getSplitDiffRows(
          beforeProcessing.split("\n"),
          filtered,
        );
        console.log(splitRows);
      } catch (error: any) {
        showError(error.error, `Status: ${error.status}`);
      }
    };

    fetchResponse();
  }, [selectedFile]);

  return (
    <Card sx={{ minWidth: "800px", marginTop: 2, marginBottom: 2 }}>
      {selectedFile && (
        <Stack direction="row" spacing={0} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              backgroundColor: "#e0e0e0",
              color: "#000",
              p: 2,
              width: "50%",
              overflow: "auto",
              maxHeight: "250px",
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
            <Typography variant="h6" gutterBottom>
              {selectedFile?.name ?? "No file selected"}
            </Typography>
            <Divider />

            <Typography
              variant="body2"
              textAlign="left"
              gutterBottom
              sx={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
              }}
            >
              {previewText2}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#e0e0e0",
              color: "#000",
              p: 2,
              width: "50%",
              overflow: "auto",
              maxHeight: "250px",
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
            <Typography variant="h6" gutterBottom>
              {"Processed " + selectedFile?.name ?? "No file selected"}
            </Typography>
            <Divider />

            <Typography
              variant="body2"
              textAlign="left"
              gutterBottom
              sx={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
              }}
            >
              {previewText}
            </Typography>
          </Box>
        </Stack>
      )}
    </Card>
  );
};

export default FilePreview;
