import { Box, Button, Typography } from "@mui/material";
import { useSendMessageMutation } from "../../api/dbApi";
import { useState } from "react";
import { useError } from "../../context/useError";
import { selectFile, selectMessage } from "../../store/slices/fileSlice";
import { useSelector } from "react-redux";
import BasicChat from "./BasicChat";

const PROMPT_DEFAULT = "Describe provided diagram in a few words.";

// TODO: we should figure out a meaningful name for this component + a more meaningful structure
// (ie: maybe group all form elements into a single component)
const DummyResponseComponent = () => {
  const [sendMessage, { data, error, isLoading }] = useSendMessageMutation();
  const selectedFile = useSelector(selectFile);
  const selectedMessage = useSelector(selectMessage);

  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };

  const handleClick = async () => {
    try {
      let file = null;
      if (!selectedFile) {
        showError("No file selected", "Error");
        return;
      } else {
        file = selectedFile;
      }
      await sendMessage({
        file: file,
        message: selectedMessage == "" ? PROMPT_DEFAULT : selectedMessage,
      }).unwrap();
    } catch (error: any) {
      showError(error.error, `Status: ${error.status}`);
    }
  };

  return (
    <Box sx={{ minWidth: "300px", paddingTop: 1, display: "flex", justifyContent: "center" }}>
      <Button variant="contained" onClick={handleClick}>
        {isLoading ? "Processing request..." : "Send"}
      </Button>
      {data && <BasicChat text={data ? data : "..."} />}
    </Box>
  );
};

export default DummyResponseComponent;
