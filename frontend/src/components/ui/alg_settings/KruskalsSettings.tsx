import { Stack, TextField, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAlgorithmSettings } from "@/store/slices/algorithmSlice";

interface KruskalsWeights {
  dependency: number;
  extension: number;
  implementation: number;
  aggregation: number;
  composition: number;
  association: number;
}

interface KruskalsSettingsProps {
  weights?: KruskalsWeights;
}

export const KruskalsSettings = ({ weights }: KruskalsSettingsProps) => {
  const [localWeights, setLocalWeights] = useState<KruskalsWeights>(
    weights || ({} as KruskalsWeights),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!weights) {
      return;
    }

    setLocalWeights(weights);
    dispatch(
      setAlgorithmSettings({
        algorithmId: "kruskals",
        settings: { weights },
      }),
    );
  }, [dispatch, weights]);

  const updateField = (field: keyof KruskalsWeights, value: string) => {
    const nextWeights = {
      ...localWeights,
      [field]: Number(value),
    };

    setLocalWeights(nextWeights);
    dispatch(
      setAlgorithmSettings({
        algorithmId: "kruskals",
        settings: { weights: nextWeights },
      }),
    );
  };

  return (
    <Stack spacing={3} sx={{ width: 320, p: 2 }}>
      <Box>
        <Typography gutterBottom variant="h6">
          Edge weights
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tune how strongly each relationship type influences Kruskal&apos;s
          edge selection.
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Dependency"
          type="number"
          size="small"
          fullWidth
          value={localWeights.dependency ?? ""}
          onChange={(event) => updateField("dependency", event.target.value)}
        />
        <TextField
          label="Association"
          type="number"
          size="small"
          fullWidth
          value={localWeights.association ?? ""}
          onChange={(event) => updateField("association", event.target.value)}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Aggregation"
          type="number"
          size="small"
          fullWidth
          value={localWeights.aggregation ?? ""}
          onChange={(event) => updateField("aggregation", event.target.value)}
        />
        <TextField
          label="Composition"
          type="number"
          size="small"
          fullWidth
          value={localWeights.composition ?? ""}
          onChange={(event) => updateField("composition", event.target.value)}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Extension"
          type="number"
          size="small"
          fullWidth
          value={localWeights.extension ?? ""}
          onChange={(event) => updateField("extension", event.target.value)}
        />
        <TextField
          label="Implementation"
          type="number"
          size="small"
          fullWidth
          value={localWeights.implementation ?? ""}
          onChange={(event) =>
            updateField("implementation", event.target.value)
          }
        />
      </Stack>
    </Stack>
  );
};

export default KruskalsSettings;
