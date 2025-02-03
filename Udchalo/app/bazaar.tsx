import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, ChevronRight, Search } from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import { BottomNav } from './components/BottomNav';

const CATEGORIES = [
  { id: '1', name: 'Electronics', icon: '🔌' },
  { id: '2', name: 'Clothing', icon: '👕' },
  { id: '3', name: 'Home Decor', icon: '🏠' },
  { id: '4', name: 'Sports', icon: '⚽' },
  { id: '5', name: 'Books', icon: '📚' },
];

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Military Grade Smart Watch',
    price: '₹4,999',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Tactical Combat Boots',
    price: '₹2,499',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    category: 'Clothing',
  },
  {
    id: '3',
    name: 'Military Backpack',
    price: '₹1,999',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    category: 'Accessories',
  },
];

const DEALS = [
  {
    id: '1',
    name: 'Combat Gear',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1578584099737-2a23864cfd89',
  },
  {
    id: '2',
    name: 'Electronics',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
  },
];

const BazaarScreen = () => {
  const { colors } = useTheme();

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, { backgroundColor: colors.card }]}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = (product) => (
    <TouchableOpacity
      key={product.id}
      style={[styles.productCard, { backgroundColor: colors.card }]}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
        <Text style={[styles.productPrice, { color: colors.primary }]}>{product.price}</Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color="#F59E0B" fill="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
            {product.rating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Sadar Bazaar</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map(renderCategory)}
        </ScrollView>

        {/* Deals Section */}
        <View style={styles.dealsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Special Deals</Text>
            <TouchableOpacity style={styles.viewAll}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DEALS.map(deal => (
              <TouchableOpacity
                key={deal.id}
                style={styles.dealCard}
              >
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.dealOverlay}
                >
                  <Text style={styles.dealName}>{deal.name}</Text>
                  <Text style={styles.dealDiscount}>{deal.discount}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.productsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
            <TouchableOpacity style={styles.viewAll}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {FEATURED_PRODUCTS.map(renderProduct)}
          </View>
        </View>
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
    marginBottom: 80,
  },
  categoriesContainer: {
    padding: 16,
  },
  categoryCard: {
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
  },
  dealsContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    marginRight: 4,
    fontWeight: '500',
  },
  dealCard: {
    width: 280,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  dealName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dealDiscount: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  productsContainer: {
    padding: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
  },
});

export default BazaarScreen; 