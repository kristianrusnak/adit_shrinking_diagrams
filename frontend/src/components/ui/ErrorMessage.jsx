import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, Box, Button, Stack } from "@mui/material";

/**
 * ErrorMessage component
 *
 * @param {Object} props
 * @param {string} props.text - The main error message to display.
 * @param {string} [props.title="An error occurred"] - The title of the error alert.
 * @param {boolean} [props.open] - Controls whether the alert is visible.
 * @param {function} [props.onClose] - Callback when user clicks "OK".
 */
const ErrorMessage = ({ text, title = "An error occurred", open = true, onClose }) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  if (!visible || !text) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1300,
        width: "100%",
        maxWidth: 400,
        px: 2,
      }}
    >
      <Alert
        severity="error"
        variant="filled"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 2,
        }}
      >
        <Stack spacing={1} sx={{ width: "100%" }}>
          <AlertTitle>{title}</AlertTitle>
          <div>{text}</div>
          <Button
            component="label"
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
                alignSelf: "center",
                mt: 1
            }}
            onClick={handleClose}
          >
            OK
          </Button>
        </Stack>
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
