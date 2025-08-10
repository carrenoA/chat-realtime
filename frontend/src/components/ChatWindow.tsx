import { useEffect, useRef, useState, type Key } from "react";
import type { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  currentNick: string | null;
}

export default function ChatWindow({ messages, currentNick }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const MAX_CHARS = 750;

  return (
    <div
      ref={containerRef}
      className="chat-window"
      style={{
        flex: 1,
        padding: "16px",
        overflowY: "auto",
        borderBottom: "1px solid #eaeaea",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {messages.map((msg, idx) => {
        const isMine = msg.from === currentNick;
        const isExpanded = expandedMessages.has(idx);
        const messageTooLong = msg.message.length > MAX_CHARS;

        const displayText =
          !isExpanded && messageTooLong
            ? msg.message.slice(0, MAX_CHARS) + "..."
            : msg.message;

        return (
          <div
            key={idx}
            className={`message ${isMine ? "mine" : "other"}`}
            style={{
              alignSelf: isMine ? "flex-end" : "flex-start",
              color: "var(--text-color)",
              padding: "8px 12px",
              borderRadius: "16px",
              maxWidth: "70%",
              boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              backgroundColor: isMine
                ? "var(--bg-msg-mine)"
                : "var(--bg-msg-other)",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: 4 }}>
              {isMine ? "Yo" : msg.from || "Anon"}
            </div>

            <div>{displayText}</div>

            {!isExpanded && messageTooLong && (
              <button
                onClick={() => {
                  setExpandedMessages((prev) => new Set(prev).add(idx));
                }}
                style={{
                  marginTop: 6,
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "0.85em",
                  userSelect: "none",
                }}
              >
                Leer más
              </button>
            )}

            {/* resto de archivos y audio igual */}
            {msg.files && msg.files.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {msg.files.map(
                  (
                    file: { type: string; url: string | undefined },
                    i: Key | null | undefined
                  ) => {
                    if (file.type.startsWith("image/")) {
                      return (
                        <img
                          key={i}
                          src={file.url}
                          alt="imagen enviada"
                          style={{
                            maxWidth: 150,
                            maxHeight: 150,
                            borderRadius: 8,
                            objectFit: "cover",
                          }}
                        />
                      );
                    }
                    if (file.type.startsWith("audio/")) {
                      return (
                        <audio
                          key={i}
                          controls
                          src={file.url}
                          style={{ maxWidth: 150, borderRadius: 8 }}
                        />
                      );
                    }
                    return (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#007bff",
                          textDecoration: "underline",
                        }}
                      >
                        Descargar archivo
                      </a>
                    );
                  }
                )}
              </div>
            )}

            {msg.audioUrl &&
              !msg.files?.some((f: { type: string }) =>
                f.type.startsWith("audio/")
              ) && (
                <audio
                  controls
                  src={msg.audioUrl}
                  style={{ marginTop: 8, maxWidth: 150, borderRadius: 8 }}
                />
              )}

            {msg.timestamp && (
              <div
                style={{
                  fontSize: "0.65em",
                  color: "#999",
                  marginTop: 4,
                  textAlign: "right",
                  userSelect: "none",
                }}
              >
                {new Date(msg.timestamp).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
