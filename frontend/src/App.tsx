import { useState, useEffect } from 'react';
import NickInput from './components/NickInput';
import UserList from './components/UserList';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { useSocket } from './hooks/useSocket';

function App() {
  const [nick, setNick] = useState<string | null>(null);
  const [nickSet, setNickSet] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const { socket, users, messages } = useSocket(nick);

  // Set nick on server
  const handleSetNick = (nickValue: string) => {
    socket.emit('setNick', nickValue);
  };

  useEffect(() => {
    socket.on('nickSet', (assignedNick: string) => {
      setNick(assignedNick);
      setNickSet(true);
      console.log(`Nick asignado: ${assignedNick}`);
    });

    socket.on('nickError', (msg: string) => {
      alert(msg);
      setNickSet(false);
      setNick(null);
    });

    return () => {
      socket.off('nickSet');
      socket.off('nickError');
    };
  }, [socket]);

  // When selectedUser changes, request messages history
  useEffect(() => {
    if (selectedUser && nick) {
      socket.emit('getMessages', { withUser: selectedUser });
    }
  }, [selectedUser, nick, socket]);

  // Send message
  const handleSendMessage = (msg: string) => {
    if (selectedUser && msg) {
      console.log(`Enviando mensaje a ${selectedUser}: ${msg}`);
      socket.emit('sendMessage', { to: selectedUser, message: msg });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: 200, borderRight: '1px solid #ccc', padding: 10 }}>
        {!nickSet ? (
          <NickInput onSetNick={handleSetNick} />
        ) : (
          <UserList users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatWindow messages={messages} />
        {nickSet && selectedUser && <MessageInput onSendMessage={handleSendMessage} />}
      </div>
    </div>
  );
}

export default App;
