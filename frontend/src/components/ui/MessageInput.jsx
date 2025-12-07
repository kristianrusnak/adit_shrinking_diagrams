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
            color: "inherit", // <-- inherit text color
          },
          "& .MuiOutlinedInput-input::placeholder": {
            color: "black",
            opacity: 0.5,
          },
          color: "black",
        }}
        slotProps={{
          input: {
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <FileUploadButton/>
                </InputAdornment>
              </>
            ),
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <SendButton />
                </InputAdornment>
              </>
            )
          },
        }}
      />
  );
};

export default MessageInput;
