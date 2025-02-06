import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Send, ArrowLeft } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import BottomNav from '../components/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from "@/config";

interface Message {
  id: string;
  username: string;
  content: string;
  room: number;
  timestamp: string | Date;
  isUser: boolean;
  type : string;
}

const getUsername = async () => {
  try {
    const username = await AsyncStorage.getItem('username');
    if (username !== null) {
      console.log('Retrieved username:', username);
      return username;
    }
  } catch (error) {
    console.error('Error retrieving username from AsyncStorage:', error);
  }
};


const ChatRoom: React.FC = () => {
  const [user,setUser] = useState<number | null>(1);
  const { colors } = useTheme();
  const { flightName = "Indigo", flightId = 1, type = "individual" } = useLocalSearchParams<{ flightName?: string; flightId?: string; type?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const func = async() =>{
      const ws = new WebSocket(BACKEND_URL);
      const username = await getUsername();
      setSocket(ws);
      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({
          type: 'join',
          room: flightId,
          username: username
        }));
      };
      ws.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        if (message.room === flightId) {
          if (message.type === 'history') {
            // If the message is history, prepopulate chat with all previous messages
            const historyMessages = JSON.parse(message.content || '[]');
            setMessages((prevMessages) => [
              ...prevMessages,
              ...historyMessages.map((msg: Message) => ({
                id: msg.id || `${Date.now()}`,
                username: msg.username || '',
                content: msg.content || '',
                room: msg.room || flightId,
                isUser: msg.username === username,
                timestamp: new Date(msg.timestamp || Date.now()),
              }))
            ]);
          } else {
            // Handle regular messages
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: message.id || `${Date.now()}`,
                username: message.username || '',
                content: message.content || '',
                room: message.room || flightId,
                isUser: message.username === username,
                timestamp: new Date(message.timestamp || Date.now()),
                type : message.type
              }
            ]);
          }
        }
      };
  

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        ws.close();
      };
    }
    func();
  }, [flightId]);

  const sendMessage = () => {
    if (socket && inputText.trim()) {
      const message = {
        type: 'message',
        userId : user,
        room: flightId,
        content: inputText,
      };
      socket.send(JSON.stringify(message));
      setInputText("");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{type === 'group' ? 'Flight Group' : 'Individual Chat'}</Text>
            <Text style={styles.headerSubtitle}>{flightName} • {flightId}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.isUser ? styles.userMessage : styles.otherMessage]}
          >
            {message.isUser ? (
              <>
                <Text style={styles.username}>{message.username}</Text>
                <Text style={[styles.messageText, message.isUser && styles.userMessageText]}>{message.content}</Text>
                <Text style={[styles.timestamp, message.isUser && styles.userTimestamp]}>
                  {message.timestamp.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.sender}>{message.username}</Text>
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.timestamp}>
                  {message.timestamp.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: inputText.trim() ? colors.primary : colors.textSecondary }]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    padding: 12,
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
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "white",
    marginBottom: 4,
    textAlign: 'right',
  },
  sender: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1F2937",
  },
  userMessageText: {
    color: "white",
  },
  timestamp: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 80,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatRoom;
