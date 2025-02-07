import { View, Image } from "react-native";
import { Text } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const Tab = createMaterialTopTabNavigator();

const NoBookings = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image 
                source={{ uri: 'https://example.com/dog-image.png' }} 
                style={{ width: 150, height: 150 }} 
            />
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>No bookings found!</Text>
        </View>
    );
};

const Bookings: React.FC = () => {
    return (
        <View style={{ flex: 1 }}>
            <TopBar/>
            <Tab.Navigator 
                screenOptions={{
                    tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
                    tabBarIndicatorStyle: { backgroundColor: 'green' },
                    tabBarActiveTintColor: 'green',
                    tabBarInactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="Upcoming" component={NoBookings} />
                <Tab.Screen name="Completed" component={NoBookings} />
                <Tab.Screen name="Cancelled" component={NoBookings} />
                <Tab.Screen name="Failed" component={NoBookings} />
            </Tab.Navigator>
            <BottomNav/>
        </View>
    );
};

export default Bookings;
