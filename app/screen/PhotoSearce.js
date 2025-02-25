import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import styles from "./styles";

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

const PhotoSearch = () => {
  const [text, setText] = useState("");
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userAll, setUserAll] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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

  const searchUser = async (keyword) => {
    setUserAll([]);
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      // กำหนด URL ที่ส่ง parameter keyword ไปกับ GET request
      const response = await fetch(
        "http://" +
        app_var.api_host +
        "/users/search?keyword=" +
        encodeURIComponent(keyword),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "OK") {
        setUserAll(data.users);
      } else {
        alert("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while searching.");
    }
  };

  const clearText = () => {
    fetchAllUser();
    setText("");
  };

  const navigation = useNavigation();

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
  }

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
              <View style={{ flexDirection: 'row' }}>
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
              <View style={{ alignItems: 'center', marginTop: 15 }}>
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
        <Text style={styles.exitText}>ค้นหาช่างภาพ</Text>
      </View>

      {/* Search Bar */}
      <View style={stylesIn.search}>
        <TextInput
          placeholder="Search"
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => searchUser(text)}
          style={stylesIn.bttsearch}
        />
        {text.length === 0 && (
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={20}
            color="#B7B7B7"
            style={stylesIn.searchIcon}
          />
        )}
        {text.length > 0 && (
          <TouchableOpacity style={stylesIn.clearButton} onPress={clearText}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#333" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 15 }}
        >
          <TouchableOpacity style={stylesIn.boxfillter}>
            <Text>แต่งงาน</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesIn.boxfillter}>
            <Text>พรีเวดดิ้ง</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesIn.boxfillter}>
            <Text>แต่งงาน</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesIn.boxfillter}>
            <Text>ถ่ายแบบ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesIn.boxfillter}>
            <Text>ถ่ายรูป</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.body}>
          {userAll.map((item, i) => (
            <TouchableOpacity key={i} style={styles.item} onPress={() => {
              navigation.navigate("PhotoDetailUser", { userId: item.ID , userLoginId: user.ID });
            }}>
              <Image
                source={{ uri: item.Img_profile }}
                style={styles.image_body}
              />
              <Text style={styles.name}>
                {item.Fullname || "No Fullname Available"}
              </Text>
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
  search: {
    width: "90%",
    alignSelf: "center",
    position: "relative", // เพื่อให้ไอคอนอยู่ในตำแหน่งที่เหมาะสม
  },
  searchIcon: {
    position: "absolute",
    right: 15, // ตำแหน่งไอคอนค้นหาที่ด้านซ้าย
    top: "50%",
    transform: [{ translateY: -10 }], // ไอคอนอยู่กลางแนวตั้ง
  },
  bttsearch: {
    width: "100%",
    height: 45,
    backgroundColor: "#EEECEC",
    borderRadius: 10,
    paddingLeft: 15, // เพิ่มช่องว่างให้ข้อความไม่ทับไอคอนค้นหา
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    position: "absolute",
    right: 10, // ตำแหน่งไอคอนลบที่ด้านขวา
    top: "50%",
    transform: [{ translateY: -10 }], // ไอคอนอยู่กลางแนวตั้ง
  },

  boxfillter: {
    width: 100,
    height: 35,
    borderRadius: 100,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginTop: 15,
    // marginBottom: 18,
  },
});

export default PhotoSearch;
