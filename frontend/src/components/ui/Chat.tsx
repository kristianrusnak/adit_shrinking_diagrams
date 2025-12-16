import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { selectMessages, setMessages, clearMessages } from "../../store/slices/messageSlice";
import { Box, Typography, Paper, Stack, CircularProgress } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { useGetChatThreadQuery } from "@/api/api";
import { skipToken } from "@reduxjs/toolkit/query";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthProvider";
import { setFileAsync, setFileReducedAsync } from "../../store/slices/fileSlice";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { threadId } = useParams<{ threadId?: string }>();
  const { userInfo } = useAuth();
  const messages = useSelector((state: RootState) => selectMessages(state));
  
  // Load messages from backend if we're in a thread
  const { data: threadMessages, isLoading, isFetching } = useGetChatThreadQuery(
    threadId ?? skipToken
  );

  // When thread messages are loaded, update Redux and load last file
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

      const lastMessageWithFile = [...threadMessages]
        .reverse()
        .find((msg) => msg.files && msg.files.length > 0);
      
      if (lastMessageWithFile && lastMessageWithFile.files.length > 0) {
        const fileData = lastMessageWithFile.files[0];
        const blob = new Blob([fileData.file_content], { type: "text/plain" });
        const file = new File([blob], fileData.file_name, { type: "text/plain" });
        dispatch(setFileAsync(file));
        dispatch(setFileReducedAsync(file));
      } else {
        dispatch(setFileAsync(null));
        dispatch(setFileReducedAsync(null));
      }
    }
  }, [threadMessages, threadId, dispatch]);

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
        width: "100%",
        marginBottom: "2em",
        marginTop: "2em",
        paddingTop: 0,
      }}
    >
      {sortedMessages.length === 0 && userInfo && !threadId && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "200px" }}
        >
          <Typography variant="h6" color="text.secondary">
            Start a new conversation
          </Typography>
        </Box>
      )}
      {sortedMessages.map((msg) => (
        <Box
          key={msg.id}
          display="flex"
          justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
        >
          <Paper
            sx={{
              p: 1.5,
              maxWidth: "95%",
              backgroundColor:
                msg.role === "user" ? "primary.light" : "grey.200",
              color: "black",
              borderRadius: 2,
            }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
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
