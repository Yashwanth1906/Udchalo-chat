// import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
// import { Bell, User } from "lucide-react-native";

// const TopBar = () => {
//   return (
//     <View style={styles.header}>
//       <Image 
//         source={{ uri: "https://businessnewsthisweek.com/wp-content/uploads/2022/01/udChalo.jpg" }} 
//         style={styles.logo} 
//         resizeMode="cover"
//       />
//       <View style={styles.headerIcons}>
//         <TouchableOpacity style={styles.iconButton}>
//           <Bell color="#000" size={24} />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconButton}>
//           <User color="#000" size={24} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     paddingTop: 48,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   logo: {
//     height: 50,
//     width: 150,
//   },
//   headerIcons: {
//     flexDirection: "row",
//     gap: 16,
//   },
//   iconButton: {
//     padding: 8,
//   },
// });

// export default TopBar;

import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Bell, User } from "lucide-react-native";

const TopBar = () => {
  return (
    <View style={styles.header}>
      <Image 
        source={{ uri: "https://businessnewsthisweek.com/wp-content/uploads/2022/01/udChalo.jpg" }} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Bell color="#000" size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <User color="#000" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingTop: 32,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    height: 40,
    width: 120,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 6,
  },
});

export default TopBar;
