import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Send, MoreVertical, Flag, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useChat } from './context/ThemeContext';
import { useLocalSearchParams, router } from 'expo-router';
import { BottomNav } from './components/BottomNav';

const CURRENT_USER_ID = 'U1'; // Hardcoded for demo

const GroupChat = () => {
  const { messages, sendMessage, reportMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const { bookingId } = useLocalSearchParams();
  const { colors } = useTheme();

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim(), bookingId as string, 'TravelBuff');
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
            <Text style={styles.headerSubtitle}>Flight DEL-BOM #AI101</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical color="white" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={messages.filter(m => m.flightId === bookingId)}
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
  moreButton: {
    padding: 8,
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 80,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sentMessageWrapper: {
    justifyContent: 'flex-end',
  },
  receivedMessageWrapper: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 12,
    paddingBottom: 8,
  },
  sentMessage: {
    borderTopRightRadius: 4,
  },
  receivedMessage: {
    borderTopLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    marginRight: 4,
  },
  reportButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupChat; 