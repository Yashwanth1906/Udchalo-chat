import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Users, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ChatOption = 'individual' | 'group';

interface Props {
  flightName: string;
  flightId: string;
  onSelect: (type: ChatOption) => void;
}

const ChatSelector: React.FC<Props> = ({ flightName, flightId, onSelect }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Select Chat Type</Text>
        <Text style={styles.flightInfo}>{flightName} • {flightId}</Text>
      </LinearGradient>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.option}
          onPress={() => onSelect('individual')}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.iconContainer}
          >
            <MessageCircle color="white" size={32} />
          </LinearGradient>
          <Text style={styles.optionTitle}>Individual Chat</Text>
          <Text style={styles.optionDescription}>
            Chat privately with other passengers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option}
          onPress={() => onSelect('group')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.iconContainer}
          >
            <Users color="white" size={32} />
          </LinearGradient>
          <Text style={styles.optionTitle}>Flight Group</Text>
          <Text style={styles.optionDescription}>
            Join the group chat with all passengers
          </Text>
        </TouchableOpacity>
      </View>

      <Image 
        source={{ uri: 'https://illustrations.popsy.co/purple/group-chat.svg' }}
        style={styles.illustration}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  flightInfo: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  optionsContainer: {
    padding: 20,
    gap: 16,
  },
  option: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  illustration: {
    width: '100%',
    height: 200,
    position: 'absolute',
    bottom: 0,
    opacity: 0.6,
  },
});

export default ChatSelector; 