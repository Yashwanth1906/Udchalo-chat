import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Users, MessageCircle, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

type ChatOption = 'individual' | 'group';

interface Props {
  flightName: string;
  flightId: string;
  onSelect: (type: ChatOption) => void;
}

const { width } = Dimensions.get('window');

const ChatSelector: React.FC<Props> = ({ flightName, flightId, onSelect }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.headerTitle}>Flight Chat</Text>
          <View style={styles.flightBadge}>
            <Text style={styles.flightInfo}>{flightName} • {flightId}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.option, { backgroundColor: colors.card }]}
          onPress={() => onSelect('individual')}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.iconContainer}
          >
            <MessageCircle color="white" size={32} />
          </LinearGradient>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Individual Chat</Text>
            <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
              Chat privately with other passengers
            </Text>
          </View>
          <ArrowRight color={colors.primary} size={24} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.option, { backgroundColor: colors.card }]}
          onPress={() => onSelect('group')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.iconContainer}
          >
            <Users color="white" size={32} />
          </LinearGradient>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Flight Group</Text>
            <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
              Join the group chat with all passengers
            </Text>
          </View>
          <ArrowRight color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={[styles.featuresTitle, { color: colors.text }]}>Features</Text>
        <View style={styles.featuresList}>
          {[
            'Real-time messaging',
            'Share flight updates',
            'Connect with co-passengers',
            'Get crew announcements'
          ].map((feature, index) => (
            <View 
              key={index} 
              style={[styles.featureItem, { backgroundColor: colors.card }]}
            >
              <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <Image 
        source={{ uri: 'https://illustrations.popsy.co/purple/group-chat.svg' }}
        style={styles.illustration}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  flightBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  flightInfo: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  optionsContainer: {
    padding: 20,
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
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
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  featuresContainer: {
    padding: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  illustration: {
    width: width * 0.8,
    height: width * 0.4,
    alignSelf: 'center',
    opacity: 0.6,
    position: 'absolute',
    bottom: 20,
  },
});

export default ChatSelector;