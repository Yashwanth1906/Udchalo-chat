import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import trie from "../utils/trie";
import { BACKEND_URL } from "@/config";
import { useTheme } from "../context/ThemeContext";
import { Send } from "lucide-react-native";

const SERVER_URL = "http://192.168.205.9:2000";

type Message = {
  id: string;
  username: string;
  userId: number;
  content: string;
  timestamp: Date;
  room: number;
};

const ChatScreen = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const room = "chatroom1";
  const { colors } = useTheme();

  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (e) {
        Alert.alert("Error fetching username");
      }
    };
    getUsername();

    const newSocket = io(SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);
    newSocket.emit("joinRoom", room);

    newSocket.on("previousMessages", (previousMessages: Message[]) => {
      setMessages(previousMessages);
    });

    newSocket.on("chatMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      const reachable = state.isInternetReachable ?? false;
      setIsConnected(reachable);
      if (reachable) {
        syncMessagesWithServer();
      }
    });

    return () => {
      newSocket.off("chatMessage");
      newSocket.disconnect();
      unsubscribe();
    };
  }, [messages]);

  const saveMessageLocally = async (message: Message) => {
    try {
      const storedMessages = await AsyncStorage.getItem("messages");
      const messagesArray = storedMessages ? JSON.parse(storedMessages) : [];
      messagesArray.push(message);
      await AsyncStorage.setItem("messages", JSON.stringify(messagesArray));
    } catch (error) {
      console.error("Error saving message locally:", error);
    }
  };

  const syncMessagesWithServer = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem("messages");
      if (storedMessages) {
        const messagesArray: Message[] = JSON.parse(storedMessages);
        console.log("Syncing messages:", messagesArray);

        const res = await axios.post(`${BACKEND_URL}/api/user/syncmessages`, {
          messages: messagesArray,
        });

        if (res.data.success) {
          Alert.alert("Messages successfully synced!");
          await AsyncStorage.removeItem("messages");
        } else {
          Alert.alert("Failed to sync messages.");
        }
      }
    } catch (error) {
      console.error("Error syncing messages:", error);
      Alert.alert("Error syncing messages.");
    }
  };

  const sendMessage = async () => {
    if (text.trim() === "") return;
    if (trie.search(text)) {
      Alert.alert("Abusive word found");
      return;
    }
    if (!socket) {
      Alert.alert("Connection error", "Socket is not connected.");
      return;
    }
    const message: Message = {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 100000)}`,
      username,
      userId,
      content: text,
      timestamp: new Date(),
      room: 1,
    };
    socket.emit("chatMessage", { message, room });
    await saveMessageLocally(message);
    setText("");
    if (isConnected) {
      await syncMessagesWithServer();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.username === username ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.sender}>{item.username}</Text>
            <Text style={styles.text}>{item.content}</Text>
          </View>
        )}
      />
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.background, color: colors.text },
          ]}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: text.trim() ? colors.primary : colors.textSecondary },
          ]}
          onPress={sendMessage}
          disabled={!text.trim()}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5 },
  button: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginLeft: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
  message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "70%" },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6", marginRight: 10 },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#EAEAEA", marginLeft: 10 },
  sender: { fontWeight: "bold", marginBottom: 3 },
  text: { fontSize: 16 },
  timestamp: { fontSize: 12, color: "gray", marginTop: 5, alignSelf: "flex-end" },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
