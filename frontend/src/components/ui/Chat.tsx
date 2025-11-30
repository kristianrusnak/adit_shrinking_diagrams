import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { selectMessages } from "../../store/slices/messageSlice";
import { Box, Typography, Paper, Stack } from "@mui/material";

const Chat = () => {
  const messages = useSelector((state: RootState) => selectMessages(state));
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <Stack
      spacing={2}
      sx={{
        overflowY: "auto",
        p: 2,
        maxWidth: "800px"
    }}>
      {sortedMessages.map((msg) => (
        <Box
          key={msg.id}
          display="flex"
          justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
        >
          <Paper
            sx={{
              p: 1.5,
              maxWidth: "70%",
              backgroundColor: msg.role === "user" ? "primary.light" : "grey.200",
              color: msg.role === "user" ? "black" : "inherit",
              borderRadius: 2,
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
            {msg.file && (
              <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                File attached: {msg.file.name}
              </Typography>
            )}
          </Paper>
        </Box>
      ))}
    </Stack>
  );
};

export default Chat;
