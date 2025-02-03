import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState } from 'react-native'; // Import AppState
import MOCK_DATA from '../utils/mockData';

const { MOCK_MESSAGES, moderateMessage } = MOCK_DATA;

interface ChatContextType {
  messages: any[];
  sendMessage: (text: string, flightId: string, nickname: string) => void;
  blockUser: (userId: string) => void;
  reportMessage: (messageId: string) => void;
  offlineMessages: any[];
  syncOfflineMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES);
  const [offlineMessages, setOfflineMessages] = useState<any[]>([]);
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
    if (offlineMessages.length > 0) {
      setMessages(prev => [...prev, ...offlineMessages]);
      setOfflineMessages([]);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        syncOfflineMessages();
      }
    };

    // Use AppState to monitor app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Clean up the event listener
      appStateSubscription.remove();
    };
  }, [offlineMessages]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, blockUser, reportMessage, offlineMessages, syncOfflineMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
