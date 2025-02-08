// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
// import { Send, ArrowLeft } from "lucide-react-native";
// import { useLocalSearchParams, router } from "expo-router";
// import { LinearGradient } from 'expo-linear-gradient';
// import { useTheme } from '../context/ThemeContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BACKEND_URL } from "@/config";
// import DropDownPicker from 'react-native-dropdown-picker';
// import trie from "../utils/trie";

// interface Message {
//   userId: number;
//   username: string;
//   content: string;
//   room: number;
//   timestamp: string | Date;
//   isUser: boolean;
//   type: string;
// }

// const getUsername = async () => {
//   try {
//     const username = await AsyncStorage.getItem('username');
//     if (username !== null) {
//       console.log('Retrieved username:', username);
//       return username;
//     }
//   } catch (error) {
//     console.error('Error retrieving username from AsyncStorage:', error);
//   }
// };

// const getUserId = async () => {
//   try {
//     const userId = await AsyncStorage.getItem('userId');
//     if (userId !== null) {
//       return parseInt(userId, 10);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

// const ChatRoom: React.FC = () => {
//   const [userId, setUser] = useState<number | undefined>(-1);
//   const { colors } = useTheme();
//   const { roomName = "Announcement", roomId = 1 } = useLocalSearchParams<{ roomName?: string; roomId?: number }>();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState("");
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [showToast, setShowToast] = useState(false);
//   const [announcementType, setAnnouncementType] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(false);
//   const [announcementText, setAnnouncementText] = useState("");
//   const [activeMembers, setActiveMembers] = useState<string[]>([]);

//   useEffect(() => {
//     const func = async () => {
//       if (roomName.toLowerCase() === "announcement") {
//         setTimeout(() => setShowToast(true), 10000);
//       }
//       const ws = new WebSocket(BACKEND_URL);
//       const username = await getUsername();
//       const user = await getUserId();
//       setUser(user);

//       setSocket(ws);

//       ws.onopen = () => {
//         console.log('Connected to WebSocket server');
//         ws.send(
//           JSON.stringify({
//             type: 'join',
//             userId: user,
//             room: roomId,
//             username: username
//           })
//         );
//       };

//       ws.onmessage = (event) => {
//         const message: Message = JSON.parse(event.data);
//         if (message.room === roomId) {
//           if (message.type === 'history') {
//             const historyMessages = JSON.parse(message.content || '[]');
//             setMessages((prevMessages) => [
//               ...prevMessages,
//               ...historyMessages.map((msg: Message) => ({
//                 userId: msg.userId || -1,
//                 username: msg.username || '',
//                 content: msg.content || '',
//                 room: msg.room || roomId,
//                 isUser: msg.userId === user,
//                 timestamp: new Date(msg.timestamp || Date.now()),
//                 type: msg.type
//               }))
//             ]);
//           } else {
//             setMessages((prevMessages) => [
//               ...prevMessages,
//               {
//                 userId: message.userId || -1,
//                 username: message.username || '',
//                 content: message.content || '',
//                 room: message.room || roomId,
//                 isUser: message.userId === user,
//                 timestamp: new Date(message.timestamp || Date.now()),
//                 type: message.type
//               }
//             ]);
//             if (message.type === 'join') {
//               Alert.alert(message.username);
//               setActiveMembers((prev) => [...prev, message.username]);
//             } else if (message.type === 'leave') {
//               setActiveMembers((prev) => prev.filter((name) => name !== message.username));
//             }
//           }
//         }
//       };

//       ws.onerror = (error) => {
//         console.error('WebSocket error:', error);
//       };

//       ws.onclose = () => {
//         console.log('WebSocket connection closed');
//       };

//       return () => {
//         ws.close();
//       };
//     };

//     func();
//   }, [roomId, roomName]);

//   const sendMessage = () => {
//     if (socket && inputText.trim()) {
//       const message = {
//         type: 'message',
//         userId: userId,
//         room: roomId,
//         content: inputText,
//       };
//       if(trie.search(message.content)) {
//         Alert.alert("Abusive word found,change it")
//       } else {
//         socket.send(JSON.stringify(message));
//         setInputText("");
//       }
//     }
//   };

