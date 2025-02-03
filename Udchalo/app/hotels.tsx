import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, MapPin, Calendar, Search } from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import  BottomNav  from './components/BottomNav';

const HOTELS = [
  {
    id: '1',
    name: 'Military Officers Mess',
    location: 'Delhi Cantonment',
    rating: 4.5,
    price: '₹2,500',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    amenities: ['Parking', 'Restaurant', 'Gym'],
  },
  {
    id: '2',
    name: 'Air Force Guest House',
    location: 'Vasant Vihar',
    rating: 4.3,
    price: '₹3,200',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
    amenities: ['WiFi', 'Pool', 'Restaurant'],
  },
  // Add more hotels...
];

const HotelsScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Military Hotels</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {HOTELS.map(hotel => (
          <TouchableOpacity
            key={hotel.id}
            style={[styles.hotelCard, { backgroundColor: colors.card }]}
          >
            <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
            <View style={styles.hotelInfo}>
              <Text style={[styles.hotelName, { color: colors.text }]}>{hotel.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color={colors.primary} />
                <Text style={[styles.location, { color: colors.textSecondary }]}>
                  {hotel.location}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={[styles.rating, { color: colors.textSecondary }]}>
                  {hotel.rating}
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: colors.primary }]}>{hotel.price}</Text>
                <Text style={[styles.perNight, { color: colors.textSecondary }]}>/night</Text>
              </View>
              <View style={styles.amenitiesContainer}>
                {hotel.amenities.map((amenity, index) => (
                  <Text 
                    key={index} 
                    style={[styles.amenity, { backgroundColor: colors.primary + '20' }]}
                  >
                    {amenity}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 80,
  },
  hotelCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  perNight: {
    marginLeft: 4,
    fontSize: 14,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenity: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
});

export default HotelsScreen; 