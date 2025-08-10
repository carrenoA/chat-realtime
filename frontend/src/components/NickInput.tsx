import { useState } from 'react';

interface NickInputProps {
  onSetNick: (nick: string) => void;
}

export default function NickInput({ onSetNick }: NickInputProps) {
  const [nick, setNick] = useState('');

  const handleSubmit = () => {
    if (nick.trim()) onSetNick(nick.trim());
  };

  return (
    <div
      style={{
        height: '100vh',        
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',    
        gap: '12px',
      }}
    >
      <h3>Ingresa tu nick</h3>
      <input value={nick} onChange={e => setNick(e.target.value)} />
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  );
}
