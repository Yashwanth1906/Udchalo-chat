import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plane, Clock, Calendar } from 'lucide-react-native';
import DATA from './utils/flightData';

const { FLIGHTS, HOLIDAYS, PRODUCTS } = DATA;

const FlightsScreen = () => {
  const renderFlight = ({ item }) => (
    <TouchableOpacity style={styles.flightCard}>
      <View style={styles.airlineInfo}>
        <Text style={styles.airline}>{item.airline}</Text>
        <Text style={styles.flightNumber}>{item.flightNumber}</Text>
      </View>
      
      <View style={styles.routeInfo}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{item.departure}</Text>
          <Text style={styles.city}>{item.from}</Text>
        </View>
        
        <View style={styles.flightPath}>
          <View style={styles.line} />
          <Plane size={20} color="#3B82F6" />
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{item.arrival}</Text>
          <Text style={styles.city}>{item.to}</Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price}</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Available Flights</Text>
      </LinearGradient>

      <FlatList
        data={FLIGHTS}
        renderItem={renderFlight}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
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
  listContainer: {
    padding: 16,
  },
  flightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  airlineInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  airline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  flightNumber: {
    color: '#6B7280',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  city: {
    color: '#6B7280',
    marginTop: 4,
  },
  flightPath: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  bookButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default FlightsScreen; 