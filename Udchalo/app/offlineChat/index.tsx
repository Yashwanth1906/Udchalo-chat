// import React, { useEffect, useState } from "react";
// import { 
//   View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert 
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { io, Socket } from "socket.io-client";
// import axios from "axios";
// import NetInfo from "@react-native-community/netinfo";
// import trie from "../utils/trie";
// import { BACKEND_URL } from "@/config";
// import { v4 as uuidv4 } from "uuid";

// const SERVER_URL = "http://192.168.205.9:2000";

// type Message = {
//   id: string;
//   username: string;
//   userId: number;
//   content: string;
//   timestamp: string;
//   room: number;
// };

// const ChatScreen = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState("");
//   const [username, setUsername] = useState("");
//   const [userId, setUserId] = useState(1);
//   const [isConnected, setIsConnected] = useState(false);
//   const room = "chatroom1";

//   useEffect(() => {
//     const initUsername = async () => {
//       let storedUsername = await AsyncStorage.getItem("username");
//       if (!storedUsername) {
//         storedUsername = "User" + Math.floor(Math.random() * 1000);
//         await AsyncStorage.setItem("username", storedUsername);
//       }
//       setUsername(storedUsername);
//     };

//     const initUserId = async () => {
//       let storedUserId = await AsyncStorage.getItem("userId");
//       if (storedUserId) {
//         setUserId(Number(storedUserId));
//       }
//     };

//     const loadMessages = async () => {
//       const storedMessages = await AsyncStorage.getItem("messages");
//       if (storedMessages) {
//         setMessages(JSON.parse(storedMessages));
//       }
//     };

//     const checkInternetConnection = () => {
//       NetInfo.addEventListener((state) => {
//         setIsConnected(state.isConnected ?? false);
//         if (state.isConnected) {
//           syncMessagesWithServer();
//         }
//       });
//     };

//     initUsername();
//     initUserId();
//     loadMessages();
//     checkInternetConnection();

//     const newSocket = io(SERVER_URL, { transports: ["websocket"] });

//     setSocket(newSocket);
//     newSocket.emit("joinRoom", room);

//     newSocket.off("chatMessage");
//     newSocket.on("chatMessage", (message: Message) => {
//       console.log("Received message:", message);
//       saveMessageLocally(message);
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const saveMessageLocally = async (message: Message) => {
//     const storedMessages = await AsyncStorage.getItem("messages");
//     const messagesArray = storedMessages ? JSON.parse(storedMessages) : [];
//     messagesArray.push(message);
//     await AsyncStorage.setItem("messages", JSON.stringify(messagesArray));
//   };

//   const syncMessagesWithServer = async () => {
//     const storedMessages = await AsyncStorage.getItem("messages");
//     if (storedMessages) {
//       const messagesArray: Message[] = JSON.parse(storedMessages);
//       console.log("Syncing messages:", messagesArray);
      
//       try {
//         const res = await axios.post(`${BACKEND_URL}/api/user/syncmessages`, { messagesArray });
//         if (res.data.success) {
//           Alert.alert("Messages successfully synced!");
//           await AsyncStorage.removeItem("messages");
//         } else {
//           Alert.alert("Failed to sync messages.");
//         }
//       } catch (error) {
//         console.error("Error syncing messages:", error);
//         Alert.alert("Error syncing messages.");
//       }
//     }
//   };

//   const sendMessage = async () => {
//     if (text.trim() === "") {
//       console.log("Empty message, not sending.");
//       return;
//     }

//     console.log("Attempting to send message:", text);

//     if (trie.search(text)) {
//       console.log("Abusive word found, blocking message.");
//       Alert.alert("Abusive word found");
//       return;
//     }

//     if (!socket) {
//       console.log("Socket not connected.");
//       Alert.alert("Connection error", "Socket is not connected.");
//       return;
//     }

//     const message: Message = {
//       id: uuidv4(),
//       username: username,
//       userId: userId,
//       content: text,
//       timestamp: new Date().toLocaleTimeString(),
//       room: 1,
//     };

//     console.log("Generated message:", message);

//     saveMessageLocally(message);
//     setMessages((prevMessages) => [...prevMessages, message]);

//     socket.emit("chatMessage", { message, room });

//     if (isConnected) {
//       console.log("Syncing messages with server...");
//       await syncMessagesWithServer();
//     } else {
//       console.log("No internet, storing message locally.");
//     }

//     setText("");
//     console.log("Message sent and input cleared.");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Chat</Text>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={[styles.message, item.username === username ? styles.myMessage : styles.otherMessage]}>
//             <Text style={styles.sender}>{item.username}</Text>
//             <Text style={styles.text}>{item.content}</Text>
//             <Text style={styles.timestamp}>{item.timestamp}</Text>
//           </View>
//         )}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={text}
//           onChangeText={setText}
//         />
//         <TouchableOpacity style={styles.button} onPress={sendMessage}>
//           <Text style={styles.buttonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

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
import { v4 as uuidv4 } from "uuid";

const SERVER_URL = "http://192.168.205.9:2000";

type Message = {
  id: string;
  username: string;
  userId: number;
  content: string;
  timestamp: string;
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

  useEffect(() => {
    const getUsername = async() =>{
      try{
        const username = await AsyncStorage.getItem("username");
        if(username) {
          setUsername(username);
        }
      } catch(e) {
          Alert.alert("Erroring fetching username")
      }
    }
    getUsername();
    const newSocket = io(SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);
    newSocket.emit("joinRoom", room);

    newSocket.on("previousMessages", (previousMessages: Message[]) => {
      setMessages(previousMessages);
    });

    newSocket.on("chatMessage", (message: Message) => {
      saveMessageLocally(message);
      setMessages((prev) => [...prev, message]);
    });

    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      if (state.isConnected) {
        syncMessagesWithServer();
      }
    });

    return () => {
      newSocket.off("chatMessage");
      newSocket.disconnect();
    };
  }, []);

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
          messagesArray,
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
      id: uuidv4(),
      username,
      userId,
      content: text,
      timestamp: new Date().toLocaleTimeString(),
      room: 1,
    };

    saveMessageLocally(message);
    setText("");
    socket.emit("chatMessage", { message, room });
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
          <View style={[styles.message, item.username === username ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.sender}>{item.username}</Text>
            <Text style={styles.text}>{item.content}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type a message..." value={text} onChangeText={setText} />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
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
});

export default ChatScreen;
