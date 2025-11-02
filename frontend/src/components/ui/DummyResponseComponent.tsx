import { Box, Button, Typography } from "@mui/material";
import { useSendMessageMutation } from "../../api/dbApi";
import { useState } from "react";
import { useError } from "../../context/useError";
import { selectFile } from "../../store/slices/fileSlice";
import { useSelector } from "react-redux";

// This is just a dummy component. The real component should use file/message from the store
const DummyResponseComponent = () => {
  const [sendMessage, { data, error, isLoading }] = useSendMessageMutation();
  const [response, setResponse] = useState("placeholder");
  const selectedFile = useSelector(selectFile);

  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };

  const handleClick = async () => {
    try {
      let file = null;
      if (!selectedFile) {
        file = new File(["Hello tell me who you are"], "test.txt", {
          type: "text/plain",
        });
      } else {
        file = selectedFile;
      }
      const response = await sendMessage({
        file: file,
        message: "what is in this file?",
      }).unwrap();
      setResponse(response);
    } catch (error: any) {
      // console.error(error);
      showError(error.error, `Status: ${error.status}`);
      setResponse(
        "An error has occured. This should contain response from the server once our backend is setup.",
      );
    }
  };

  return (
    <Box sx={{ minWidth: "300px" }}>
      <Button variant="contained" onClick={handleClick}>
        {isLoading ? "Processing request..." : "Send message"}
      </Button>
      <Typography variant="body2" textAlign="left">
        {response}
      </Typography>
    </Box>
  );
};

export default DummyResponseComponent;
