import { Box, Button, Typography } from "@mui/material";
import { useSendMessageMutation } from "../../api/dbApi";
import { useState } from "react";
import { useError } from "../../context/useError";

// This is just a dummy component. The real component should use file/message from the store
const DummyResponseComponent = () => {
  const [sendMessage, { data, error, isLoading }] = useSendMessageMutation();
  const [response, setResponse] = useState("placeholder");
  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };

  const handleClick = async () => {
    try {
      const response = await sendMessage({
        file: "test.txt",
        message: "test",
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
