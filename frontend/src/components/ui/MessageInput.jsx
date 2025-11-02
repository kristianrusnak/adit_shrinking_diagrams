import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const MessageInput = () => {
  return (
    <TextareaAutosize
      maxRows={8}
      minRows={3}
      placeholder="Type your message here..."
      style={{ width: 400 }}
    />
  );
};

export default MessageInput;
