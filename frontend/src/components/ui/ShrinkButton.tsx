import {Box, Button, IconButton, InputAdornment, Tooltip} from "@mui/material";
import {Box, Button, IconButton, InputAdornment, Tooltip} from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from "react-router-dom";
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
        color="primary"
        variant="outlined"
        onClick={handleClick}
        sx={{
          height: "64px",
          textTransform: "none",
          borderRadius: "16px",
          width: "200px",
          px: 2.5,
          fontSize: "1rem",
        }}
      >
        Go to Shrink page
      </Button>
    </Box>
  );
}
