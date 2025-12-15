import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface AlgorithmOption {
  id: string;
  name: string;
  description: string;
}

interface AlgorithmSelectorProps {
  options: AlgorithmOption[];
  value: string;
  onChange: (value: string) => void;
}

export const AlgorithmSelector = ({
  options,
  value,
  onChange,
}: AlgorithmSelectorProps) => {
  const theme = useTheme();

  // const mode = theme.palette.mode;
  // console.log(mode);

  return (
    <Stack direction="row" spacing={2} justifyContent={"center"}>
      {options.map((opt) => {
        const selected = value === opt.id;

        return (
          <Card
            key={opt.id}
            sx={{
              width: 180,
              // height: 155,
              borderRadius: 3,
              border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
              boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
              transition: "0.1s",
              backgroundColor: selected
                ? theme.palette.action.selected
                : theme.palette.background.paper,
              // hover effect
              "&:hover": {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CardActionArea
              onClick={() => onChange(opt.id)}
              sx={{ height: "100%", display: "flex", alignItems: "start" }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color={selected ? theme.palette.primary.main : "white"}
                >
                  {opt.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {opt.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );
};

export default AlgorithmSelector;
