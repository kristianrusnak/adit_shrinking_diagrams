import { useContext } from "react";
import {ErrorContext} from "./ErrorContext.jsx"; // make sure ErrorContext is exported

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useError must be used within ErrorProvider");
  return ctx;
};