//   const sendAnnouncement = () => {
//     if (socket && announcementText.trim() && announcementType) {
//       const message = {
//         type: 'announcement',
//         userId,
//         room: roomId,
//         content: `${announcementType}: ${announcementText}`,
//       };
//       if(trie.search(message.content)) {
//           Alert.alert("Abusive word found change it");
//       } else {
//         socket.send(JSON.stringify(message));
//         setShowToast(false);
//         setAnnouncementText("");
//         setAnnouncementType(null);
//       }
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//             <ArrowLeft color="white" size={24} />
//           </TouchableOpacity>
//           <View style={styles.headerInfo}>
//             <Text style={styles.headerSubtitle}>{roomName}</Text>
//             {activeMembers.length > 0 && (
//               <Text style={styles.activeMembersText}>
//                 Active Members: {activeMembers.join(", ")}
//               </Text>
//             )}
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
//         {messages.map((message) => (
//           <View
//             key={`${message.userId}-${message.timestamp}`}
//             style={[styles.messageContainer, message.isUser ? styles.userMessage : styles.otherMessage]}
//           >
//             {message.isUser ? (
//               <>
//                 <Text style={styles.username}>{message.username}</Text>
//                 <Text style={[styles.messageText, message.isUser && styles.userMessageText]}>{message.content}</Text>
//                 <Text style={[styles.timestamp, message.isUser && styles.userTimestamp]}>
//                   {message.timestamp.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
//                 </Text>
//               </>
//             ) : (
//               <>
//                 <Text style={styles.sender}>{message.username}</Text>
//                 <Text style={styles.messageText}>{message.content}</Text>
//                 <Text style={styles.timestamp}>
//                   {message.timestamp.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
//                 </Text>
//               </>
//             )}
//           </View>
//         ))}
//       </ScrollView>

//       <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
//         <TextInput
//           style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
//           value={inputText}
//           onChangeText={setInputText}
//           placeholder="Type a message..."
//           placeholderTextColor={colors.textSecondary}
//           multiline
//         />
//         <TouchableOpacity
//           style={[styles.sendButton, { backgroundColor: inputText.trim() ? colors.primary : colors.textSecondary }]}
//           onPress={sendMessage}
//           disabled={!inputText.trim()}
//         >
//           <Send size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {showToast && (
//         <View style={styles.toastContainer}>
//           <Text style={styles.toastTitle}>Make an Announcement</Text>
//           <DropDownPicker
//             open={openDropdown}
//             value={announcementType}
//             items={[{ label: "Gate Change", value: "Gate Change" }, { label: "Delay", value: "Delay" }]}
//             setOpen={setOpenDropdown}
//             setValue={setAnnouncementType}
//             style={styles.dropdown}
//           />
//           <TextInput
//             style={styles.toastInput}
//             placeholder="Enter announcement..."
//             value={announcementText}
//             onChangeText={setAnnouncementText}
//           />
//           <TouchableOpacity style={styles.toastSendButton} onPress={sendAnnouncement}>
//             <Send size={20} color="white" />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     padding: 16,
//     paddingTop: 48,
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 12,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 12,
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 2,
//   },
//   activeMembersText: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.6)',
//     marginTop: 4,
//   },
//   chatContainer: {
//     flex: 1,
//   },
//   chatContent: {
//     padding: 16,
//     paddingBottom: 80,
//   },
//   messageContainer: {
//     padding: 12,
//     borderRadius: 20,
//     marginBottom: 12,
//     maxWidth: "85%",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//   },
//   userMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#3B82F6",
//     borderTopRightRadius: 4,
//   },
//   otherMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "white",
//     borderTopLeftRadius: 4,
//   },
//   username: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: "white",
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   sender: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#6B7280",
//     marginBottom: 4,
//   },
//   messageText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: "#1F2937",
//   },
//   userMessageText: {
//     color: "white",
//   },
//   timestamp: {
//     fontSize: 10,
//     color: "#6B7280",
//     marginTop: 4,
//     alignSelf: 'flex-end',
//   },
//   userTimestamp: {
//     color: "rgba(255,255,255,0.7)",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     padding: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//     marginBottom: 80,
//   },
//   input: {
//     flex: 1,
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     paddingRight: 40,
//     marginRight: 8,
//     maxHeight: 100,
//     fontSize: 16,
//   },
//   sendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   toastContainer: {
//     position: "absolute",
//     bottom: 80,
//     right: 10,
//     backgroundColor: "#333",
//     padding: 12,
//     borderRadius: 8,
//     width: 250,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   toastTitle: { color: "white", fontWeight: "bold", marginBottom: 4 },
//   dropdown: { marginBottom: 8 },
//   toastInput: { backgroundColor: "white", padding: 8, borderRadius: 4, marginBottom: 8 },
//   toastSendButton: { backgroundColor: "#007bff", padding: 8, borderRadius: 4, alignItems: "center" },
// });

// export default ChatRoom;


import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { Send, ArrowLeft, Ban } from "lucide-react-native"; // Added Ban icon
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from "@/config";
import DropDownPicker from 'react-native-dropdown-picker';
import trie from "../utils/trie";

interface Message {
  userId: number;
  username: string;
  content: string;
  room: number;
  timestamp: string | Date;
  isUser: boolean;
  type: string;
}

const getUsername = async () => {
  try {
    const username = await AsyncStorage.getItem('username');
    if (username !== null) {
      return username;
    }
  } catch (error) {
    console.error('Error retrieving username from AsyncStorage:', error);
  }
};

const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (userId !== null) {
      return parseInt(userId, 10);
    }
  } catch (e) {
    console.log(e);
  }
};

