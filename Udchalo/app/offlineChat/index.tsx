// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const ChatScreen = () => {
//   const [username, setUsername] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   useEffect(() => {
//     const fetchUsername = async () => {
//       const storedName = await AsyncStorage.getItem("username");
//       if (storedName) setUsername(storedName);
//     };
//     fetchUsername();
//   }, []);

//   const sendMessage = () => {
//     if (text.trim()) {
//       setMessages([...messages, { id: Date.now().toString(), sender: username, text }]);
//       setText("");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Chat</Text>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={[styles.message, item.sender === username ? styles.myMessage : styles.otherMessage]}>
//             <Text style={styles.sender}>{item.sender}</Text>
//             <Text style={styles.text}>{item.text}</Text>
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
// });

// export default ChatScreen;


import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:4000"; // Replace with your server's IP

type Message = {
  id: string;
  user: string;
  text: string;
  timestamp: string;
};

const ChatScreen = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const room = "chatroom1"; // Fixed room

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

  const sendMessage = () => {
    if (socket && text.trim() !== "") {
      const message: Message = {
        id: Date.now().toString(),
        user: username,
        text,
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.emit("chatMessage", { message, room });

      setText("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.user === username ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.sender}>{item.user}</Text>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
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
