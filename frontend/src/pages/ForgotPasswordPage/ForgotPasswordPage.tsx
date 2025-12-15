import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { NAVBAR_HEIGHT, textFieldStyles } from "@/utils/layoutStyles";
import {
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordWithCodeMutation,
} from "@/api/dbAuthApi";
import { useNavigate } from "react-router-dom";

type Step = "email" | "code" | "reset";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();
  const [verifyResetCode, { isLoading: isVerifying }] = useVerifyResetCodeMutation();
  const [resetPasswordWithCode, { isLoading: isResetting }] = useResetPasswordWithCodeMutation();

  const handleSendCode = async () => {
    setErrorMsg("");
    setInfoMsg("");

    if (!email) {
      setErrorMsg("Email is required");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      setInfoMsg("Code generated");
      setStep("code");
    } catch (e: any) {
      setErrorMsg(e?.data?.detail || "Failed to send code");
    }
  };

  const handleVerifyCode = async () => {
    setErrorMsg("");
    setInfoMsg("");

    if (!code || code.length !== 6) {
      setErrorMsg("Enter a 6-digit code");
      return;
    }

    try {
      await verifyResetCode({ email, code }).unwrap();
      setStep("reset");
    } catch (e: any) {
      setErrorMsg(e?.data?.detail || "Invalid code");
    }
  };

  const handleResetPassword = async () => {
    setErrorMsg("");
    setInfoMsg("");

    if (!newPassword || !confirmPassword) {
      setErrorMsg("Both password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      return;
    }

    try {
      await resetPasswordWithCode({
        email,
        code,
        new_password: newPassword,
      }).unwrap();

      setInfoMsg("Password changed successfully. You can login now.");
      navigate("/login");
    } catch (e: any) {
      setErrorMsg(e?.data?.detail || "Failed to reset password");
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
      <Stack spacing={2} maxWidth={420} width="100%">
        <Typography variant="h5" color="white">
          Forgot password
        </Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step !== "email"}
          {...textFieldStyles}
        />

        {step === "email" && (
          <Button variant="contained" onClick={handleSendCode} disabled={isSending}>
            Send code
          </Button>
        )}

        {step !== "email" && (
          <>
            <TextField
              label="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              {...textFieldStyles}
            />
            {step === "code" && (
              <Button variant="contained" onClick={handleVerifyCode} disabled={isVerifying}>
                Verify code
              </Button>
            )}
          </>
        )}

        {step === "reset" && (
          <>
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
            <Button variant="contained" onClick={handleResetPassword} disabled={isResetting}>
              Change password
            </Button>
          </>
        )}

        {infoMsg && (
          <Typography fontSize={14} textAlign="center" color="gray">
            {infoMsg}
          </Typography>
        )}

        {errorMsg && (
          <Typography fontSize={14} textAlign="center" color="error">
            {errorMsg}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
