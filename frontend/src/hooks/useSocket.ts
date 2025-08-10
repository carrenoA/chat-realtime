import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Message } from '../types';

const socket = io("http://localhost:3000", { transports: ["websocket"] });

export function useSocket(nick: string | null) {
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');

  useEffect(() => {
    socket.on('usersList', (usersList: string[]) => {
      setUsers(usersList.filter(u => u !== nick));
    });

    setMessages([]);

    socket.on('receiveMessage', (msg: Message) => {
      if (msg.from === selectedUser || msg.to === selectedUser) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on('messageSent', (msg: Message) => {
      if (msg.from === nick && msg.to === selectedUser) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on('messagesHistory', (msgs: Message[]) => {
      setMessages(msgs);
    });

    return () => {
      socket.off('usersList');
      socket.off('receiveMessage');
      socket.off('messageSent');
      socket.off('messagesHistory');
    };
  }, [nick, selectedUser]);

  const sendMessage = (messageText: string) => {
    if (!nick || !selectedUser) return;

    const newMessage: Message = {
      from: nick,
      to: selectedUser,
      message: messageText,
      timestamp: Date.now(), 
    };

    setMessages(prev => [...prev, newMessage]);
    socket.emit('sendMessage', { to: selectedUser, message: messageText });
  };

  return { socket, users, messages, selectedUser, setSelectedUser, sendMessage };
}
