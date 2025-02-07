import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Send, ArrowLeft } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { BACKEND_URL } from "@/config";
import trie from "../trie";

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
const getUserId = async (): Promise<number | null> => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    console.log(userId);
    return userId ? parseInt(userId, 10) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const ChatRoom: React.FC = () => {
  const [user,setUser] = useState<number | null>();
  const { colors } = useTheme();
  const { roomName = "Announcemnet", roomId = 1} = useLocalSearchParams<{ roomName?: string; roomId?: number}>();
  console.log("Room Id : " + roomId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);
  const [announcementType, setAnnouncementType] = useState("Gate Change");
  const [announcementText, setAnnouncementText] = useState("");
  const sendAnnouncement = () => {
    if (socket && announcementText.trim()) {
      const message = {
        type: "announcement",
        userId: user,
        room: roomId,
        content: `${announcementType}: ${announcementText}`,
      };
      socket.send(JSON.stringify(message));
      setShowAnnouncementPopup(false);
      setAnnouncementText("");
    }
  };
  useEffect(() => {
    if (roomName.toLowerCase() === "announcement") {
      const timer = setTimeout(() => {
        setShowAnnouncementPopup(true);
      }, 10000);
  
      return () => clearTimeout(timer);
    }
  }, [roomName]);
  useEffect(() => {
    const func = async() =>{
      const ws = new WebSocket(BACKEND_URL);
      const username = await getUsername();
      const userId = await getUserId();
      setUser(userId);
      setSocket(ws);
      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({
          type: 'join',
          room: roomId,
          username: username
        }));
      };
      ws.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        if (message.room === roomId) {
          if (message.type === 'history') {
            const historyMessages = JSON.parse(message.content || '[]');
            setMessages((prevMessages) => [
              ...prevMessages,
              ...historyMessages.map((msg: Message) => ({
                id: msg.id || `${Date.now()}`,
                username: msg.username || '',
                content: msg.content || '',
                room: msg.room || roomId,
                isUser: msg.username === username,
                timestamp: new Date(msg.timestamp || Date.now()),
              }))
            ]);
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: message.id || `${Date.now()}`,
                username: message.username || '',
                content: message.content || '',
                room: message.room || roomId,
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
  }, [roomId]);

  const sendMessage = () => {
      console.log(inputText)
    if (!inputText.trim()) return;

    if (trie.search(inputText)) {
      alert("Your message contains inappropriate words. Please remove them.");
      return;
    }

    if (socket) {
      const message = {
        type: "message",
        userId: user,
        room: roomId,
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
            {/* <Text style={styles.headerTitle}>{type === 'group' ? 'Flight Group' : 'Individual Chat'}</Text> */}
            <Text style={styles.headerSubtitle}>{roomName}</Text>
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
      {showAnnouncementPopup && (
      <View style={styles.toastContainer}>
        <Text style={styles.popupTitle}>Wanna announce something?</Text>

        <Picker
          selectedValue={announcementType}
          onValueChange={(itemValue) => setAnnouncementType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Gate Change" value="Gate Change" />
          <Picker.Item label="Delay" value="Delay" />
          <Picker.Item label="Flight Info" value="Flight Info" />
        </Picker>

        <TextInput
          style={styles.popupInput}
          placeholder="Enter announcement..."
          value={announcementText}
          onChangeText={setAnnouncementText}
        />

        <View style={styles.toastButtons}>
          <TouchableOpacity style={styles.popupButton} onPress={sendAnnouncement}>
            <Text style={styles.popupButtonText}>Announce</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.popupCancel} onPress={() => setShowAnnouncementPopup(false)}>
            <Text style={styles.popupCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures proper spacing
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3B82F6",
  },    
  toastContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    width: "40%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: "flex-end",
  }, 
  toastButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  input: {
    flex: 1,  // Ensures it expands but doesn't push the button down
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },  
  popupButton: {
    backgroundColor: "#3B82F6",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  
  popupButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  
  popupCancel: {
    backgroundColor: "#e5e5e5",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  
  popupCancelText: {
    color: "#333",
    fontWeight: "bold",
  },  
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  popupContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    width: 250,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  popupInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
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
});

export default ChatRoom;
