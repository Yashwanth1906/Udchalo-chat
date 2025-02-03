import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Send, ArrowLeft } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { BottomNav } from '../components/BottomNav';

interface Message {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Initial mock messages
const INITIAL_GROUP_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Flight Crew',
    text: "Welcome aboard! Flight DEL-BOM AI101 is scheduled for on-time departure.",
    isUser: false,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    sender: 'John Doe',
    text: 'Anyone interested in sharing a cab from Mumbai Airport?',
    isUser: false,
    timestamp: new Date(Date.now() - 1800000),
  },
];

const INITIAL_INDIVIDUAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Co-Passenger',
    text: "Hi! Are you also on the DEL-BOM flight?",
    isUser: false,
    timestamp: new Date(Date.now() - 1800000),
  },
];

const ChatRoom: React.FC = () => {
  const { colors } = useTheme();
  const { flightName = "Indigo", flightId = "001", type = "individual" } = 
    useLocalSearchParams<{ flightName?: string; flightId?: string; type?: string }>();
  
  const [messages, setMessages] = useState<Message[]>(
    type === 'group' ? INITIAL_GROUP_MESSAGES : INITIAL_INDIVIDUAL_MESSAGES
  );
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText("");

      // Simulate response after a delay
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const responses = type === 'group' 
            ? [
                "Thanks for sharing!",
                "Good to know!",
                "I'll keep that in mind.",
                "See you at the airport!",
                "Safe travels everyone!"
              ]
            : [
                "Yes, I am! Looking forward to the flight.",
                "Which seat are you in?",
                "Have you checked in yet?",
                "Is this your first time flying this route?",
                "Do you travel frequently on this route?"
              ];

          const responseMessage: Message = {
            id: Date.now().toString(),
            sender: type === 'group' ? 'Random Passenger' : 'Co-Passenger',
            text: responses[Math.floor(Math.random() * responses.length)],
            isUser: false,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, responseMessage]);
        }, 1000 + Math.random() * 2000);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {type === 'group' ? 'Flight Group' : 'Individual Chat'}
            </Text>
            <Text style={styles.headerSubtitle}>{flightName} • {flightId}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.otherMessage,
            ]}
          >
            {!message.isUser && (
              <Text style={styles.sender}>{message.sender}</Text>
            )}
            <Text style={[
              styles.messageText,
              message.isUser && styles.userMessageText
            ]}>
              {message.text}
            </Text>
            <Text style={[
              styles.timestamp,
              message.isUser && styles.userTimestamp
            ]}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.background,
            color: colors.text
          }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { 
            backgroundColor: inputText.trim() ? colors.primary : colors.textSecondary 
          }]}
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