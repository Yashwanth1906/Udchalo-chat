import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Send, ArrowLeft } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ChatSelector from './ChatSelector';

interface Message {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface GroupMessage extends Message {
  isAnnouncement?: boolean;
}

const ChatRoom: React.FC = () => {
  const { flightName = "Indigo", flightId = "001", type = "individual" } = 
    useLocalSearchParams<{ flightName?: string; flightId?: string; type?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [username] = useState("User_" + Math.random().toString(36).substr(2, 9));

  // Mock group messages if type is group
  useEffect(() => {
    if (type === 'group') {
      setMessages([
        {
          id: '1',
          sender: 'Flight Crew',
          text: "Welcome aboard! We'll be taking off shortly.",
          isUser: false,
          timestamp: new Date(),
        },
        {
          id: '2',
          sender: 'John Doe',
          text: 'Anyone interested in sharing a cab from the airport?',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [type]);

  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:3000?room=${flightId}&username=${username}`);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      websocket.send(JSON.stringify({
        type: "join",
        room: flightId,
        username: username
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'message':
          setMessages(prev => [...prev, {
            id: data.messageId,
            sender: data.username,
            text: data.content,
            isUser: data.username === username,
            timestamp: new Date(data.timestamp)
          }]);
          break;
          
        case 'history':
          const history = JSON.parse(data.content || '[]').map((msg: any) => ({
            id: msg.messageId,
            sender: msg.username,
            text: msg.content,
            isUser: msg.username === username,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(history);
          break;

        case 'announcement':
          setMessages(prev => [...prev, {
            id: data.messageId,
            sender: 'Announcement',
            text: data.content,
            isUser: false,
            timestamp: new Date(data.timestamp)
          }]);
          break;
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [flightId, username]);

  const sendMessage = useCallback(() => {
    if (inputText.trim() && ws) {
      // Optimistic update
      const tempMessage = {
        id: Date.now().toString(),
        sender: username,
        text: inputText,
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, tempMessage]);
      
      ws.send(JSON.stringify({
        type: "message",
        room: flightId,
        content: inputText
      }));

      setInputText("");
    }
  }, [inputText, ws, flightId, username]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {type === 'group' ? 'Flight Group' : 'Individual Chat'}
          </Text>
          <Text style={styles.headerSubtitle}>{flightName} • {flightId}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.otherMessage,
              message.sender === 'Announcement' && styles.announcementMessage
            ]}
          >
            {message.sender !== 'Announcement' && (
              <Text style={styles.sender}>{message.sender}</Text>
            )}
            <Text style={[
              styles.messageText,
              message.isUser && styles.userMessageText,
              message.sender === 'Announcement' && styles.announcementText
            ]}>
              {message.text}
            </Text>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#6B7280"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#3B82F6",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: {
    marginLeft: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    marginBottom: 80,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: "85%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3B82F6",
    borderTopRightRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderTopLeftRadius: 4,
  },
  announcementMessage: {
    alignSelf: "center",
    backgroundColor: "#FEF3C7",
    width: "90%",
    borderRadius: 12,
  },
  sender: {
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: "white",
  },
  announcementText: {
    color: "#92400E",
    fontWeight: "500",
    textAlign: "center",
  },
  timestamp: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ChatRoom;