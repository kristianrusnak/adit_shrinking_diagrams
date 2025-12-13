import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage, selectMessage } from "../../store/slices/fileSlice";
import { Box, InputAdornment, TextField } from "@mui/material";
import FileUploadButton from "../../components/ui/FileUploadButton";
import { ButtonType } from "../../components/ui/FileUploadButton";
import SendButton from "../../components/ui/SendButton";
import ShrinkButton from "../../components/ui/ShrinkButton.js";

const MessageInput = () => {
  const dispatch = useDispatch();
  const message = useSelector(selectMessage);

  const handleChange = (event) => {
    dispatch(setMessage(event.target.value));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "fixed", // always fixed relative to viewport
        bottom: 16, // distance from bottom
        left: 0,
        right: 0,
        px: 2, // horizontal padding
        maxWidth: "800px",
        margin: "0 auto", // center horizontally
        width: "100%",
        zIndex: 1000, // make sure it's above chat
      }}
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        multiline={true}
        maxRows={5}
        fullWidth={true}
        placeholder={"Ask anything"}
        value={message}
        onChange={handleChange}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "background.paper", // <-- inherit page background
            color: "text.primary", // <-- adapt to theme
          },
          "& .MuiOutlinedInput-input::placeholder": {
            color: "text.secondary",
            opacity: 0.7,
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <FileUploadButton />
                </InputAdornment>
                <ShrinkButton position="start" />
              </>
            ),
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <SendButton />
                </InputAdornment>
              </>
            ),
          },
        }}
      />
    </Box>
  );
};

export default MessageInput;
