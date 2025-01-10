import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faHouse,
  faMagnifyingGlass,
  faBell,
  faUser,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

const PhotoAllphotographer = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userAll, setUserAll] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false); // Declare refreshing state

  const handlePress = () => {
    navigation.navigate("Profile");
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
        // console.log(data.userId[0].Img_profile);
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

  useEffect(() => {
    fetchUser();
    fetchAllUser();
  }, []);

  const PhotoIdex = () => {
    navigation.navigate("PhotoIndex");
  };

  const PhotoSearce = () => {
    navigation.navigate("PhotoSearce");
  };

  const PhotoNotify = () => {
    navigation.navigate("PhotoNotify");
  };

  const PhotoProfile = () => {
    navigation.navigate("PhotoProfile");
  };

  const PhotoAdd = () => {
    navigation.navigate("PhotoIndex");
  };
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.leftBox}>
          <Text style={styles.titleTop}>CHANGPAB</Text>
        </View>
        <View style={styles.profileContainer}>
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
              <Text style={styles.infoText}>
                {user.Fullname || "No Fullname Available"}{" "}
                {user.Lastname || "No Lastname Available"}
              </Text>
              <Text style={styles.infoText}>
                {user.Email || "No Email Available"}
              </Text>
              <Text style={styles.infoText}>
                Username: {user.Username || "No Username Available"}
              </Text>
              <Button
                title="Logout"
                onPress={async () => {
                  try {
                    // ลบ token ออกจาก AsyncStorage
                    await AsyncStorage.removeItem("@token");

                    // ตรวจสอบว่า token ถูกลบออกจริง ๆ
                    const token = await AsyncStorage.getItem("@token");
                    if (!token) {
                      console.log("Token removed successfully");
                    }

                    // นำทางไปยังหน้า login
                    navigation.navigate("login");
                  } catch (error) {
                    console.error("Error clearing token:", error);
                  }
                }}
              />
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
        <Text style={styles.exitText}>ช่างภาพทั้งหมด</Text>
      </View>

      {/* รูป */}
      <ScrollView>
        <View style={styles.body}>
          {userAll.map((user, i) => (
            <TouchableOpacity
              key={i}
              style={styles.item}
              onPress={() => onPress('')}
            >
              <Image source={{ uri: user.Img_profile }} style={styles.image_body} />
              <Text style={styles.name}>{user.Fullname || "No Fullname Available"}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* เมนูด้านล่าง */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoIdex}>
          <FontAwesomeIcon icon={faHouse} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoSearce}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoAdd}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80, // ชดเชยความสูงของ Navbar
  },
  profileContainer: {
    alignItems: "center",
    top: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 2,
  },
  dropdown: {
    position: "absolute",
    borderColor: "red",
    borderWidth: 1,
    top: 60,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 5,
    padding: 10,
    alignItems: "center",
    width: 220,
    right: 0,
    zIndex: 100,
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90, // ความสูงของ Navbar
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30, // เพิ่มระยะด้านบนสำหรับ SafeArea
    paddingBottom: 10,
    zIndex: 1000,
  },
  leftBox: {
    flex: 1,
  },
  rightBox: {
    flex: 1,
    alignItems: "flex-end",
  },
  logo_user: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  titleTop: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exit: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  exitIcon: {
    marginRight: 8,
    marginLeft: 10,
  },
  exitText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  // ตัวอย่างรูปภาพ
  body: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap", // จัดเรียงหลายคอลัมน์
    justifyContent: "space-between",
  },
  item: {
    width: "48%", // ขนาดกล่อง 48% เพื่อให้มีระยะห่างระหว่างกล่อง
    aspectRatio: 1, // ทำให้กล่องเป็นสี่เหลี่ยมจัตุรัส
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // สำหรับ Android
  },
  image_body: {
    width: "70%",
    height: "70%",
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  // เมนูด้านล่าง
  menu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: -10 }], // ดันขึ้นครึ่งหนึ่งของความสูงเมนู
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around", // จัดวางไอเท็มให้มีระยะห่างเท่ากัน
    alignItems: "center",
    borderRadius: 100,
    marginHorizontal: 16, // เพิ่มขอบซ้ายขวา
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5, // สำหรับ Android
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PhotoAllphotographer;
