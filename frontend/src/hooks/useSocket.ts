import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Message } from '../types';

const socket = io("http://localhost:3000", { transports: ["websocket"] });

export function useSocket(nick: string | null) {
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('usersList', (usersList: string[]) => {
      setUsers(usersList.filter(u => u !== nick));
    });

    socket.on('receiveMessage', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('messageSent', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
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
  }, [nick]);

  return { socket, users, messages, setMessages };
}
