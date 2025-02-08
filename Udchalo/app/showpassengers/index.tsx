import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Image, Alert } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { BACKEND_URL } from "@/config";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";

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
  const [showPassengers, setShowPassengers] = useState(false);
  const [showUsernames, setShowUsernames] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const mockUsernames = [
    "Flaming Cheetah", "Swift Eagle", "Sly Fox", "Bold Lion", "Graceful Swan", "Mighty Tiger"
  ];

  const fetchBookingDetails = async() => {
    await axios.post(`${BACKEND_URL}/api/user/getbooking`,{
      flightId,bookingId
    }).then((res)=>{
        if(res.data.success === true) {
          setPassengers(res.data.passengers.users);
          setShowPassengers(true);
        } else {
          Alert.alert("No passenger found with the booking details");
        }
    }).catch((e)=>{
      Alert.alert(e);
    })
  };

  const handlePassengerSelection = (id: number) => {
    setSelectedPassenger(id);
    storeUserId(id.toString());
    router.push(`/threads?flightId=${flightId}&flightName=${flightName}`)
  };
  const storeUserId = async(id : string) =>{
    try {
      await AsyncStorage.setItem("userId" , id);
    } catch(e) {
      console.error(e);
    }
  }
  
  const storeUsername = async (selectedUsername: string) => {
    try {
      await AsyncStorage.setItem('username', selectedUsername);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };
  return (
    <View style={styles.container}>
      <TopBar/>
      <ScrollView style={styles.content}>
        {!showPassengers && !showUsernames && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter Booking Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Booking ID"
              placeholderTextColor="#6B7280"
              value={bookingId}
              onChangeText={setBookingId}
            />
            <TouchableOpacity style={styles.fetchButton} onPress={fetchBookingDetails}>
              <Text style={styles.fetchButtonText}>Verify Booking</Text>
            </TouchableOpacity>
          </View>
        )}
        {showPassengers && (
          <View style={styles.passengerCard}>
            <Text style={styles.cardTitle}>Select Passenger</Text>
            {passengers.map((passenger) => (
              <TouchableOpacity key={passenger.id} style={styles.passengerItem} onPress={() => handlePassengerSelection(passenger.id)}>
                <Text style={styles.passengerName}>{passenger.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <BottomNav/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { padding: 16, paddingTop: 48, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start' },
  headerContent: { marginTop: 16 },
  headerTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  headerSubtitle: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: 4 },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 16 },
  input: { backgroundColor: "#F3F4F6", borderRadius: 12, padding: 16, fontSize: 16, color: "#1F2937",marginBottom:15 },
  fetchButton: { backgroundColor: "#3B82F6", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  fetchButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
  passengerCard: { backgroundColor: "white", borderRadius: 16, padding: 16 },
  passengerItem: { padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: "#F8FAFC" },
  passengerName: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  usernameSelectionCard: { backgroundColor: "white", borderRadius: 16, padding: 16 },
  usernameOption: { backgroundColor: '#F8FAFC', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: '#3B82F6', margin:5 },
  usernameOptionText: { color: '#3B82F6', fontSize: 16, fontWeight: '600' }
});

export default FlightChatRoomDetails;
