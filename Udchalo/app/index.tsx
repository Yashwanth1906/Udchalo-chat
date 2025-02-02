import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { Bell, Search, MessageCircle, Home, Calendar, DollarSign, Menu } from "lucide-react-native";
import { Link, router } from "expo-router";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>udChalo</Text>
        <View style={styles.headerIcons}>
          <Bell color="white" size={20} />
          <Search color="white" size={20} />
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.bannerContainer}>
          <Image source={{ uri: "https://via.placeholder.com/350x150" }} style={styles.bannerImage} />
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

const NavItem = ({ icon: Icon, title } : {title : string}) => (
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

  },
  bannerContainer: {
    margin: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 150,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  featureButton: {
    padding: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    height:55,
    width: 55,
    alignItems: "center",
  },
  featureIcon: {
    width: 10,
    height: 10,
    marginBottom: 5,
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

export default HomeScreen;
