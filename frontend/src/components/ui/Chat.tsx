import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { selectMessages, setMessages, clearMessages } from "../../store/slices/messageSlice";
import { Box, Typography, Paper, Stack, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetChatThreadQuery } from "@/api/dbApi";
import { skipToken } from "@reduxjs/toolkit/query";

const Chat = () => {
  const dispatch = useDispatch();
  const { threadId } = useParams<{ threadId?: string }>();
  const messages = useSelector((state: RootState) => selectMessages(state));
  
  // Load messages from backend if we're in a thread
  const { data: threadMessages, isLoading, isFetching } = useGetChatThreadQuery(
    threadId ?? skipToken
  );

  // When thread messages are loaded, update Redux
  useEffect(() => {
    if (threadMessages && threadId) {
      const formattedMessages = threadMessages.map((msg) => ({
        id: String(msg.id),
        role: msg.role === "user" ? "user" : "agent",
        text: msg.content,
        file: msg.files && msg.files.length > 0 
          ? { name: msg.files[0].file_name, content: msg.files[0].file_content } 
          : null,
        timestamp: new Date(msg.created_at).getTime(),
      }));
      dispatch(setMessages(formattedMessages as any));
    }
  }, [threadMessages, threadId, dispatch]);

  // Clear messages when leaving a thread
  useEffect(() => {
    if (!threadId) {
      // Only clear if we're not in a thread anymore
      // This allows local messages to persist when not in thread mode
    }
  }, [threadId]);

  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  if (isLoading || isFetching) {
    return (
      <Stack
        spacing={2}
        sx={{
          overflowY: "auto",
          p: 2,
          marginBottom: "50px",
          marginTop: 12,
          paddingTop: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack
      spacing={2}
      sx={{
        overflowY: "auto",
        p: 2,
        // px: { xs: 0, sm: 0, md: 5, lg: 10, xl: 40 },
        marginBottom: "50px",
        marginTop: 12,
        paddingTop: 0,
      }}
    >
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
              backgroundColor:
                msg.role === "user" ? "primary.light" : "grey.200",
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
