import {Badge,Box, Button, IconButton} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useError } from "../../context/useError.jsx";
import React, { useRef } from "react";
import {useDispatch, useSelector} from "react-redux";
import { setFile, setFileReduced } from "../../store/slices/fileSlice";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import {RootState} from "@/store/store";
import { logger } from "../../utils/logger";
import {useProcessPumlMutation} from "@/api/dbApi";
import {clearMessages} from "@/store/slices/messageSlice";

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUploadButton = () => {
  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };

  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [processPuml, { data, error, isLoading }] = useProcessPumlMutation();
  const uploadedFile = useSelector((state: RootState) => state.fileStore.file);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = async (file: File | null) => {
    if (file == null) {
      showError("No file selected", "File selection error");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      showError("File too large", "File size error");
      return;
    }

    const ext = file.name.split(".").pop();

    if (ext !== "puml") {
      showError("File must be a .puml file", "File type error");
      return;
    }

    logger.info("Inside of FileUploadButton.handleFile");

    try {
      const response = await processPuml({ file }).unwrap();
      const result = response.result_puml;
      logger.debug(`response: ${response.result_puml}`);

      dispatch(clearMessages());

      dispatch(setFile(file));
      dispatch(setFileReduced(new File([result], file.name)));
    } catch (error: any) {
      // might wanna clear out global store, or just keep the previous file like now
      // console.log(error);
      dispatch(setFile(null)); // this should not happen
      dispatch(setFileReduced(null));
      showError(error.data.detail, `Status: ${error.status}`);

      if (inputRef.current) {
        // clear out the input so we can trigger on change again if the user wants to upload the same file again (and fail)
        inputRef.current.value = "";
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      event.dataTransfer.items == null ||
      event.dataTransfer.items.length === 0
    ) {
      return;
    }

    if (event.dataTransfer.items.length > 1) {
      showError("Only one file can be dropped", "File selection error");
      return;
    }

    const file = event.dataTransfer.items[0].getAsFile();

    handleFile(file);
  };

  // prevent default behavior (load file in browser)
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Box onDrop={handleDrop} onDragOver={handleDragOver}>
      <Badge badgeContent={uploadedFile ? 1 : undefined}  color="primary">
        <IconButton
          component="label"
          color="inherit"
          onClick={() => {console.log("send message")}}
          sx={{
            width: 36,
            height: 36,
          }}
        >
        <AttachFileOutlinedIcon />
        <VisuallyHiddenInput
          ref={inputRef}
          type="file"
          accept=".puml"
          onChange={handleChange}
        />
        </IconButton>
      </Badge>
    </Box>
  );
};

export default FileUploadButton;
