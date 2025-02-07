// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { io, Socket } from "socket.io-client";
// import trie from "../utils/trie";
// import NetInfo from "@react-native-community/netinfo";

// const SERVER_URL = "http://192.168.205.9:2000";

// type Message = {
//   id: string;
//   user: string;
//   text: string;
//   timestamp: string;
// };
// type StoreMessage = {
//   type : string;
//   userId : number,
//   content : string,
//   timestamp : string
// }
// const ChatScreen = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState("");
//   const [username, setUsername] = useState("");
//   const [isConnected, setIsConnected] = useState(null);
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

//     initUsername();

//     const newSocket = io(SERVER_URL, { transports: ["websocket"] });
//     setSocket(newSocket);

//     newSocket.emit("joinRoom", room);

//     newSocket.on("chatMessage", (message: Message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     return () => unsubscribe();
//   }, []);

//   const sendMessage = () => {
//     if (socket && text.trim() !== "") {
//       const message: Message = {
//         id: Date.now().toString(),
//         user: username,
//         text,
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       if(trie.search(text)) {
//         Alert.alert("Abusive word found");
//       }
//       else {
//         socket.emit("chatMessage", { message, room });
//         setText("");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Chat</Text>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={[styles.message, item.user === username ? styles.myMessage : styles.otherMessage]}>
//             <Text style={styles.sender}>{item.user}</Text>
//             <Text style={styles.text}>{item.text}</Text>
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

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
//   inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
//   input: { flex: 1, padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5 },
//   button: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginLeft: 5 },
//   buttonText: { color: "white", fontWeight: "bold" },
//   message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "70%" },
//   myMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6", marginRight: 10 },
//   otherMessage: { alignSelf: "flex-start", backgroundColor: "#EAEAEA", marginLeft: 10 },
//   sender: { fontWeight: "bold", marginBottom: 3 },
//   text: { fontSize: 16 },
//   timestamp: { fontSize: 12, color: "gray", marginTop: 5, alignSelf: "flex-end" },
// });

// export default ChatScreen;


import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import trie from "../utils/trie";
import { BACKEND_URL } from "@/config";

const SERVER_URL = "http://192.168.205.9:2000";

type Message = {
  id: string;
  username: string;
  userId : number;
  content: string;
  timestamp: string;
};

const ChatScreen = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [userId , setUserId] = useState(1);
  const room = "chatroom1";

  useEffect(() => {
    const initUsername = async () => {
      let storedUsername = await AsyncStorage.getItem("username");
      if (!storedUsername) {
        storedUsername = "User" + Math.floor(Math.random() * 1000);
        await AsyncStorage.setItem("username", storedUsername);
      }
      setUsername(storedUsername);
    };
    initUsername();
    const initUserId = async () =>{
      let userId = await AsyncStorage.getItem("userId");
      if(userId) {
        setUserId(Number(userId));
      }
    }
    initUserId();
    const newSocket = io(SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);
    newSocket.emit("joinRoom", room);

    newSocket.on("chatMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  const sendMessage = async () => {
    if (text.trim() === "") return;

    const message: Message = {
      id: Date.now().toString(),
      username: username,
      content : text,
      userId : userId,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (trie.search(text)) {
      Alert.alert("Abusive word found");
      return;
    }

    if (socket) {
      socket.emit("chatMessage", { message, room });
    }

    setMessages((prevMessages) => [...prevMessages, message]);
    setText("");
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
