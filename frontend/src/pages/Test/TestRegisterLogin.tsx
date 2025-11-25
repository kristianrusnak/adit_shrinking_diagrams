import { useAuth } from "@/context/AuthProvider";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// this is just an example that doesnt sanitize or check the inputs
// maybe libraries like formik/yup could be used for forms/data validation
const TestRegisterLogin = () => {
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const navigate = useNavigate();

  const { register, isRegistering, login, isLoggingIn, logout, userInfo } =
    useAuth();

  const handleRegister = async () => {
    const response = await register(emailRegister, passwordRegister);
    navigate("/testauth"); // handle redirects
    console.log(response);
  };

  const handleLogin = async () => {
    const response = await login(emailLogin, passwordLogin);
    navigate("/testauth");
    console.log(response);
  };

  const handleLogout = async () => {
    const response = await logout();
    navigate("/"); // redirect to landing page

    console.log(response);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        width="100vw"
        direction="row"
        justifyContent="space-evenly"
      >
        <Stack spacing={2} direction="column">
          <Typography variant="h5">Register</Typography>
          <TextField
            label="Email"
            variant="outlined"
            value={emailRegister}
            onChange={(e) => setEmailRegister(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            value={passwordRegister}
            onChange={(e) => setPasswordRegister(e.target.value)}
            type="password"
          />
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={isRegistering}
          >
            Register
          </Button>
        </Stack>

        <Stack spacing={2} direction="column">
          <Typography variant="h5">Login</Typography>
          <TextField
            label="Email"
            variant="outlined"
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            type="password"
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            Login
          </Button>
        </Stack>
      </Stack>
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
      <Typography variant="h6">
        Currently logged in: {userInfo?.email}
      </Typography>
    </Box>
  );
};

export default TestRegisterLogin;
