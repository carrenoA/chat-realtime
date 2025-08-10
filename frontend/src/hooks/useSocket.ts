import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Message } from '../types';
import { normalizeMessage } from '../types';

const socket = io("http://localhost:3000", { transports: ["websocket"] });

export function useSocket(nick: string | null) {
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const selectedUserRef = useRef(selectedUser);
  selectedUserRef.current = selectedUser;
  const [toastMessage, setToastMessage] = useState<{ text: string; fromUser: string } | null>(null);

  useEffect(() => {
    socket.on('usersList', (usersList: string[]) => {
      setUsers(usersList.filter(u => u !== nick));
    });

    if (!selectedUserRef.current) {
      setMessages([]);
    }

    socket.on('receiveMessage', (msg: Message) => {
      const safeMsg = normalizeMessage(msg);
      if (selectedUserRef.current && (safeMsg.from === selectedUserRef.current || safeMsg.to === selectedUserRef.current)) {
        setMessages(prev => [...prev, safeMsg]);
      } else if (safeMsg.to === nick) {
        setToastMessage({ text: `NUEVO MENSAJE de ${safeMsg.from}`, fromUser: safeMsg.from });
      }
    });

    socket.on('messageSent', (msg: Message) => {
      const safeMsg = normalizeMessage(msg);
      if (safeMsg.from === nick && safeMsg.to === selectedUserRef.current) {
        setMessages(prev => [...prev, safeMsg]);
      }
    });

    socket.on('messagesHistory', (msgs: Message[]) => {
      if (selectedUserRef.current) {
        const safeMsgs = msgs.map(normalizeMessage);
        setMessages(safeMsgs);
      }
    });

    return () => {
      socket.off('usersList');
      socket.off('receiveMessage');
      socket.off('messageSent');
      socket.off('messagesHistory');
    };
  }, [nick]);

  const sendMessage = (messageText: string) => {
    if (!nick || !selectedUserRef.current) return;
    const newMessage: Message = normalizeMessage({
      from: nick,
      to: selectedUserRef.current,
      message: messageText,
      timestamp: new Date().toISOString(),
    });
    setMessages(prev => [...prev, newMessage]);
    socket.emit('sendMessage', { to: selectedUserRef.current, message: messageText });
  };

  const handleSetSelectedUser = (user: string) => {
    setSelectedUser(user);
    setToastMessage(null);
    socket.emit('getMessages', { withUser: user });
  };

  const handleNotificationClick = () => {
    if (toastMessage) {
      handleSetSelectedUser(toastMessage.fromUser);
      setToastMessage(null);
    }
  };

  return {
    socket,
    users,
    messages,
    selectedUser,
    setSelectedUser: handleSetSelectedUser,
    sendMessage,
    toastMessage,
    setToastMessage,
    handleNotificationClick,
  };
}
