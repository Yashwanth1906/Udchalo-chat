import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Plane, MessageCircle, ShoppingBag } from 'lucide-react-native';
import { router, usePathname, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

const BottomNav = () => {
  const pathname = usePathname();
  const { colors } = useTheme();
  const NAV_ITEMS: { icon: any; title: string; route: '/' | '/flights' | '/showchatrooms' | '/bazaar' }[] = [
    { icon: Home, title: 'Home', route: '/' },
    { icon: Plane, title: 'Flights', route: '/flights' },
    { icon: MessageCircle, title: 'Chat', route: '/showchatrooms' },
    { icon: ShoppingBag, title: 'Bazaar', route: '/bazaar' },
  ];
  
  return (
    <BlurView intensity={90} style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={[
            styles.navItem,
            pathname === item.route && styles.navItemActive
          ]}
          onPress={() => router.push(item.route)}
        >
          <item.icon
            size={24}
            color={pathname === item.route ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.navText,
              { color: pathname === item.route ? colors.primary : colors.textSecondary }
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </BlurView>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
