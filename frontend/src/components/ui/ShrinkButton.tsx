import {IconButton, InputAdornment, Tooltip} from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';

interface ShrinkButtonProps {
  position?: "start" | "end";
}

export default function ShrinkButton({ position = "end" }: ShrinkButtonProps) {
  const handleClick = () => {
    console.log("Shrink button clicked");
    // TODO: open algorithm shrink menu
  };

  return (
    <InputAdornment position={position}>
      <Tooltip title={"Shrink-diagram button"} placement="auto" arrow>
        <IconButton
          component="label"
          color="inherit"
          onClick={handleClick}
          sx={{
            width: 36,
            height: 36,
          }}
        >
          <TuneIcon />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
}
