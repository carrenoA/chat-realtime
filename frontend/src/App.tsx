import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Message {
  from?: string;
  to?: string;
  message: string;
  timestamp?: string | Date;
}

const socket = io("http://localhost:3000", {
  transports: ["websocket"]
});




function App() {
  const [nick, setNick] = useState('');
  const [nickSet, setNickSet] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  const handleSetNick = () => {
    if (nick.trim() !== '') {
      socket.emit('setNick', nick);
    }
  };

  useEffect(() => {
    socket.on('nickSet', (nick: string) => {
      setNickSet(true);
      console.log(`Nick asignado: ${nick}`);
    });

    socket.on('nickError', (msg: string) => {
      alert(msg);
    });

    socket.on('usersList', (users: string[]) => {
      setUsers(users.filter((u) => u !== nick));
    });

    socket.on('receiveMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('messageSent', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('messagesHistory', (msgs: Message[]) => {
      setMessages(msgs);
    });

    return () => {
      socket.off('nickSet');
      socket.off('nickError');
      socket.off('usersList');
      socket.off('receiveMessage');
      socket.off('messageSent');
      socket.off('messagesHistory');
    };
  }, [nick]);

  useEffect(() => {
    if (selectedUser) {
      socket.emit('getMessages', { withUser: selectedUser });
    }
  }, [selectedUser]);

 const handleSendMessage = () => {
  if (message.trim() && selectedUser ) {
    console.log(`Enviando mensaje a ${selectedUser }: ${message}`); // Agrega este log
    socket.emit('sendMessage', { to: selectedUser , message });
    setMessage('');
  }
};

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Panel lateral */}
      <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
        {!nickSet ? (
          <>
            <h3>Ingresa tu nick</h3>
            <input value={nick} onChange={(e) => setNick(e.target.value)} />
            <button onClick={handleSetNick}>Entrar</button>
          </>
        ) : (
          <>
            <h3>Usuarios conectados</h3>
            <ul>
              {users.map((user) => (
                <li
                  key={user}
                  style={{ cursor: 'pointer', color: selectedUser === user ? 'blue' : 'black' }}
                  onClick={() => setSelectedUser(user)}
                >
                  {user}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Ventana de chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '10px', overflowY: 'auto', borderBottom: '1px solid #ccc' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '5px' }}>
              <strong>{msg.from || 'Yo'}:</strong> {msg.message}
            </div>
          ))}
        </div>
        {nickSet && selectedUser && (
          <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
            <input
              style={{ flex: 1 }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
