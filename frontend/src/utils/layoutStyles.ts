export const NAVBAR_HEIGHT = 50;

export const textFieldStyles = {
    InputLabelProps: {
      sx: { color: "rgba(255,255,255,0.7)" },
    },
    InputProps: {
      sx: { color: "white" },
    },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "rgba(255,255,255,0.5)",
        },
        "&:hover fieldset": {
          borderColor: "white",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#90caf9",
        },
      },
    },
  };
