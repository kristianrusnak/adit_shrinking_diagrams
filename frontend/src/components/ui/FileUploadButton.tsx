import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useError } from "../../context/useError.jsx";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setFile } from "../../store/slices/fileSlice";

const MAX_FILE_SIZE = 1024; // for testing only
// const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
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

    dispatch(setFile(file));
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
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput
          ref={inputRef}
          type="file"
          accept=".puml"
          onChange={handleChange}
        />
      </Button>
    </Box>
  );
};

export default FileUploadButton;
