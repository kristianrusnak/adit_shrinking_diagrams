import { Button } from "@mui/material";
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

    if (file.size > MAX_FILE_SIZE) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      showError("File too large", "File size error");
      return;
    }

    // const fileSize = event.target.files[0].size;
    // console.log(fileSize);

    // update file in store so that it can be used in other components
    dispatch(setFile(event.target.files[0]));
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        accept=".puml"
        onChange={handleChange}
      />
    </Button>
  );
};

export default FileUploadButton;
