import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native"
import {
  Bell,
  User,
  Plane,
  Map,
  ShoppingBag,
  Receipt,
  Ticket,
  Palmtree,
  Laptop,
  Shirt,
  Bike,
  LampCeiling,
} from "lucide-react-native"
import { router } from "expo-router"
import BottomNav from "./components/BottomNav"
import TopBar from "./components/TopBar"

const MAIN_FEATURES = [
  {
    id: "1",
    title: "Flights",
    icon: Plane,
    route: "/flights",
  },
  {
    id: "2",
    title: "Chhawani Plotting",
    icon: Map,
    route: "/plotting",
  },
  {
    id: "3",
    title: "Sadar Bazaar",
    icon: ShoppingBag,
    route: "/bazaar",
  },
  {
    id: "4",
    title: "Tax Filing",
    icon: Receipt,
    route: "/tax",
  },
]

const TRAVEL_FEATURES = [
  {
    id: "1",
    title: "Flights",
    icon: Plane,
    route: "/flights",
  },
  {
    id: "2",
    title: "Claimable Tickets",
    icon: Ticket,
    route: "/tickets",
  },
  {
    id: "3",
    title: "Holidays",
    icon: Palmtree,
    route: "/holidays",
  },
]

const BAZAAR_FEATURES = [
  {
    id: "1",
    title: "Electronics",
    icon: Laptop,
    route: "/electronics",
  },
  {
    id: "2",
    title: "Clothing",
    icon: Shirt,
    route: "/clothing",
  },
  {
    id: "3",
    title: "E Scooter",
    icon: Bike,
    route: "/scooter",
  },
  {
    id: "4",
    title: "Decor",
    icon: LampCeiling,
    route: "/decor",
  },
]

const HomeScreen = () => {
  const handleNavigation = (route: string) => {
    router.push(route)
  }

  return (
    <View style={styles.container}>
      <TopBar/>
      <ScrollView style={styles.content}>
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-02%20at%2010.18.27_dbb06f29.jpg-TaGPqG7eGDw3hL4lpM9osO25jIZ7JR.jpeg",
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.mainFeatures}>
          {MAIN_FEATURES.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.mainFeatureButton}
              onPress={() => handleNavigation(feature.route)}
            >
              <View style={styles.iconCircle}>
                <feature.icon size={24} color="#fff" />
              </View>
              <Text style={styles.featureText}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel</Text>
          <View style={styles.featureGrid}>
            {TRAVEL_FEATURES.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureButton}
                onPress={() => handleNavigation(feature.route)}
              >
                <View style={[styles.iconCircle, styles.lightIconCircle]}>
                  <feature.icon size={24} color="#1D4ED8" />
                </View>
                <Text style={styles.featureText}>{feature.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sadar Bazaar</Text>
          <View style={styles.featureGrid}>
            {BAZAAR_FEATURES.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureButton}
                onPress={() => handleNavigation(feature.route)}
              >
                <View style={[styles.iconCircle, styles.lightIconCircle]}>
                  <feature.icon size={24} color="#1D4ED8" />
                </View>
                <Text style={styles.featureText}>{feature.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finserv</Text>
          {/* Finserv features will go here */}
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    height :50,
    width:150
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    marginBottom: 60,
  },
  bannerContainer: {
    width: "100%",
    height: 200,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  mainFeatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    marginTop: -20,
    borderRadius: 20,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainFeatureButton: {
    alignItems: "center",
    width: "23%",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 16,
    backgroundColor: "#EFF6FF",
    padding: 8,
    borderRadius: 8,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureButton: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  lightIconCircle: {
    backgroundColor: "#EFF6FF",
  },
  featureText: {
    fontSize: 12,
    textAlign: "center",
    color: "#1F2937",
  },
})

export default HomeScreen
