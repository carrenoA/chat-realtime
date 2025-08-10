import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div style={{ flex: 1, padding: 10, overflowY: 'auto', borderBottom: '1px solid #ccc' }}>
      {messages.map((msg, idx) => (
        <div key={idx} style={{ marginBottom: 5 }}>
          <strong>{msg.from || 'Yo'}:</strong> {msg.message}
          {msg.timestamp && (
            <span style={{ fontSize: '0.75em', color: '#666', marginLeft: 8 }}>
              {new Date(msg.timestamp).toLocaleString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
