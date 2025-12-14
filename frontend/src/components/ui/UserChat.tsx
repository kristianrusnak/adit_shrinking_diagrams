import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { selectMessages } from "../../store/slices/messageSlice";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetThreadByIdQuery } from "../../api/dbChatApi";
import { useError } from "../../context/useError.jsx";
import { useDispatch } from "react-redux";
import { setFile, setFileReduced } from "@/store/slices/fileSlice";

import { skipToken } from "@reduxjs/toolkit/query";

const UserChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };

  const dispatch = useDispatch();

  const {
    data: threadMessages,
    error,
    isLoading,
  } = useGetThreadByIdQuery(id ?? skipToken);

  if (error) {
    if ("status" in error) {
      console.log("got here");
      switch (error.status) {
        case 401:
          navigate("/login");
          break;
        case 403:
        case 404:
          console.log("no chat found");
          navigate("/app");
      }
    } else {
      // fallback error
      console.log(error);
      navigate("/");
    }
  }

  if (threadMessages && threadMessages.length > 0) {
    if (threadMessages[0].files.length > 0) {
      console.log(threadMessages[0]);
      const filetmp =
        threadMessages[0].files[threadMessages[0].files.length - 1];
      const file = new File([filetmp.file_content], filetmp.file_name);
      // placeholder until it is clear what we want to show
      // this sets the file to the one that was initially sent to the backend
      // by default it will
      // dispatch(setFile(file));
      dispatch(setFile(file));
      dispatch(setFileReduced(file));
    }
  }

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  console.log(threadMessages);

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
      {threadMessages?.map((msg) => (
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
            <Typography variant="body1">{msg.content}</Typography>
            {msg.files[msg.files.length - 1] && ( // last file
              <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                File attached: {msg.files[msg.files.length - 1].file_name}
              </Typography>
            )}
          </Paper>
        </Box>
      ))}
      <div ref={bottomRef} />
    </Stack>
  );
};

export default UserChat;
