import { Box, Slider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAlgorithmSettings } from "@/store/slices/algorithmSlice";

interface EvolutionarySettingsProps {
  maxIterations?: number;
  maxPopulation?: number;
}

export const EvolutionarySettings = ({
  maxIterations = 100,
  maxPopulation = 50,
}: EvolutionarySettingsProps) => {
  const [iterations, setIterations] = useState(maxIterations);
  const [population, setPopulation] = useState(maxPopulation);
  const dispatch = useDispatch();

  // reflect config change in the UI
  useEffect(() => {
    setIterations(maxIterations);
    setPopulation(maxPopulation);
  }, [maxIterations, maxPopulation]);

  // debounce commiting to the global state store
  const onChangeIterations = (e: any, value: number) => {
    setIterations(value);
    dispatch(
      setAlgorithmSettings({
        algorithmId: "evol",
        settings: { iterations: value },
      }),
    );
  };

  const onChangePopulation = (e: any, value: number) => {
    setPopulation(value);
    dispatch(
      setAlgorithmSettings({
        algorithmId: "evol",
        settings: { population: value },
      }),
    );
  };

  return (
    <Stack spacing={4} sx={{ width: 300, p: 2 }}>
      <Box>
        <Typography gutterBottom variant="h6">
          Evolution settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Control how many generations are explored and how many individuals are
          evaluated in each run.
        </Typography>
      </Box>

      <Box>
        <Typography gutterBottom>Iterations ({iterations})</Typography>
        <Slider
          value={iterations}
          min={1}
          max={maxIterations}
          onChange={(e, value) => setIterations(value as number)}
          onChangeCommitted={onChangeIterations}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box>
        <Typography gutterBottom>Individuals ({population})</Typography>
        <Slider
          value={population}
          min={1}
          max={maxPopulation}
          onChange={(e, value) => setPopulation(value as number)}
          onChangeCommitted={onChangePopulation}
          valueLabelDisplay="auto"
        />
      </Box>
    </Stack>
  );
};

export default EvolutionarySettings;
