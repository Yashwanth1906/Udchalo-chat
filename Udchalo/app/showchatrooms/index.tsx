import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";

interface Flight {
  name: string;
  flightNo: string;
  departureDate: string;
  arrivalDate: string;
}

const FlightChatRooms = () => {
  const [flightRooms, setFlightRooms] = useState<Flight[] | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/getflights`);
        if (res.data.success) {
          setFlightRooms(res.data.flights);
        } else {
          alert("No flights available");
          router.push("/");
        }
      } catch (e) {
        alert(e);
      }
    };
    fetchFlights();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput style={styles.searchBar} placeholder="Search flights..." placeholderTextColor="#6B7280" />

        {flightRooms?.map((room) => (
          <View key={room.flightNo} style={styles.chatRoom}>
            <View style={styles.roomDetails}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomNo}>{room.flightNo}</Text>
            </View>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => router.push(`/showpassengers?flightId=${room.flightNo}&username=${room.name}`)}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80, // Ensures BottomNav is not overlapped
  },
  searchBar: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  chatRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  roomDetails: {
    flex: 1, // Takes available space
    flexDirection: "column",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  roomNo: {
    fontSize: 14,
    color: "#374151",
  },
  joinButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FlightChatRooms;
