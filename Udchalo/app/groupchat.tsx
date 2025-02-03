import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Send, MoreVertical, Flag, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useChat } from './context/ChatContext';
import { useTheme } from './context/ThemeContext';
import { useLocalSearchParams, router } from 'expo-router';
import BottomNav from './components/BottomNav';

const CURRENT_USER_ID = 'U1'; // Hardcoded for demo

const GroupChat = () => {
  const { messages, sendMessage, reportMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const { flightId } = useLocalSearchParams();
  const { colors } = useTheme();

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim(), flightId as string, 'TravelBuff');
    setNewMessage('');
  };

  const renderMessage = ({ item }) => {
    const isSentByMe = item.userId === CURRENT_USER_ID;

    return (
      <View style={[
        styles.messageWrapper,
        isSentByMe ? styles.sentMessageWrapper : styles.receivedMessageWrapper
      ]}>
        {!isSentByMe && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://i.pravatar.cc/150?u=${item.userId}` }}
              style={styles.avatar}
            />
          </View>
        )}
        <View style={[
          styles.messageContainer,
          isSentByMe ? styles.sentMessage : styles.receivedMessage,
          { backgroundColor: isSentByMe ? colors.primary : colors.card }
        ]}>
          {!isSentByMe && (
            <Text style={styles.senderName}>{item.nickname}</Text>
          )}
          <Text style={[
            styles.messageText,
            { color: isSentByMe ? 'white' : colors.text }
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.timestamp,
              { color: isSentByMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
            ]}>
              {new Date(item.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {item.isOffline && ' (Offline)'}
            </Text>
            {!isSentByMe && (
              <TouchableOpacity 
                onPress={() => reportMessage(item.id)}
                style={styles.reportButton}
              >
                <Flag size={12} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
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
            <Text style={styles.headerTitle}>Flight Group Chat</Text>
            <Text style={styles.headerSubtitle}>Flight {flightId}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical color="white" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={messages.filter(m => m.flightId === flightId)}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
        inverted
      />

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}> 
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.background,
            color: colors.text
          }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>

      <BottomNav />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { padding: 16, paddingTop: 48, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
//   headerContent: { flexDirection: 'row', alignItems: 'center' },
//   backButton: { padding: 8, marginRight: 12 },
//   headerInfo: { flex: 1 },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
//   headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
//   moreButton: { padding: 8 },
//   chatList: { flex: 1 },
//   chatContent: { padding: 16, paddingBottom: 80 },
//   inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
//   input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, paddingRight: 40, maxHeight: 100, fontSize: 16 },
//   sendButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
// });
const styles = StyleSheet.create({
  // Main container for the chat screen
  container: { 
    flex: 1 
  },

  // Header section with a gradient background
  header: { 
    padding: 16, 
    paddingTop: 48, 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24 
  },

  // Header content layout (row alignment)
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  // Back button in the header
  backButton: { 
    padding: 8, 
    marginRight: 12 
  },

  // Wrapper for title and subtitle in header
  headerInfo: { 
    flex: 1 
  },

  // Flight Group Chat title in the header
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'white' 
  },

  // Flight ID subtitle in the header
  headerSubtitle: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.8)', 
    marginTop: 2 
  },

  // More options button in the header
  moreButton: { 
    padding: 8 
  },

  // FlatList container for messages
  chatList: { 
    flex: 1 
  },

  // Content inside FlatList for spacing
  chatContent: { 
    padding: 16, 
    paddingBottom: 80 
  },

  // Input container for message typing
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    padding: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB' 
  },

  // Text input field for typing messages
  input: { 
    flex: 1, 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    paddingRight: 40, 
    maxHeight: 100, 
    fontSize: 16 
  },

  // Send button for messages
  sendButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // Wrapper for each chat message
  messageWrapper: { 
    marginBottom: 16, 
    flexDirection: 'row', 
    alignItems: 'flex-end' 
  },

  // Sent message container (aligns to right)
  sentMessageWrapper: { 
    justifyContent: 'flex-end' 
  },

  // Received message container (aligns to left)
  receivedMessageWrapper: { 
    justifyContent: 'flex-start' 
  },

  // Avatar container for received messages
  avatarContainer: { 
    marginRight: 8 
  },

  // Avatar image for received messages
  avatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16 
  },

  // Message container with styling
  messageContainer: { 
    maxWidth: '75%', 
    borderRadius: 20, 
    padding: 12, 
    paddingBottom: 8 
  },

  // Sent message bubble styling (rounded edges)
  sentMessage: { 
    borderTopRightRadius: 4 
  },

  // Received message bubble styling (rounded edges)
  receivedMessage: { 
    borderTopLeftRadius: 4 
  },

  // Sender name displayed above received messages
  senderName: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: '#64748B', 
    marginBottom: 4 
  },

  // Message text content
  messageText: { 
    fontSize: 16, 
    lineHeight: 22 
  },

  // Footer for message (timestamp and report button)
  messageFooter: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginTop: 4 
  },

  // Timestamp text for messages
  timestamp: { 
    fontSize: 11, 
    marginRight: 4 
  },

  // Report button for reporting messages
  reportButton: { 
    padding: 4 
  },
});



export default GroupChat;