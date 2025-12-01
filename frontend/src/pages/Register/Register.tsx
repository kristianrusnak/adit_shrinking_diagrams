import { useAuth } from "@/context/AuthProvider";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NAVBAR_HEIGHT = 64;

export default function RegisterPage() {
  const { register, isRegistering } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Email and password are required");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      return;
    }

    try {
      await register(email, password);
      navigate("/login");
    } catch (error: any) {
      setErrorMsg("Email is already registered");
    }
  };

  const textFieldStyles = {
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

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={2} maxWidth={400} width="100%">
        <Typography variant="h5" color="white">
          Register
        </Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          {...textFieldStyles}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          {...textFieldStyles}
        />

        <Button variant="contained" onClick={handleSubmit} disabled={isRegistering}>
          Register
        </Button>
        {errorMsg && (
          <Typography color="error" fontSize={14} textAlign="center">
            {errorMsg}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