const ChatRoom: React.FC = () => {
  const [userId, setUser] = useState<number | undefined>(-1);
  const { colors } = useTheme();
  const { roomName = "Announcement", roomId = 1 } = useLocalSearchParams<{ roomName?: string; roomId?: number }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [announcementType, setAnnouncementType] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [activeMembers, setActiveMembers] = useState<string[]>([]);
  
  // Spam detection
  const [messageTimestamps, setMessageTimestamps] = useState<number[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<number | null>(null);

  useEffect(() => {
    const func = async () => {
      if (roomName.toLowerCase() === "announcement") {
        setTimeout(() => setShowToast(true), 10000);
      }
      const ws = new WebSocket(BACKEND_URL);
      const username = await getUsername();
      const user = await getUserId();
      setUser(user);

      setSocket(ws);

      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        ws.send(
          JSON.stringify({
            type: 'join',
            userId: user,
            room: roomId,
            username: username
          })
        );
      };

      ws.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        if (message.room === roomId) {
          if (message.type === 'history') {
            const historyMessages = JSON.parse(message.content || '[]');
            setMessages((prevMessages) => [
              ...prevMessages,
              ...historyMessages.map((msg: Message) => ({
                userId: msg.userId || -1,
                username: msg.username || '',
                content: msg.content || '',
                room: msg.room || roomId,
                isUser: msg.userId === user,
                timestamp: new Date(msg.timestamp || Date.now()),
                type: msg.type
              }))
            ]);
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                userId: message.userId || -1,
                username: message.username || '',
                content: message.content || '',
                room: message.room || roomId,
                isUser: message.userId === user,
                timestamp: new Date(message.timestamp || Date.now()),
                type: message.type
              }
            ]);
            if (message.type === 'join') {
              Alert.alert(message.username);
              setActiveMembers((prev) => [...prev, message.username]);
            } else if (message.type === 'leave') {
              setActiveMembers((prev) => prev.filter((name) => name !== message.username));
            }
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
    };

    func();
  }, [roomId, roomName]);

  // Function to check and update spam
  const checkForSpam = () => {
    const now = Date.now();
    const newTimestamps = [...messageTimestamps, now].filter(t => now - t < 10000);
    
    if (newTimestamps.length >= 5) {
      setIsBlocked(true);
      setBlockEndTime(now + 120000);
      setTimeout(() => setIsBlocked(false), 120000);
      Alert.alert("You have been blocked for 2 minutes due to spam.");
    }
    
    setMessageTimestamps(newTimestamps);
  };

  const sendMessage = () => {
    if (isBlocked) return;

    if (socket && inputText.trim()) {
      const message = {
        type: 'message',
        userId: userId,
        room: roomId,
        content: inputText,
      };

      if (trie.search(message.content)) {
        Alert.alert("Abusive word found, change it");
      } else {
        checkForSpam();
        socket.send(JSON.stringify(message));
        setInputText("");
      }
    }
  };
  const sendAnnouncement = () => {
    if (socket && announcementText.trim() && announcementType) {
      const message = {
        type: 'announcement',
        userId,
        room: roomId,
        content: `${announcementType}: ${announcementText}`,
      };
      if (trie.search(message.content)) {
        Alert.alert("Abusive word found, change it");
      } else {
        socket.send(JSON.stringify(message));
        setShowToast(false);
        setAnnouncementText("");
        setAnnouncementType(null);
      }
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
            <Text style={styles.headerSubtitle}>{roomName}</Text>
            {activeMembers.length > 0 && (
              <Text style={styles.activeMembersText}>
                Active Members: {activeMembers.join(", ")}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {messages.map((message) => (
          <View
            key={`${message.userId}-${message.timestamp}`}
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
          style={[styles.sendButton, { backgroundColor: isBlocked ? 'gray' : colors.primary }]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isBlocked}
        >
          {isBlocked ? <Ban size={20} color="white" /> : <Send size={20} color="white" />}
        </TouchableOpacity>
      </View>

      {showToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastTitle}>Make an Announcement</Text>
          <DropDownPicker
            open={openDropdown}
            value={announcementType}
            items={[{ label: "Gate Change", value: "Gate Change" }, { label: "Delay", value: "Delay" }]}
            setOpen={setOpenDropdown}
            setValue={setAnnouncementType}
            style={styles.dropdown}
          />
          <TextInput
            style={styles.toastInput}
            placeholder="Enter announcement..."
            value={announcementText}
            onChangeText={setAnnouncementText}
          />
          <TouchableOpacity style={styles.toastSendButton} onPress={sendAnnouncement}>
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
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
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  activeMembersText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
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
  toastContainer: {
    position: "absolute",
    bottom: 80,
    right: 10,
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    width: 250,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toastTitle: { color: "white", fontWeight: "bold", marginBottom: 4 },
  dropdown: { marginBottom: 8 },
  toastInput: { backgroundColor: "white", padding: 8, borderRadius: 4, marginBottom: 8 },
  toastSendButton: { backgroundColor: "#007bff", padding: 8, borderRadius: 4, alignItems: "center" },
});
export default ChatRoom;
