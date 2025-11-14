import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useDispatch } from "react-redux";
import { setMessage } from "../../store/slices/fileSlice";

const MessageInput = () => {
  const dispatch = useDispatch();
  // const message = useSelector(selectMessage);
  //
  // console.log(message);
  //
  const handleChange = (event) => {
    dispatch(setMessage(event.target.value));
  };

  return (
    <TextareaAutosize
      maxRows={8}
      minRows={3}
      placeholder="Type your message here..."
      style={{
        width: 600,
        border: "1px solid #ccc",
    }}
      onChange={handleChange}
    />
  );
};

export default MessageInput;
