import { useMemo, useState } from "react";
import {
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
  Card,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { setAlgorithmSettings } from "@/store/slices/algorithmSlice";

const AVAILABLE_STEPS = [
  { id: "remove_random_classes", label: "Remove random classes" },
  { id: "remove_empty_classes", label: "Remove empty classes" },
  { id: "remove_isolated_classes", label: "Remove isolated classes" },
  { id: "remove_leaf_classes", label: "Remove leaf classes" },
  { id: "remove_low_degree_classes", label: "Remove low degree classes" },
  { id: "remove_random_methods", label: "Remove random methods" },
  { id: "remove_getters_and_setters", label: "Remove getters and setters" },
  { id: "remove_public_methods", label: "Remove public methods" },
  { id: "remove_private_methods", label: "Remove private methods" },
  { id: "remove_protected_methods", label: "Remove protected methods" },
  { id: "remove_package_methods", label: "Remove package methods" },
  { id: "remove_random_edges", label: "Remove random edges" },
  { id: "remove_random_attributes", label: "Remove random attributes" },
  { id: "remove_public_attributes", label: "Remove public attributes" },
  { id: "remove_private_attributes", label: "Remove private attributes" },
  { id: "remove_protected_attributes", label: "Remove protected attributes" },
  { id: "remove_package_attributes", label: "Remove package attributes" },
];

export const PreprocessingSettings = () => {
  const [preprocessingSteps, setPreprocessingSteps] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const menuOpen = Boolean(anchorEl);

  const stepLabelMap = useMemo(
    () =>
      Object.fromEntries(
        AVAILABLE_STEPS.map((step) => [step.id, step.label]),
      ) as Record<string, string>,
    [],
  );

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const updatePreprocessingSteps = (nextSteps: string[]) => {
    setPreprocessingSteps(nextSteps);
    dispatch(
      setAlgorithmSettings({
        algorithmId: "preprocessing",
        settings: {
          steps: nextSteps,
        },
      }),
    );
  };

  const addPreprocessingStep = (stepId: string) => {
    if (preprocessingSteps.includes(stepId)) {
      closeMenu();
      return;
    }

    const nextSteps = [...preprocessingSteps, stepId];
    updatePreprocessingSteps(nextSteps);
    closeMenu();
  };

  const removePreprocessingStep = (indexToRemove: number) => {
    const nextSteps = preprocessingSteps.filter(
      (_, index) => index !== indexToRemove,
    );
    updatePreprocessingSteps(nextSteps);
  };

  return (
    <Card
      sx={(theme) => ({
        padding: 3,
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: 5,
      })}
    >
      <Stack direction="column" spacing={1}>
        <Typography variant="h6">Preprocessing steps</Typography>

        <List dense={false} sx={{ mt: 0, pt: 0 }}>
          {preprocessingSteps.map((stepId, i) => (
            <ListItem
              key={`${stepId}-${i}`}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => removePreprocessingStep(i)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={stepLabelMap[stepId] ?? stepId} />
            </ListItem>
          ))}
        </List>

        <Button variant="outlined" onClick={openMenu}>
          Add preprocessing step
        </Button>

        <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
          {AVAILABLE_STEPS.map((step) => (
            <MenuItem
              key={step.id}
              onClick={() => addPreprocessingStep(step.id)}
            >
              {step.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Card>
  );
};

export default PreprocessingSettings;
