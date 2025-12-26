import { Button, CircularProgress } from "@mui/material";
import CompressIcon from "@mui/icons-material/Compress";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useError } from "../../context/useError.jsx";
import {
  selectFile,
  setFileAsync,
  setFileReducedAsync,
} from "../../store/slices/fileSlice";
import {
  selectSelectedAlgorithm,
  selectCurrentAlgorithmSettings,
} from "../../store/slices/algorithmSlice";
import { useProcessPumlMutation } from "@/api/api";
import { clearMessages } from "@/store/slices/messageSlice";
import { logger } from "../../utils/logger";

interface ProcessDiagramButtonProps {
  onProcess?: () => void;
}

const ProcessDiagramButton = ({ onProcess }: ProcessDiagramButtonProps) => {
  const { showError } = useError() as {
    showError: (msg: string, title?: string) => void;
  };

  const dispatch = useDispatch<AppDispatch>();
  const selectedFile = useSelector(selectFile);
  const selectedAlgorithm = useSelector(selectSelectedAlgorithm);
  const selectedAlgorithmSettings = useSelector(selectCurrentAlgorithmSettings);
  const [processPuml, { isLoading }] = useProcessPumlMutation();

  const handleProcess = async () => {
    if (!selectedFile) {
      showError("Please upload a file first", "Missing file");
      return;
    }

    logger.info("Processing diagram with algorithm:", selectedAlgorithm);

    if (selectedAlgorithm === "none") {
      await dispatch(setFileAsync(selectedFile));
      await dispatch(setFileReducedAsync(selectedFile)); // we act as if we reduced the file but it stays the same
      dispatch(clearMessages());
      onProcess?.();
      return;
    }

    try {
      const response = await processPuml({
        file: selectedFile,
        algorithm: selectedAlgorithm,
        settings: selectedAlgorithmSettings,
      }).unwrap();
      const result = response.result_puml;
      logger.debug(`response: ${response.result_puml}`);

      const LS_KEY = "chat_conversation";
      localStorage.removeItem(LS_KEY);
      dispatch(clearMessages());

      await dispatch(setFileAsync(selectedFile));
      await dispatch(setFileReducedAsync(new File([result], selectedFile.name)));
      onProcess?.();
    } catch (error: any) {
      showError(error.data?.detail || "Error processing file", `Status: ${error.status}`);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleProcess}
      disabled={!selectedFile || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : <CompressIcon />}
      sx={{
        mt: 2,
        textTransform: "none",
        fontSize: "1rem",
        px: 4,
        py: 1.5,
      }}
    >
      {isLoading 
        ? "Shrinking diagram..." 
        : selectedAlgorithm === "none" 
          ? "Load diagram" 
          : "Shrink diagram"}
    </Button>
  );
};

export default ProcessDiagramButton;
