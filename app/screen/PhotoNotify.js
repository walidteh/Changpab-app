import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons"; // ใช้ icon ของ Expo

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faTimes,
  faMagnifyingGlass,
  faArrowLeft,
  faHouse,
  faBell,
  faUser,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

const PhotoNotify = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userAll, setUserAll] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usersInterests, setUsersInterests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const openMessage = (message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const fetchAllUser = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        "http://" + app_var.api_host + "/users/get_all_user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "ok") {
        setUserAll(data.userId);
      } else {
        alert("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        "http://" + app_var.api_host + "/users/get_user_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "ok") {
        setUser(data.userId);
        fetchUserInterest(data.userId.ID);
      } else {
        alert("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInterest = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("@token");
      const url = `http://${
        app_var.api_host
      }/users/get_users_interests?userId=${encodeURIComponent(userId)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("📌 Users Interests Data:", data); // Debug log
      setUsersInterests(data); // เช็คว่ามันเซ็ต state จริงมั้ย
    } catch (error) {
      console.error("❌ Error fetching interested users:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAllUser();
  }, []);

  const PhotoIdex = () => {
    navigation.navigate("PhotoIndex");
  };

  const PhotoSearce = () => {
    navigation.navigate("PhotoSearch");
  };

  const PhotoNotify = () => {
    navigation.navigate("PhotoNotify");
  };

  const PhotoProfile = () => {
    navigation.navigate("PhotoProfile");
  };

  const PhotoPost = () => {
    navigation.navigate("PhotoPost");
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = async () => {
    try {
      // ลบ token ออกจาก AsyncStorage
      await AsyncStorage.removeItem("@token");

      // ตรวจสอบว่า token ถูกลบออกจริง ๆ
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.log("Token removed successfully");
      }

      // รีเซ็ตการนำทางไปยังหน้า login
      navigation.reset({
        index: 0,
        routes: [{ name: "login" }], // เปลี่ยน 'Login' เป็นชื่อของหน้า Login ที่คุณใช้
      });
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.leftBox}>
          <Text style={styles.titleTop}>CHANGPAB</Text>
        </View>
        <View style={styles.rightBox}>
          {/* กดที่รูปโปรไฟล์เพื่อแสดง dropdown */}
          <TouchableOpacity onPress={toggleDropdown}>
            <Image
              source={{
                uri: user.Img_profile,
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>

          {/* แสดง dropdown */}
          {isDropdownVisible && (
            <View style={styles.dropdown}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{
                    uri: user.Img_profile,
                  }}
                  style={styles.profileImage}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.infoText}>
                    {user.Fullname || "No Fullname Available"}{" "}
                    {user.Lastname || "No Lastname Available"}
                  </Text>
                  <Text style={styles.emailText}>
                    {user.Email || "No Email Available"}
                  </Text>
                  <Text style={styles.infoText}>
                    Username : {user.Username || "No Username Available"}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "center", marginTop: 15 }}>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ย้อนกลับ */}
      <View style={styles.exit}>
        <TouchableOpacity
          style={styles.exitIcon}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.exitText}>แจ้งเตือน</Text>
      </View>

      {/*เนื้อหา*/}
      <ScrollView style={styles.container}>
        {usersInterests.map((item, i) => (
          <View key={i} style={stylesIn.card}>
            <Image
              source={{ uri: item.img_profile }}
              style={stylesIn.profileImage}
            />
            <View style={stylesIn.textContainer}>
              <Text style={stylesIn.name}>{item.fullname}</Text>
            </View>
            <TouchableOpacity onPress={() => openMessage(item.message)}>
              <Ionicons name="mail-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={stylesIn.modalContainer}>
            <View style={stylesIn.modalContent}>
              <Text style={stylesIn.modalTitle}>สนใจติดต่องาน</Text>
              <Text style={stylesIn.modalMessage}>{selectedMessage}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={stylesIn.closeButton}
              >
                <Text>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* เมนูด้านล่าง */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoIdex}>
          <FontAwesomeIcon icon={faHouse} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoSearce}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoPost}>
          <FontAwesomeIcon icon={faSquarePlus} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoNotify}>
          <FontAwesomeIcon icon={faBell} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoProfile}>
          <FontAwesomeIcon icon={faUser} size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const stylesIn = StyleSheet.create({
  message: {
    marginBottom: 80,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sub: {
    fontSize: 15,
    marginBottom: 10,
  },
  item: {
    width: "100%", // กำหนดให้กล่องแต่ละอันครึ่งหนึ่งของหน้าจอ
    backgroundColor: "#f9f9f9",
    borderWidth: 1, // ความกว้างของเส้นขอบ
    borderColor: "#ddd", // สีของเส้นขอบ
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  // card: {
  //   padding: 10,
  //   backgroundColor: "#fff",
  //   marginBottom: 10,
  //   borderRadius: 10,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  textContainer: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    // alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalMessage: { fontSize: 16, marginBottom: 20,},
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    // fontWeight: 'bold',
  },
});

export default PhotoNotify;
