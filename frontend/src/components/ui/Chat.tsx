import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { selectMessages } from "../../store/slices/messageSlice";
import { Box, Typography, Paper, Stack } from "@mui/material";

const Chat = () => {
  const messages = useSelector((state: RootState) => selectMessages(state));
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  return (
    <Stack
      spacing={2}
      sx={{
        overflowY: "auto",
        p: 2,
        maxWidth: "900px",
        marginBottom: "100px",
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
              color: "black",
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
      <div ref={bottomRef} />
    </Stack>
  );
};

export default Chat;
