import {Box, Button, IconButton, InputAdornment, Tooltip} from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from "react-router-dom";

interface ShrinkButtonProps {
  position?: "start" | "end";
}

export default function ShrinkButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/diagrams");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
      }}
    >
      <Button
        component="label"
        color="inherit"
        variant="outlined"
        onClick={handleClick}
        sx={{
          height: "64px",
          textTransform: "none",
          borderRadius: "16px",
          color: "inherit",
          width: "200px",
          borderColor: "rgba(0, 0, 0, 0.23)",
          "&:hover": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          px: 2.5,
          // bigger font
          fontSize: "1rem",
        }}
      >
        Go to Shrink page
      </Button>
    </Box>
  );
}
