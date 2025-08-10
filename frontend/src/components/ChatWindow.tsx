import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/types";

interface ChatWindowProps {
  messages: Message[];
  currentNick: string | null;
}

export default function ChatWindow({ messages, currentNick }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
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
        borderBottom: "1px solid var(--button-border)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        backgroundColor: "var(--secondary-bg)",
        transition: "var(--transition)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
              color: isMine
                ? "var(--text-msg-mine)"
                : "var(--text-msg-other)",
              padding: "14px 20px",
              borderRadius: "var(--border-radius)",
              maxWidth: "70%",
              boxShadow: "var(--shadow-secondary)",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              backgroundColor: isMine
                ? "var(--bg-msg-mine)"
                : "var(--bg-msg-other)",
              fontSize: "1rem",
              transition: "var(--transition)",
              cursor: messageTooLong && !isExpanded ? "pointer" : "default",
              userSelect: "text",
            }}
            onClick={() => {
              if (messageTooLong && !isExpanded) {
                setExpandedMessages((prev) => new Set(prev).add(idx));
              }
            }}
            title={messageTooLong && !isExpanded ? "Click para expandir" : undefined}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 6,
                userSelect: "none",
                opacity: 0.8,
              }}
            >
              {isMine ? "Yo" : msg.from || "Anon"}
            </div>

            <div>{displayText}</div>

            {messageTooLong && !isExpanded && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: "0.85rem",
                  color: "var(--button-bg)",
                  fontWeight: 600,
                  opacity: 0.75,
                  userSelect: "none",
                }}
              >
                (Haz click para leer más...)
              </div>
            )}

            {msg.timestamp && (
              <div
                style={{
                  fontSize: "0.65rem",
                  color: isMine ? "var(--text-msg-mine)" : "var(--text-msg-other)",
                  marginTop: 10,
                  textAlign: "right",
                  userSelect: "none",
                  opacity: 0.6,
                  fontStyle: "italic",
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
