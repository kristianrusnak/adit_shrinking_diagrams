import { IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFile, selectFileReduced, selectIsAnyFileLoading } from "../../store/slices/fileSlice";
import { selectMessage, setMessage } from "../../store/slices/fileSlice";
import messageSlice, {addMessage, ChatMessage, selectMessages} from "../../store/slices/messageSlice";
import {useSendMessageMutation, useSendMockMutation, useCreateThreadAndSendPromptMutation, useSendPromptToThreadMutation} from "../../api/api"; // or your real send function
import { useError } from "../../context/useError.jsx";
import {store} from "@/store/store";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const SendButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId?: string }>();
  const { userInfo } = useAuth();
  const { showError } = useError() as { showError: (msg: string, title?: string) => void };

  const selectedFile = useSelector(selectFile);
  const selectedFileReduced = useSelector(selectFileReduced);
  const selectedMessage = useSelector(selectMessage);
  const isFileLoading = useSelector(selectIsAnyFileLoading);
  // const selectedMessages = useSelector(selectMessages);

  const [sendMessage, { data, error, isLoading }] = useSendMessageMutation(); // backend API call
  const [createThreadAndSendPrompt] = useCreateThreadAndSendPromptMutation();
  const [sendPromptToThread] = useSendPromptToThreadMutation();
  const [localLoading, setLocalLoading] = useState(false);

  const handleClick = async () => {
    if (isFileLoading) {
      showError("Prosím počkajte, kým sa dokončí načítanie súboru", "Načítavam");
      return;
    }

    if (!selectedMessage || !selectedFileReduced) {
      showError("Please enter a message and attach a file", "Input error");
      return;
    }

    setLocalLoading(true);

    try {
      // If user is authenticated and not in a thread, create a new thread
      if (userInfo && !threadId) {
        const result = await createThreadAndSendPrompt({
          file: selectedFileReduced,
          message: selectedMessage,
          title: selectedMessage.substring(0, 50), // Use first 50 chars as title
        }).unwrap();

        // clear MessageInput after sending
        dispatch(setMessage(""));

        // Navigate to the new thread - Chat will load messages from backend
        navigate(`/app/chat/${result.thread.id}`);
      } else if (userInfo && threadId) {
        // Authenticated user in existing thread
        // 1) Create user message and save in Redux
        dispatch(
          addMessage({
            role: "user",
            text: selectedMessage,
            file: selectedFileReduced || null,
          })
        );

        // clear MessageInput after sending
        dispatch(setMessage(""));

        // 2) Send message to existing thread
        const response = await sendPromptToThread({
          threadId: threadId,
          file: selectedFileReduced,
          message: selectedMessage,
        }).unwrap();

        // 3) Create agent message and save in Redux
        dispatch(
          addMessage({
            role: "assistant",
            text: response.content || "",
            file: null,
          })
        );
      } else {
        // Anonymous user - use old endpoint
        // 1) Create user message and save in Redux
        dispatch(
          addMessage({
            role: "user",
            text: selectedMessage,
            file: selectedFileReduced || null,
          })
        );

        // clear MessageInput after sending
        dispatch(setMessage(""));

        // 2) Send message and file to backend
        const selectedMessages = store.getState().messageStore.messages;
        console.log("selectedMessages:", selectedMessages);
        const PROMPT_DEFAULT = "Describe provided diagram in a few words.";
        const message = selectedMessage == "" ? PROMPT_DEFAULT : selectedMessage;
        const response = await sendMessage({
          file: selectedFileReduced,
          history: selectedMessages.length === 0 ?
            ["Describe provided diagram in a few words."]
            : selectedMessages,
        }).unwrap();

        // 3) Create agent message and save in Redux
        dispatch(
          addMessage({
            role: "assistant",
            text: response || "",
            file: null,
          })
        );
      }
    } catch (error: any) {
      showError(
        error.data?.detail || error.error || "Unknown error",
        "Send error",
      );
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <IconButton
      component="label"
      color="inherit"
      onClick={handleClick}
      sx={{
        width: 36,
        height: 36,
      }}
      disabled={localLoading || isLoading || isFileLoading}
      title={isFileLoading ? 'Načítavam súbor...' : undefined}
    >
      {localLoading || isLoading || isFileLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <SendOutlinedIcon />
      )}
    </IconButton>
  );
};

export default SendButton;
