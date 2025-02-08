// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import TopBar from "../components/TopBar";
// import BottomNav from "../components/BottomNav";

// const adjectives = ["Brave", "Clever", "Mighty", "Swift", "Bold", "Fierce", "Gentle", "Loyal", "Witty", "Charming"];
// const animals = ["Tiger", "Fox", "Eagle", "Wolf", "Panda", "Bear", "Hawk", "Cobra", "Otter", "Jaguar"];
// const UsernameScreen = () => {
//   const [username, setUsername] = useState("");

//   const getRandomUsername = () => {
//     const firstName = adjectives[Math.floor(Math.random() * adjectives.length)];
//     const lastName = animals[Math.floor(Math.random() * animals.length)];
//     setUsername(firstName + " " + lastName);
//   };
//   const saveUsername = async (name) => {
//     if (!name.trim()) {
//       alert("Username cannot be empty!");
//       return;
//     }
//     await AsyncStorage.setItem("username", name);
//     router.push("/chatconnection");
//   };

//   return (
//     <View style={styles.container}>
//       <TopBar/>
//         <Text style={styles.title}>Choose Your Username</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Username"
//           value={username}
//           onChangeText={setUsername}
//         />
//         <TouchableOpacity style={styles.button} onPress={() => saveUsername(username)}>
//           <Text style={styles.buttonText}>Set Username</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => getRandomUsername()}>
//           <Text style={styles.buttonText}>Get Random Username</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => saveUsername(username)}>
//           <Text style={styles.buttonText}>Save</Text>
//         </TouchableOpacity>
//       <BottomNav/>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   input: { width: "90%", padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5, marginBottom: 10 },
//   button: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginVertical: 5 },
//   buttonText: { color: "white", fontWeight: "bold" },
// });

// export default UsernameScreen;

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const adjectives = ["Brave", "Clever", "Mighty", "Swift", "Bold", "Fierce", "Gentle", "Loyal", "Witty", "Charming"];
const animals = ["Tiger", "Fox", "Eagle", "Wolf", "Panda", "Bear", "Hawk", "Cobra", "Otter", "Jaguar"];

const UsernameScreen = () => {
  const [username, setUsername] = useState("");

  const getRandomUsername = () => {
    const firstName = adjectives[Math.floor(Math.random() * adjectives.length)];
    const lastName = animals[Math.floor(Math.random() * animals.length)];
    setUsername(firstName + " " + lastName);
  };

  const saveUsername = async (name: string) => {
    if (!name.trim()) {
      alert("Username cannot be empty!");
      return;
    }
    await AsyncStorage.setItem("username", name);
    router.push("/chatconnection");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={"#aaa"}
      />

      <TouchableOpacity style={styles.button} onPress={() => saveUsername(username)}>
        <Text style={styles.buttonText}>Set Username</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={getRandomUsername}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Get Random Username</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => saveUsername(username)}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9", // Soft background for contrast
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    marginVertical: 7,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "blue",
  },
  secondaryButtonText: {
    color: "blue",
  },
});

export default UsernameScreen;
