import React from "react";
import { Button } from "@mui/material";
import {useError} from "../../context/useError.jsx";

const DummyErrorButton = () => {
  const { showError } = useError();

  const handleClick = () => {
    showError(
      "This is a simulated error for testing purposes. We will remove the button from the App as soon as there will be a real error handling case. (But now, at least you can see how it works:))",
      "Dummy Error"
    );
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleClick}
    >
      Show error
    </Button>
  );
};

export default DummyErrorButton;
