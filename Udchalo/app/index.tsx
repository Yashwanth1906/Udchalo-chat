import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { Bell, Search, MessageCircle, Home, Calendar, Moon, Sun, Plane, ShoppingBag, FileText, Building2, Receipt, Bus, Train } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from './context/ThemeContext';

const MAIN_FEATURES = [
  {
    id: '1',
    title: 'Flight Chat',
    icon: MessageCircle,
    color: '#8B5CF6',
    route: '/showchatrooms',
  },
  {
    id: '3',
    title: 'Flights',
    icon: Plane,
    color: '#3B82F6',
    route: '/flights',
  },
  {
    id: '2',
    title: 'Hotels',
    icon: Building2,
    color: '#10B981',
    route: '/hotels',
  },
  
  {
    id: '4',
    title: 'Sadar Bazaar',
    icon: ShoppingBag,
    color: '#F59E0B',
    route: '/bazaar',
  },
  {
    id: '5',
    title: 'Tax Filing',
    icon: FileText,
    color: '#EC4899',
    route: '/tax',
  },
  {
    id: '6',
    title: 'LTC Claims',
    icon: Receipt,
    color: '#6366F1',
    route: '/ltc',
  },
  {
    id: '7',
    title: 'Bus Tickets',
    icon: Bus,
    color: '#14B8A6',
    route: '/bus',
  },
  {
    id: '8',
    title: 'Train Tickets',
    icon: Train,
    color: '#F43F5E',
    route: '/train',
  }
];

const HomeScreen = () => {
  const { colors, theme, toggleTheme } = useTheme();
  
  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <Text style={styles.headerText}>udChalo</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
            {theme === 'light' ? (
              <Moon color="white" size={20} />
            ) : (
              <Sun color="white" size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell color="white" size={20} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05" }} 
            style={styles.bannerImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.bannerOverlay}
          >
            <Text style={styles.bannerText}>Military Travel Made Easy</Text>
            <TouchableOpacity 
              style={[styles.bannerButton, { backgroundColor: colors.primary }]}
              onPress={() => handleNavigation('/flights')}
            >
              <Text style={styles.bannerButtonText}>Book Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.featuresGrid}>
          {MAIN_FEATURES.map(feature => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureButton, { backgroundColor: colors.card }]}
              onPress={() => handleNavigation(feature.route)}
            >
              <View style={[styles.iconCircle, { backgroundColor: feature.color }]}>
                <feature.icon color="white" size={24} />
              </View>
              <Text style={[styles.featureText, { color: colors.text }]}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <BlurView intensity={90} style={styles.bottomNav}>
        <NavItem icon={Home} title="Home" active={true} onPress={() => handleNavigation('/')} />
        <NavItem icon={Plane} title="Flights" onPress={() => handleNavigation('/flights')} />
        <NavItem icon={MessageCircle} title="Chat" onPress={() => handleNavigation('/showchatrooms')} />
        <NavItem icon={ShoppingBag} title="Bazaar" onPress={() => handleNavigation('/bazaar')} />
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

const FeatureButton = ({ title, imageSource, onPress }) => (
  <TouchableOpacity 
    style={styles.featureButton}
    onPress={onPress}
  >
    <LinearGradient
      colors={['#EFF6FF', '#DBEAFE']}
      style={styles.featureGradient}
    >
      <Image source={imageSource} style={styles.featureIcon} />
      <Text style={styles.featureText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const NavItem = ({ icon: Icon, title, active, onPress } : {title : string, active?: boolean, onPress: () => void}) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
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
    width: '30%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  featureGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  featureIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
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
  featuresGrid: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
