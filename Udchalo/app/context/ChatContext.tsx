import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_MESSAGES, MOCK_USERS, moderateMessage } from '../utils/mockData';

interface ChatContextType {
  messages: any[];
  sendMessage: (text: string, flightId: string, nickname: string) => void;
  blockUser: (userId: string) => void;
  reportMessage: (messageId: string) => void;
  offlineMessages: any[];
  syncOfflineMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [offlineMessages, setOfflineMessages] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const sendMessage = (text: string, flightId: string, nickname: string) => {
    const moderation = moderateMessage(text);
    if (!moderation.isValid) {
      alert(moderation.reason);
      return;
    }

    const newMessage = {
      id: `M${Date.now()}`,
      flightId,
      userId: 'U1', // Hardcoded for demo
      nickname,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      isOffline: !navigator.onLine,
    };

    if (!navigator.onLine) {
      setOfflineMessages(prev => [...prev, newMessage]);
    } else {
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const blockUser = (userId: string) => {
    setBlockedUsers(prev => [...prev, userId]);
  };

  const reportMessage = (messageId: string) => {
    alert('Message reported successfully');
  };

  const syncOfflineMessages = () => {
    setMessages(prev => [...prev, ...offlineMessages]);
    setOfflineMessages([]);
  };

  useEffect(() => {
    window.addEventListener('online', syncOfflineMessages);
    return () => window.removeEventListener('online', syncOfflineMessages);
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      blockUser,
      reportMessage,
      offlineMessages,
      syncOfflineMessages,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}; 