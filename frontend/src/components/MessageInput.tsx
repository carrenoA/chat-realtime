import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (msg: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 10, display: 'flex', gap: 10 }}>
      <input
        style={{ flex: 1 }}
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
