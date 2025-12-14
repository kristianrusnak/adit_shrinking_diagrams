import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { useState } from "react";
import { NAVBAR_HEIGHT, textFieldStyles } from "@/utils/layoutStyles";
import { useChangePasswordMutation } from "@/api/api";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long");
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();
      setSuccessMsg("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      setErrorMsg(e?.data?.detail || "Failed to change password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Stack spacing={2} maxWidth={400} width="100%">
        <Typography variant="h5" color="white">
          Change password
        </Typography>
        <TextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          {...textFieldStyles}
        />
        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          {...textFieldStyles}
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          {...textFieldStyles}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}>
          Change password
        </Button>
        {errorMsg && (
          <Typography color="error" fontSize={14} textAlign="center">
            {errorMsg}
          </Typography>
        )}
        {successMsg && (
          <Typography color="success.main" fontSize={14} textAlign="center">
            {successMsg}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
