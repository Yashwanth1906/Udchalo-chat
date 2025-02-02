import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Send } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";

interface Message {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatRoom: React.FC = () => {
  const { flightName = "Indigo", flightId = "001" } = useLocalSearchParams<{ flightName?: string; flightId?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [username] = useState("User_" + Math.random().toString(36).substr(2, 9));

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
      <Text style={styles.roomTitle}>{flightName} ({flightId})</Text>

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
    backgroundColor: "white",
    padding: 16,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#1F2937",
  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2563EB",
    marginLeft: "20%",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB",
    marginRight: "20%",
  },
  announcementMessage: {
    alignSelf: "center",
    backgroundColor: "#FBBF24",
    width: "100%",
    alignItems: "center",
  },
  sender: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
    fontSize: 12,
  },
  messageText: {
    color: "#1F2937",
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "white",
  },
  announcementText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  timestamp: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});

export default ChatRoom;