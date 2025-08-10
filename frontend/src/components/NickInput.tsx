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
    <div>
      <h3>Ingresa tu nick</h3>
      <input value={nick} onChange={e => setNick(e.target.value)} />
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  );
}
