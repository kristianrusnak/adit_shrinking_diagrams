import React, { useState, useCallback } from "react";
import { ErrorContext } from "./ErrorContext";
import ErrorMessage from "../components/ui/ErrorMessage";

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState({ open: false, text: "", title: "" });

  const showError = useCallback((text, title = "An error occurred") => {
    setError({ open: true, text, title });
  }, []);

  const closeError = useCallback(() => {
    setError(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <ErrorMessage
        open={error.open}
        text={error.text}
        title={error.title}
        onClose={closeError}
      />
    </ErrorContext.Provider>
  );
};
