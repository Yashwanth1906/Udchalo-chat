import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { Bell, Search, MessageCircle, Home, Calendar, DollarSign, Menu } from "lucide-react-native";
import { Link, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <Text style={styles.headerText}>udChalo</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell color="white" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Search color="white" size={20} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Hero Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05" }} 
            style={styles.bannerImage} 
          />
          <BlurView intensity={80} style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Discover Amazing Flights</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Book Now</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        <Section title="Services">
          <FeatureButton title="Flights" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="Flight ChatRoom" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/showchatrooms"/>
          <FeatureButton title="Chhawani Plotting" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="Sadar Bazaar" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="Tax Filing" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
        </Section>

        {/* Travel Section */}
        <Section title="Travel">
          <FeatureButton title="Flights" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="Claimable Tickets" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="Holidays" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
        </Section>

        {/* Sadar Bazaar Section */}
        <Section title="Sadar Bazaar">
          <FeatureButton title="Electronics" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="Clothing" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="E Scooter" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
          <FeatureButton title="Decor" imageSource={{ uri: "https://via.placeholder.com/40" }} redirect="/"/>
        </Section>
      </ScrollView>
      
      {/* Floating Bottom Navigation */}
      <BlurView intensity={90} style={styles.bottomNav}>
        <NavItem icon={Home} title="Home" active={true} />
        <NavItem icon={Calendar} title="Bookings" />
        <NavItem icon={DollarSign} title="UC Earnings" />
        <NavItem icon={MessageCircle} title="Chat" />
        <NavItem icon={Menu} title="Menu" />
      </BlurView>
    </View>
  );
};

const Section = ({ title, children } : {title : string,children : any}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.featureRow}>{children}</View>
  </View>
);

const FeatureButton = ({ title, imageSource,redirect }:{title : string, imageSource : {uri : string},redirect:string}) => (
  <>
      <TouchableOpacity style={styles.featureButton} onPress={()=>router.push(redirect)}>
        <Image source={imageSource} style={styles.featureIcon} />
        <Text>{title}</Text>
      </TouchableOpacity>
  </>
);

const NavItem = ({ icon: Icon, title, active } : {title : string, active?: boolean}) => (
  <TouchableOpacity style={styles.navItem}>
    <Icon size={20} color="#1F2937" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "System",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginBottom: 70,
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bannerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bannerButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  featureButton: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    width: '30%',
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  featureIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 12,
  },
  navText: {
    fontSize: 12,
    color: "#1F2937",
    marginTop: 4,
    fontWeight: "500",
  },
});

export default HomeScreen;
