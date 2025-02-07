import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

interface ChatRooms {
    id: number;
    flightId: string;
    name: string;
}

const ChatRooms = () => {
    const navigation = useNavigation();
    const { flightName = "Indigo", flightId = "AI302",username = "John Doe" } = useLocalSearchParams<{ flightName?: string; flightId?: string,username : string }>();
    const [chatrooms, setChatRooms] = useState<ChatRooms[]>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            console.log(flightId,flightName,username);
            try {
                const res = await axios.post(`${BACKEND_URL}/api/admin/getrooms`, { flightId });
                console.log(res.data);
                if (res.data.success && Array.isArray(res.data.rooms)) {
                    setChatRooms(res.data.rooms);
                } else {
                    alert("No rooms found");
                    router.push("/showchatrooms");
                }
            } catch (error) {
                console.error("Error fetching chat rooms:", error);
            }
        };
        fetchChatRooms();
    }, [flightId]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Chat Rooms</Text>
            <FlatList
                data={chatrooms ?? []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.flight}>{item.name}</Text> 
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.push(`/chatroom?roomId=${item.id}&roomName=${item.name}`)}
                        >
                            <Text style={styles.buttonText}>Join Chat</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { padding: 16, marginBottom: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
  flight: { fontSize: 16, fontWeight: 'bold' },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
});

export default ChatRooms;
