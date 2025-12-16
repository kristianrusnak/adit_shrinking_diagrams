import SimpleFilePreview from "@/components/ui/SimpleFilePreview";
import FileUploadButton from "@/components/ui/FileUploadButton";
import ProcessDiagramButton from "@/components/ui/ProcessDiagramButton";
import { ErrorProvider } from "@/context/ErrorProvider";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import AlgorithmSelector from "@/components/ui/AlgorithmSelector";
import { useEffect, useState } from "react";
import EvolutionarySettings from "@/components/ui/alg_settings/EvolutionarySettings";
import AlgorithmSettingsLayout from "@/components/ui/alg_settings/AlgorithmSettingsLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedAlgorithm,
  setSelectedAlgorithm,
} from "@/store/slices/algorithmSlice";
import { selectIsAnyFileLoading, selectFile, selectFileReduced } from "@/store/slices/fileSlice";

import { ButtonType } from "@/components/ui/FileUploadButton";
import FilePreviewDiagrams from "@/components/ui/FilePreviewDiagrams";
import { useGetAlgConfigQuery } from "@/api/api";

export const algorithms = [
  {
    id: "kruskals",
    name: "Kruskal's algorithm",
    description: "Use Kruskal's algorithm for diagram shrinking.",
  },
  {
    id: "evol",
    name: "Evolutionary algorithm",
    description: "Use Evolutionary algorithm for diagram shrinking.",
  },
  {
    id: "none",
    name: "No algorithm",
    description: "Use no algorithm for diagram shrinking.",
  },
];

export const DiagramPage = () => {
  // const [selectedAlgorithm, setSelectedAlgorithm] = useState("kruskals");
  const dispatch = useDispatch();
  const selectedAlgorithm = useSelector(selectSelectedAlgorithm);
  const isFileLoading = useSelector(selectIsAnyFileLoading);
  const selectedFile = useSelector(selectFile);
  const selectedFileReduced = useSelector(selectFileReduced);
  const [algConfig, setAlgConfig] = useState<any | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  const { data, isLoading } = useGetAlgConfigQuery({
    algorithm: selectedAlgorithm,
  });

  console.log(selectedAlgorithm);

  const algName = algorithms.find((a) => a.id === selectedAlgorithm)?.name;

  const selectAlgorithm = (id: string) => {
    dispatch(setSelectedAlgorithm(id));
  };

  useEffect(() => {
    if (data) {
      console.log(data);

      // for now we only really care about evol settings but this will also return
      // kruskal edge weights
      setAlgConfig(data);
    }
  }, [data]);

  // Reset isProcessed when a new file is uploaded
  useEffect(() => {
    setIsProcessed(false);
  }, [selectedFile]);

  return (
    <>
      <title>Shrinking Diagrams</title>
      <Box
        sx={{
          mt: "120px",
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FileUploadButton type={ButtonType.FULL} />
        
        {/* Loading indicator */}
        {isFileLoading && (
          <Alert 
            severity="info" 
            icon={<CircularProgress size={20} />}
            sx={{ mt: 2, minWidth: "400px" }}
          >
            <Typography variant="body2">
              Načítavam a ukladám súbor... Prosím počkajte.
            </Typography>
          </Alert>
        )}

        {/* Algorithm selector - show only if file is uploaded */}
        {selectedFile && (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <AlgorithmSelector
              options={algorithms}
              value={selectedAlgorithm}
              onChange={(id) => selectAlgorithm(id)}
            />

            <AlgorithmSettingsLayout title={algName}>
              {selectedAlgorithm === "evol" && (
                <EvolutionarySettings
                  maxIterations={algConfig?.generations}
                  maxPopulation={algConfig?.population_size}
                />
              )}
            </AlgorithmSettingsLayout>

            <ProcessDiagramButton onProcess={() => setIsProcessed(true)} />
          </Box>
        )}
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: 3,
          }}
        >
          {selectedFile && !isProcessed && <SimpleFilePreview />}
          {selectedFile && isProcessed && selectedFileReduced && (
            selectedAlgorithm === "none" ? <SimpleFilePreview /> : <FilePreviewDiagrams />
          )}
        </Box>
      </Box>
    </>
  );
};

export default DiagramPage;
