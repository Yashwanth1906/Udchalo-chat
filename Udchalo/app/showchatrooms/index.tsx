import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Bell, Search, MessageCircle, Home, Calendar, DollarSign, Menu } from "lucide-react-native";
import { router } from "expo-router";
import axios from "axios";
const FlightChatRooms = () => {

  useEffect(()=>{
    
  })

  const flightRooms = [
    { name: "Indigo 6E123", id: "1" },
    { name: "Air India AI456", id: "2" },
    { name: "SpiceJet SG789", id: "3" },
    { name: "Vistara UK101", id: "4" }
  ];

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
        <TextInput
          style={styles.searchBar}
          placeholder="Search flights..."
          placeholderTextColor="#6B7280"
        />

        {flightRooms.map((room) => (
          <View key={room.id} style={styles.chatRoom}>
            <Text style={styles.roomName}>{room.name}</Text>
            <TouchableOpacity style={styles.joinButton} onPress={()=>router.push("/showpassengers")}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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

const NavItem = ({ icon: Icon, title }) => (
  <TouchableOpacity style={styles.navItem}>
    <Icon size={20} color="#1F2937" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#475569",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  content: {
    flex: 1,
    marginBottom: 60,
    padding: 16,
  },
  searchBar: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  chatRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 10,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#E5E7EB",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#1F2937",
  },
});

export default FlightChatRooms;
