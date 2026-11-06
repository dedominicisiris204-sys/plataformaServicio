import { useContext } from "react";
import { ToastContext } from "../context/toastContext";

export function useToast() {
  const context = useContext(ToastContext);
  if (context) return context;
  return {
    success: (message) => console.log("[SUCCESS]", message),
    error: (message) => console.error("[ERROR]", message),
    warning: (message) => console.warn("[WARN]", message),
    info: (message) => console.info("[INFO]", message)
  };
}
