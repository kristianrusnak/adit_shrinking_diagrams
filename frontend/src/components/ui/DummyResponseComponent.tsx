import { Box, Button, Typography } from "@mui/material";
import { useSendMessageMutation } from "../../api/dbApi";
import { useState } from "react";
import { useError } from "../../context/useError";
import {
  selectFile,
  selectMessage,
  selectFileReduced,
} from "../../store/slices/fileSlice";
import { useSelector } from "react-redux";
import BasicChat from "./BasicChat";

const PROMPT_DEFAULT = "Describe provided diagram in a few words.";

// TODO: we should figure out a meaningful name for this component + a more meaningful structure
// (ie: maybe group all form elements into a single component)
const DummyResponseComponent = () => {
  const [sendMessage, { data, error, isLoading }] = useSendMessageMutation();
  const selectedFile = useSelector(selectFile);
  const selectedFileReduced = useSelector(selectFileReduced);
  const selectedMessage = useSelector(selectMessage);

  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };

  const handleClick = async () => {
    try {
      // I added the kruskal's reduced file here but kept the old one as well
      // we might wanna send the original file too
      let file = null;
      let fileReduced = null;
      if (!selectedFile || !selectedFileReduced) {
        showError("No file selected", "Error");
        return;
      } else {
        file = selectedFile;
        fileReduced = selectedFileReduced;
      }
      await sendMessage({
        file: fileReduced,
        message: selectedMessage == "" ? PROMPT_DEFAULT : selectedMessage,
      }).unwrap();
    } catch (error: any) {
      showError(error.error, `Status: ${error.status}`);
    }
  };

  return (
    <Box sx={{
      minWidth: "300px",
      paddingTop: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}>
      <Button
        color="inherit"
        component="label"
        variant="outlined"
        loading={isLoading}
        loadingPosition="end"
        onClick={handleClick}
        sx={{
          "@media (prefers-color-scheme: dark)": {
            borderColor: "white !important",
            color: "white !important",
            backgroundColor: "gray !important",
          }
        }}
      >
        {isLoading ? "Processing request..." : "Send"}
      </Button>
      {data && <BasicChat text={data ? data : "..."} />}
    </Box>
  );
};

export default DummyResponseComponent;
