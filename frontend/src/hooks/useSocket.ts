import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Message } from '../types/types';
import { normalizeMessage } from '../types/types';

const socket = io("http://localhost:3000", { transports: ["websocket"] });

export function useSocket(nick: string | null) {
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const selectedUserRef = useRef(selectedUser);
  selectedUserRef.current = selectedUser;

  const [toastMessage, setToastMessage] = useState<{ text: string; fromUser: string } | null>(null);

  useEffect(() => {
    const handleUsersList = (usersList: string[]) => {
      setUsers(usersList.filter(u => u !== nick));
    };

    const handleReceiveMessage = (msg: Message) => {
      const safeMsg = normalizeMessage(msg);

      if (selectedUserRef.current && 
          (safeMsg.from === selectedUserRef.current || safeMsg.to === selectedUserRef.current)) {
        setMessages(prev => [...prev, safeMsg]);
      } else if (safeMsg.to === nick) {
        setToastMessage({ text: `NUEVO MENSAJE de ${safeMsg.from}`, fromUser: safeMsg.from });
      }
    };

    const handleMessageSent = (msg: Message) => {
      const safeMsg = normalizeMessage(msg);
      if (safeMsg.from === nick && safeMsg.to === selectedUserRef.current) {
        setMessages(prev => [...prev, safeMsg]);
      }
    };

    // Carga el historial de mensajes cuando se selecciona usuario
    const handleMessagesHistory = (msgs: Message[]) => {
      if (selectedUserRef.current) {
        const safeMsgs = msgs.map(normalizeMessage);
        setMessages(safeMsgs);
      }
    };

    socket.on('usersList', handleUsersList);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messageSent', handleMessageSent);
    socket.on('messagesHistory', handleMessagesHistory);

    return () => {
      socket.off('usersList', handleUsersList);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messageSent', handleMessageSent);
      socket.off('messagesHistory', handleMessagesHistory);
    };
  }, [nick]);

  const handleSetSelectedUser = (user: string) => {
    setSelectedUser(user);
    setMessages([]); 
    setToastMessage(null);
    socket.emit('getMessages', { withUser: user });
  };

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
