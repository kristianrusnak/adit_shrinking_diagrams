import { IconButton, CircularProgress } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {selectFile, selectFileReduced} from "../../store/slices/fileSlice";
import { selectMessage, setMessage } from "../../store/slices/fileSlice";
import { addMessage } from "../../store/slices/messageSlice";
import {useSendMessageMutation, useSendMockMutation} from "../../api/dbApi"; // or your real send function
import { useError } from "../../context/useError.jsx";

const SendButton = () => {
  const dispatch = useDispatch();
  const { showError } = useError() as { showError: (msg: string, title?: string) => void };

  const selectedFile = useSelector(selectFile);
  const selectedFileReduced = useSelector(selectFileReduced);
  const selectedMessage = useSelector(selectMessage);

  const [sendMessage, { data, error, isLoading }] = useSendMessageMutation(); // backend API call
  const [localLoading, setLocalLoading] = useState(false);

  const handleClick = async () => {
    if (!selectedMessage || !selectedFileReduced) {
      showError("Please enter a message and attach a file", "Input error");
      return;
    }

    setLocalLoading(true);

    try {
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
      const PROMPT_DEFAULT = "Describe provided diagram in a few words.";
      const message = selectedMessage == "" ? PROMPT_DEFAULT : selectedMessage;
      const response = await sendMessage({
        file: selectedFileReduced,
        message: message,
      }).unwrap();

      // 3) Create agent message and save in Redux
      dispatch(
        addMessage({
          role: "agent",
          text: response || "",
          file: null,
        })
      );
    } catch (error: any) {
      showError(error.data?.detail || error.error || "Unknown error", "Send error");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <IconButton
      component="button"
      color="inherit"
      onClick={handleClick}
      sx={{
        width: 36,
        height: 36,
      }}
      disabled={localLoading || isLoading}
    >
      {localLoading || isLoading ? <CircularProgress size={20} color="inherit" /> : <SendOutlinedIcon />}
    </IconButton>
  );
};

export default SendButton;
