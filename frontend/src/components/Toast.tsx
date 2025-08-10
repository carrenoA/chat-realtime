import { useEffect } from "react";

interface ToastProps {
  message: { text: string; fromUser: string } | null;
  onClick: () => void;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClick, onClose, duration = 3000 }: ToastProps) {
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
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={0}
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--toast-bg, #333)",
        color: "var(--toast-text, #fff)",
        padding: "14px 24px",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        cursor: "pointer",
        userSelect: "none",
        zIndex: 9999,
        maxWidth: "90%",
        maxHeight: 80,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 500,
        fontSize: "1rem",
        gap: 16,
      }}
    >
      <span style={{ flex: 1, paddingRight: 12, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
        {message.text}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Cerrar notificación"
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          fontWeight: "bold",
          fontSize: "1.5rem",
          lineHeight: 1,
          cursor: "pointer",
          padding: 0,
          userSelect: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4d4f")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
      >
        ×
      </button>
    </div>
  );
}
