import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Bell, Search, MessageCircle, Home, Calendar, DollarSign, Menu } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";

type Passenger = {
  id: number;
  name: string;
  age: number;
  gender: string;
};

const FlightChatRoomDetails: React.FC = () => {
  const { flightName, flightId } = useLocalSearchParams<{ flightName: string; flightId: string }>();
  const [bookingId, setBookingId] = useState<string>("");
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassenger, setSelectedPassenger] = useState<number | null>(null);

  const fetchBookingDetails = () => {
    // Mock API response
    const mockData: Passenger[] = [
      { id: 1, name: "John Doe", age: 30, gender: "Male" },
      { id: 2, name: "Jane Doe", age: 28, gender: "Female" },
    ];
    setPassengers(mockData);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>udChalo</Text>
        <View style={styles.headerIcons}>
          <Bell color="white" size={20} />
          <Search color="white" size={20} />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.flightDetails}>{flightName} ({flightId})</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Booking ID"
          placeholderTextColor="#6B7280"
          value={bookingId}
          onChangeText={setBookingId}
        />
        <TouchableOpacity style={styles.fetchButton} onPress={fetchBookingDetails}>
          <Text style={styles.fetchButtonText}>Fetch Details</Text>
        </TouchableOpacity>

        {passengers.length > 0 && (
          <View style={styles.passengerList}>
            <Text style={styles.sectionTitle}>Select Your Name</Text>
            {passengers.map((passenger) => (
              <TouchableOpacity
                key={passenger.id}
                style={[
                  styles.passengerItem,
                  selectedPassenger === passenger.id && styles.selectedPassenger,
                ]}
                onPress={() => setSelectedPassenger(passenger.id)}
              >
                <Text>{passenger.name}, {passenger.age}, {passenger.gender}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {selectedPassenger && (
        <TouchableOpacity style={styles.joinButton} onPress={() => router.push("/chatroom")}>
          <Text style={styles.joinButtonText}>Join Chat</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon={Home} title="Home" />
        <NavItem icon={Calendar} title="Bookings" />
        <NavItem icon={DollarSign} title="UC Earnings" />
        <NavItem icon={MessageCircle} title="Chat" />
        <NavItem icon={Menu} title="Menu" />
      </View>
    </View>
  );
};

const NavItem: React.FC<{ icon: React.ElementType; title: string }> = ({ icon: Icon, title }) => (
  <TouchableOpacity style={styles.navItem}>
    <Icon size={20} color="#1F2937" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#475569"
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 60
  },
  flightDetails: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 16
  },
  fetchButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  fetchButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  passengerList: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
  },
  passengerItem: {
    padding: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 8
  },
  selectedPassenger: {
    backgroundColor: "#93C5FD"
  },
  joinButton: {
    backgroundColor: "#10B981",
    padding: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 80,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#E5E7EB",
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  navItem: {
    alignItems: "center"
  },
  navText: {
    fontSize: 12,
    color: "#1F2937"
  }
});

export default FlightChatRoomDetails;
