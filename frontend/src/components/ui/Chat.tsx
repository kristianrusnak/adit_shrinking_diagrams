import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  selectMessages,
  setMessages,
  clearMessages,
} from "../../store/slices/messageSlice";
import { Box, Typography, Paper, Stack, CircularProgress } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { useGetChatThreadQuery } from "@/api/api";
import { skipToken } from "@reduxjs/toolkit/query";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthProvider";
import {
  setFileAsync,
  setFileReducedAsync,
} from "../../store/slices/fileSlice";

import {
  setFile,
  setFileReduced,
  setFileGpt,
} from "../../store/slices/fileSlice";
import useCenteredMessage from "../../utils/hooks/useCenteredMessage";

// currently active message source
type ActiveSource = "hover" | "observer";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();

  // refs for scrolling and centered message
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ref for determining active source
  const lastUpdateRef = useRef<{
    source: ActiveSource;
    ts: number;
  } | null>(null);

  const location = useLocation();
  const { threadId } = useParams<{ threadId?: string }>();
  const { userInfo } = useAuth();
  const messages = useSelector((state: RootState) => selectMessages(state));

  // observer for centered message
  const { centeredId, register } = useCenteredMessage(scrollRef, "top");
  const [activeId, setActiveId] = useState<string | null>(null);

  const updateActive = (id: string, source: ActiveSource) => {
    const COOLDOWN = 50; // prevent too many hovr updates to speed up scrolling
    const now = performance.now();
    const last = lastUpdateRef.current;

    if (!last || source === "hover" || now - last.ts > COOLDOWN) {
      lastUpdateRef.current = { source, ts: now };
      setActiveId(id);
    }
  };

  // Load messages from backend if we're in a thread
  const {
    data: threadMessages,
    isLoading,
    isFetching,
  } = useGetChatThreadQuery(threadId ?? skipToken);

  // update active message on scroll
  useEffect(() => {
    if (centeredId) {
      updateActive(centeredId, "observer");
    }
  }, [centeredId]);

  // When thread messages are loaded, update Redux and load last file
  useEffect(() => {
    if (threadMessages && threadId) {
      const formattedMessages = threadMessages.map((msg) => ({
        id: String(msg.id),
        // role: msg.role === "user" ? "user" : "agent", // why?
        role: msg.role,
        text: msg.content,
        file:
          msg.files && msg.files.length > 0
            ? {
                name: msg.files[0].file_name,
                content: msg.files[0].file_content,
              }
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
        const file = new File([blob], fileData.file_name, {
          type: "text/plain",
        });
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

  useEffect(() => {
    // make sure this is called last in the render queue (or after all the other effects)
    const scrollToBottom = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "instant" }); // temporary fix because AI messages reset scroll position to top for some reason
      } else {
        requestAnimationFrame(scrollToBottom);
      }
    };

    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  useEffect(() => {
    const msg = sortedMessages.find((msg) => msg.id === activeId);

    // extract puml diagram from the message
    const match = msg?.text.match(/(@startuml[\s\S]*?@enduml)/);
    if (match) {
      // console.log(match[1]);

      const file = new File([match[1]], "GptResponse.puml", {
        type: "text/plain",
      });

      dispatch(setFileGpt(file));
    } else {
      // console.log("No match");
      dispatch(setFileGpt(null));
    }
  }, [activeId, sortedMessages]);

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
      ref={scrollRef}
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
          ref={
            msg.role === "agent" || msg.role === "assistant"
              ? register(msg.id)
              : undefined
          } // only observe agent messages
          data-id={msg.id} // for IntersectionObserver, since key is not a real DOM attribute
          display="flex"
          justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
          onMouseEnter={
            msg.role === "assistant"
              ? () => updateActive(msg.id, "hover")
              : undefined
          }
        >
          <Paper
            sx={(theme) => ({
              p: 1.5,
              maxWidth: "95%",
              backgroundColor:
                msg.role === "user" ? "primary.light" : "grey.200",
              color: "black",
              borderRadius: 2,
              // box shadow instead of border to avoid jumpiness
              boxShadow:
                activeId === msg.id
                  ? `inset 0 0 0 5px ${theme.palette.primary.dark}`
                  : "none",
              transition: "box-shadow 0.15s ease",
            })}
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
