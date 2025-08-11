import { useState } from 'react';

interface NickInputProps {
  onSetNick: (payload: { nick: string }) => void; // Callback para enviar el nick al padre
}

export default function NickInput({ onSetNick }: NickInputProps) {
  const [nick, setNick] = useState(''); // Estado local para el nick

  const handleSubmit = () => {
    if (nick.trim()) onSetNick({ nick: nick.trim() });
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 16,
        backgroundColor: 'var(--bg-color)',
        padding: 20,
        transition: 'var(--transition)',
        color: 'var(--text-color)',
        fontFamily: 'var(--font-family)',
      }}
    >
      <h3
        style={{
          marginBottom: 12,
          fontWeight: '600',
          color: 'var(--text-color)',
        }}
      >
        Ingresa tu nick
      </h3>

      <input
        type="text"
        value={nick}
        onChange={(e) => setNick(e.target.value)} 
        placeholder="Tu nick aquí"
        style={{
          padding: '10px 14px',
          borderRadius: 20,
          border: '1px solid var(--button-border)',
          outline: 'none',
          fontSize: '1rem',
          width: 280,
          transition: 'border-color 0.2s ease, background-color 0.3s ease, color 0.3s ease',
          backgroundColor: 'var(--secondary-bg)',
          color: 'var(--text-color)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--button-bg)')} 
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--button-border)')} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit(); 
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: '10px 28px',
          borderRadius: 20,
          border: 'none',
          backgroundColor: 'var(--button-bg)',
          color: 'white',
          fontWeight: '600',
          cursor: nick.trim() ? 'pointer' : 'not-allowed', 
          fontSize: '1rem',
          transition: 'background-color 0.2s ease',
          userSelect: 'none',
          opacity: nick.trim() ? 1 : 0.5, 
        }}
        onMouseEnter={(e) => {
          if (nick.trim()) e.currentTarget.style.backgroundColor = 'var(--button-hover-bg)'; 
        }}
        onMouseLeave={(e) => {
          if (nick.trim()) e.currentTarget.style.backgroundColor = 'var(--button-bg)';
        }}
        disabled={!nick.trim()}
      >
        Entrar
      </button>
    </div>
  );
}
