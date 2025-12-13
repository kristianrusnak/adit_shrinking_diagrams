import { useAuth } from "@/context/AuthProvider";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAVBAR_HEIGHT, textFieldStyles } from "@/utils/layoutStyles";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";


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
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          textAlign="center"
          sx={{ color: "white", fontSize: 14 }}>
          Already have an account? Login
        </Link>
        {errorMsg && (
          <Typography color="error" fontSize={14} textAlign="center">
            {errorMsg}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
