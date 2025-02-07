import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (!state.isConnected) {
        router.push("/offlineChat")
        setIsConnected(false);
      } else if (state.type === "wifi" || state.type === "cellular") {
        try {
          const response = await fetch("https://www.google.com", { method: "HEAD" });
          router.push("/showchatrooms")
          setIsConnected(response.ok);
        } catch (error) {
          router.push("/offlineChat")
          setIsConnected(false);
        }
      } else {
        router.push("/offlineChat");
        setIsConnected(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Checking for internet connection....</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
});

export default NetworkStatus;