import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Plane, MessageCircle, ShoppingBag, Calendar, DollarSign, Menu } from 'lucide-react-native';
import { router, usePathname, useRouter } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();
  return (
    <View style={styles.bottomNav}>
      <NavItem icon={Home} title="Home" route="/" router={router} />
      <NavItem icon={Calendar} title="Bookings" route="/bookings" router={router} />
      <NavItem icon={MessageCircle} title="Chat" route="/username" router={router} />
      <NavItem icon={Menu} title="Menu" route="/menu" router={router} />
    </View>
  );
};

const NavItem = ({ icon: Icon, title, route, router }) => (
  <TouchableOpacity
    style={styles.navItem}
    onPress={() => router.push(route)}
  >
    <Icon size={20} color="#1F2937" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

export default BottomNav;

const styles = StyleSheet.create({
  roomNo : {
    marginLeft: -170,
    fontSize: 16,
    fontWeight: "bold",
  },
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
