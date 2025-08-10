import { useEffect } from "react";

interface ToastProps {
  message: { text: string; fromUser: string } | null;
  onClick: () => void;
  onClose: () => void;
  duration?: number; // Opcional, en ms
}

export function Toast({
  message,
  onClick,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#222",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 8,
        cursor: "pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        userSelect: "none",
        zIndex: 9999,
        maxWidth: "90%",
        textAlign: "center",
      }}
      role="alert"
      aria-live="assertive"
    >
      {message.text}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          marginLeft: 12,
          background: "transparent",
          border: "none",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}
