import { useState, useCallback, useMemo } from "react";
import { ToastContext } from "./toastContext";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((mensaje, tipo = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    warning: (msg) => addToast(msg, "warning"),
    info: (msg) => addToast(msg, "info")
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="toast-container"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none"
        }}
      >
        {toasts.map((t) => {
          const bg =
            t.tipo === "success"
              ? "#16a34a"
              : t.tipo === "error"
              ? "#dc2626"
              : t.tipo === "warning"
              ? "#d97706"
              : "#0284c7";
          const icon =
            t.tipo === "success"
              ? "✓"
              : t.tipo === "error"
              ? "✕"
              : t.tipo === "warning"
              ? "⚠"
              : "ℹ";

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: "auto",
                background: bg,
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: "500",
                minWidth: "260px",
                maxWidth: "420px"
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>{icon}</span>
              <span style={{ flex: 1, wordBreak: "break-word" }}>{t.mensaje}</span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "0 4px"
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

