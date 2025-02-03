import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Image } from "react-native";
import { Bell, Search, MessageCircle, Home, Calendar, DollarSign, Menu, ArrowLeft, Users } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

type Passenger = {
  id: number;
  name: string;
  age: number;
  gender: string;
};

type ChatType = 'individual' | 'group' | null;

const FlightChatRoomDetails: React.FC = () => {
  const { flightName, flightId } = useLocalSearchParams<{ flightName: string; flightId: string }>();
  const [bookingId, setBookingId] = useState<string>("");
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassenger, setSelectedPassenger] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [chatType, setChatType] = useState<ChatType>(null);

  const fetchBookingDetails = () => {
    // Mock API response
    const mockData: Passenger[] = [
      { id: 1, name: "John Doe", age: 30, gender: "Male" },
      { id: 2, name: "Jane Doe", age: 28, gender: "Female" },
    ];
    setPassengers(mockData);
    setIsVerified(true);
  };

  const handleChatSelection = (type: ChatType) => {
    setChatType(type);
    if (type === 'group') {
      router.push("/chatroom?type=group");
    }
  };

  const handleJoinChat = () => {
    if (chatType === 'individual') {
      router.push("/chatroom?type=individual");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Flight Details</Text>
          <Text style={styles.headerSubtitle}>{flightName} ({flightId})</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter Booking Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Booking ID"
            placeholderTextColor="#6B7280"
            value={bookingId}
            onChangeText={setBookingId}
          />
          <TouchableOpacity 
            style={styles.fetchButton} 
            onPress={fetchBookingDetails}
          >
            <Text style={styles.fetchButtonText}>Verify Booking</Text>
          </TouchableOpacity>
        </View>

        {isVerified && (
          <View style={styles.chatTypeCard}>
            <Text style={styles.cardTitle}>Select Chat Type</Text>
            <View style={styles.chatOptions}>
              <TouchableOpacity 
                style={[styles.chatOption, chatType === 'individual' && styles.selectedChatOption]}
                onPress={() => handleChatSelection('individual')}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.iconContainer}
                >
                  <MessageCircle color="white" size={28} />
                </LinearGradient>
                <Text style={styles.chatOptionTitle}>Individual Chat</Text>
                <Text style={styles.chatOptionDescription}>Chat with specific passengers</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.chatOption, chatType === 'group' && styles.selectedChatOption]}
                onPress={() => handleChatSelection('group')}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#6D28D9']}
                  style={styles.iconContainer}
                >
                  <Users color="white" size={28} />
                </LinearGradient>
                <Text style={styles.chatOptionTitle}>Group Chat</Text>
                <Text style={styles.chatOptionDescription}>Join flight group chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isVerified && chatType === 'individual' && (
          <View style={styles.passengerCard}>
            <Text style={styles.cardTitle}>Select Passenger</Text>
            {passengers.map((passenger) => (
              <TouchableOpacity
                key={passenger.id}
                style={[
                  styles.passengerItem,
                  selectedPassenger === passenger.id && styles.selectedPassenger,
                ]}
                onPress={() => setSelectedPassenger(passenger.id)}
              >
                <View style={styles.passengerInfo}>
                  <Image 
                    source={{ uri: `https://ui-avatars.com/api/?name=${passenger.name}&background=random` }}
                    style={styles.avatar}
                  />
                  <View style={styles.passengerDetails}>
                    <Text style={styles.passengerName}>{passenger.name}</Text>
                    <Text style={styles.passengerSubInfo}>{passenger.age} years • {passenger.gender}</Text>
                  </View>
                </View>
                <View style={[
                  styles.selectionIndicator,
                  selectedPassenger === passenger.id && styles.selectedIndicator
                ]} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {selectedPassenger && chatType === 'individual' && (
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoinChat}
        >
          <Text style={styles.joinButtonText}>Start Individual Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    padding: 16,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
  },
  headerContent: {
    marginTop: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 16,
  },
  fetchButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  fetchButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  passengerCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  passengerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F8FAFC",
  },
  selectedPassenger: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
    borderWidth: 1,
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  passengerSubInfo: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  selectedIndicator: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  joinButton: {
    margin: 16,
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  chatTypeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  chatOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  chatOption: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedChatOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  chatOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  chatOptionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default FlightChatRoomDetails;
