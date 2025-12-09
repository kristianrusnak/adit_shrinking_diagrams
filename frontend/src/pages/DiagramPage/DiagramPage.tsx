import SimpleFilePreview from "@/components/ui/SimpleFilePreview";
import FileUploadButton from "@/components/ui/FileUploadButton";
import { ErrorProvider } from "@/context/ErrorProvider";
import { Box } from "@mui/material";
import AlgorithmSelector from "@/components/ui/AlgorithmSelector";
import { useEffect, useState } from "react";
import EvolutionarySettings from "@/components/ui/alg_settings/EvolutionarySettings";
import AlgorithmSettingsLayout from "@/components/ui/alg_settings/AlgorithmSettingsLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedAlgorithm,
  setSelectedAlgorithm,
} from "@/store/slices/algorithmSlice";

import { ButtonType } from "@/components/ui/FileUploadButton";
import FilePreviewDiagrams from "@/components/ui/FilePreviewDiagrams";
import { useGetAlgConfigQuery } from "@/api/dbApi";

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
  const [algConfig, setAlgConfig] = useState<{} | null>(null);

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: 3,
          }}
        >
          {selectedAlgorithm === "none" && <SimpleFilePreview />}
          {selectedAlgorithm !== "none" && <FilePreviewDiagrams />}
          <AlgorithmSelector
            options={algorithms}
            value={selectedAlgorithm}
            onChange={(id) => selectAlgorithm(id)}
          />
        </Box>
        <AlgorithmSettingsLayout title={algName}>
          {selectedAlgorithm === "evol" && (
            <EvolutionarySettings
              maxIterations={algConfig?.generations}
              maxPopulation={algConfig?.population_size}
            />
          )}
        </AlgorithmSettingsLayout>
      </Box>
    </>
  );
};

export default DiagramPage;
