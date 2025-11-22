import FilePreview from "@/components/ui/FilePreview";
import FileUploadButton from "@/components/ui/FileUploadButton";
import { ErrorProvider } from "@/context/ErrorProvider";
import { Box } from "@mui/material";
import AlgorithmSelector from "@/components/ui/AlgorithmSelector";
import { useState } from "react";
import EvolutionarySettings from "@/components/ui/alg_settings/EvolutionarySettings";
import AlgorithmSettingsLayout from "@/components/ui/alg_settings/AlgorithmSettingsLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedAlgorithm,
  setSelectedAlgorithm,
} from "@/store/slices/algorithmSlice";

const algorithms = [
  {
    id: "kruskals",
    name: "Kruskal's algorithm",
    description: "Some short placeholder description",
  },
  {
    id: "evol",
    name: "Evolutionary algorithm",
    description: "Some short placeholder description",
  },
];

export const DiagramPage = () => {
  // const [selectedAlgorithm, setSelectedAlgorithm] = useState("kruskals");
  const dispatch = useDispatch();
  const selectedAlgorithm = useSelector(selectSelectedAlgorithm);

  console.log(selectedAlgorithm);

  const algName = algorithms.find((a) => a.id === selectedAlgorithm)?.name;

  const selectAlgorithm = (id: string) => {
    dispatch(setSelectedAlgorithm(id));
  };

  return (
    <>
      <title>Shrinking Diagrams</title>
      <ErrorProvider>
        <Box
          sx={{
            mt: "120px",
            minHeight: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FileUploadButton />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <FilePreview />
            <AlgorithmSelector
              options={algorithms}
              value={selectedAlgorithm}
              onChange={(id) => selectAlgorithm(id)}
            />
          </Box>
          <AlgorithmSettingsLayout title={algName}>
            {selectedAlgorithm === "evol" && <EvolutionarySettings />}
          </AlgorithmSettingsLayout>
        </Box>
      </ErrorProvider>
    </>
  );
};

export default DiagramPage;
