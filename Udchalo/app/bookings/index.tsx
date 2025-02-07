import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import moment from "moment";
import axios from "axios";
import { BACKEND_URL } from "@/config";

const Tab = createMaterialTopTabNavigator();

// Flight Card Component
const FlightCard = ({ flightName, flightNo, departureDate, status }) => {
  const flightDate = moment(departureDate);
  const today = moment();
  const daysLeft = flightDate.diff(today, "days");

  return (
    <View style={styles.card}>
      <Text style={styles.flightName}>{flightName}</Text>
      <Text style={styles.flightNo}>Flight No: {flightNo}</Text>
      <Text style={styles.timestamp}>Departure: {flightDate.format("DD MMM YYYY, hh:mm A")}</Text>
      {status === "Upcoming" && daysLeft <= 2 && (
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinText}>Join Room</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Flight List Component
const FlightList = ({ status }) => {
  const [filteredFlights, setFilteredFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        console.log("Fetching flights...");
        const response = await axios.post(`${BACKEND_URL}/api/user/getAllbookings`, { userId: 1 });

        // Ensure response contains a valid array
        const flights = response.data?.bookings || [];
        console.log("Fetched Flights:", flights);

        // Filter flights based on status
        const updatedFlights = flights.filter((f) => f.status === status);
        setFilteredFlights(updatedFlights);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchFlights();
  }, [status]);

  return filteredFlights.length > 0 ? (
    <FlatList
      data={filteredFlights}
      keyExtractor={(item, index) => index.toString()} // Use index if id is missing
      renderItem={({ item }) => (
        <FlightCard
          flightName={item.flightName}
          flightNo={item.flightNo}
          departureDate={item.departureDate}
          status={item.status}
        />
      )}
    />
  ) : (
    <View style={styles.noBookings}>
      <Text style={styles.noBookingsText}>No {status.toLowerCase()} bookings found!</Text>
    </View>
  );
};

// Bookings Screen with Tabs
const Bookings = () => {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarIndicatorStyle: { backgroundColor: "green" },
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Upcoming">{() => <FlightList status="Upcoming" />}</Tab.Screen>
        <Tab.Screen name="Completed">{() => <FlightList status="Completed" />}</Tab.Screen>
        <Tab.Screen name="Cancelled">{() => <FlightList status="Cancelled" />}</Tab.Screen>
        <Tab.Screen name="Failed">{() => <FlightList status="Failed" />}</Tab.Screen>
      </Tab.Navigator>
      <BottomNav />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flightName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  flightNo: {
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  joinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noBookings: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBookingsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
});

export default Bookings;
