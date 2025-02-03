import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, ChevronRight, Clock, CheckCircle } from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import { BottomNav } from './components/BottomNav';

const TAX_SERVICES = [
  {
    id: '1',
    title: 'Income Tax Filing',
    description: 'File your income tax returns easily',
    price: '₹999',
    status: 'Available',
  },
  {
    id: '2',
    title: 'Tax Planning',
    description: 'Get expert advice on tax savings',
    price: '₹1,499',
    status: 'Available',
  },
  // Add more services...
];

const TaxScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Tax Filing</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Clock size={24} color={colors.primary} />
            <Text style={[styles.statusTitle, { color: colors.text }]}>
              FY 2023-24
            </Text>
          </View>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Last date of filing: July 31, 2024
          </Text>
        </View>

        {TAX_SERVICES.map(service => (
          <TouchableOpacity
            key={service.id}
            style={[styles.serviceCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.serviceInfo}>
              <FileText size={24} color={colors.primary} />
              <View style={styles.serviceText}>
                <Text style={[styles.serviceTitle, { color: colors.text }]}>
                  {service.title}
                </Text>
                <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>
                  {service.description}
                </Text>
              </View>
            </View>
            <View style={styles.servicePrice}>
              <Text style={[styles.priceText, { color: colors.primary }]}>
                {service.price}
              </Text>
              <ChevronRight size={20} color={colors.primary} />
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
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 80,
  },
  statusCard: {
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
  },
  serviceCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceText: {
    marginLeft: 12,
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
  },
  servicePrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default TaxScreen; 