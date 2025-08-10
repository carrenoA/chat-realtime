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
    <div
      style={{
        padding: 12,
        display: 'flex',
        gap: 12,
        borderTop: '1px solid #ddd',
        backgroundColor: 'var(--bg-input-area)',
      }}
    >
      <input
        style={{
          flex: 1,
          padding: '10px 14px',
          borderRadius: 20,
          border: '1px solid #ccc',
          outline: 'none',
          fontSize: '1rem',
          transition: 'border-color 0.2s ease',
        }}
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        onKeyDown={e => {
          if (e.key === 'Enter') handleSend();
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#007bff')}
        onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
      />
      <button
        onClick={handleSend}
        style={{
          padding: '10px 20px',
          borderRadius: 20,
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#007bff')}
        disabled={!message.trim()}
      >
        Enviar
      </button>
    </div>
  );
}
