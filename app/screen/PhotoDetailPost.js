import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import * as ImagePicker from "expo-image-picker";
import Swiper from "react-native-swiper";
import moment from "moment";
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

const PhotoDetailPost = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userAll, setUserAll] = useState([]);
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownToggle = (index) => {
    setSelectedDropdown(selectedDropdown === index ? null : index); // เปิด/ปิดเมนู
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

  const fetchAllPost = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        "http://" + app_var.api_host + "/users/get_post_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "OK") {
        setPost(data.post);
        console.log(post);
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

  const [refreshing, setRefreshing] = useState(false); // Declare refreshing state
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
  useEffect(() => {
    fetchUser();
    fetchAllUser();
    fetchAllPost();
  }, []);

  const [selectedMenu, setSelectedMenu] = useState("หน้าหลัก"); // เก็บสถานะของเมนูที่เลือก

  const PostUser = [
    {
      Img_profile: "https://via.placeholder.com/45",
      Fullname: "Test User",
      Date: moment().format("DD/MM/YYYY"),
      Img_Post: ["https://via.placeholder.com/200", "https://via.placeholder.com/200"],
      Detail: "This is a test post",
      PostId: "1",
    },
  ];
  

  const DeletePost = async (post_id) => {
    Alert.alert("ระบบ", "ต้องการลบโพสต์หรือไม่", [
      {
        text: "ยกเลิก",
        onPress: () => {
          return
        },
      },
      {
        text: "ตกลง",
        onPress: async () => {
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
              "/users/delete_post?postId=" +
              encodeURIComponent(post_id),
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await response.json();
            console.log(data.status)
            navigation.reset({
              index: 0,
              routes: [{ name: "PhotoProfile" }],
            });
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while searching.");
          }
        },
      },
    ]);
    console.log(post_id)
  }

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

  const images = [
    { uri: require("../assets/fb.png") },
    { uri: require("../assets/photographer/kasut buruk.png") },
    { uri: require("../assets/photographer/mee suhaimi photo.jpg") },
    { uri: require("../assets/photographer/miniphotographer.jpg") },
    { uri: require("../assets/photographer/hilmee photographer.jpg") },
  ];

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
        <Text style={styles.exitText}>รายละเอียดโพสต์</Text>
      </View>

      <View style={stylesIn.body}>
        {PostUser.map((user, i) => (
          <View key={i} style={stylesIn.item}>
            <View style={stylesIn.profile_header}>
              <Image
                source={{
                  uri: user.Img_profile,
                }}
                style={stylesIn.profile_post}
              />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {user.Fullname}
                </Text>
                <Text style={{ fontSize: 10, color: "#888888" }}>
                  {user.Date}
                </Text>
              </View>
            </View>

            <View style={stylesIn.dropdownMenu}>
              <TouchableOpacity
                onPress={() => handleDropdownToggle(i)}
              >
                <Text style={stylesIn.dropdownIcon}>⋯</Text>
              </TouchableOpacity>
              {selectedDropdown === i && (
                <View style={stylesIn.dropdownPost}>
                  <TouchableOpacity onPress={() => (i)}>
                    <Text style={stylesIn.dropdownItem}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => DeletePost(user.PostId)}>
                    <Text
                      style={[
                        stylesIn.dropdownItem,
                        stylesIn.dropdownItemLast,
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Swiper
              style={styles.swiper}
              showsPagination={true}
              loop={false}
            >
              {user.Img_Post.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.image_body}
                />
              ))}
            </Swiper>
            <Text style={styles.name_body}>
              {user.Detail || "No Fullname Available"}
            </Text>
          </View>
        ))}
      </View>

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
  body: {
    flex: 1,
    padding: 10,
  },
  item: {
    width: "100%", // ใช้ 100% เพื่อให้เต็มความกว้างของ container
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    // alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // เฉพาะ Android
    padding: 10,
  },

  profile_header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profile_post: {
    width: 45, // ขนาดโลโก้
    height: 45,
    borderRadius: 50, // รูปทรงกลม
    marginRight: 10,
  },

  dropdownMenu: {
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 1,
  },
  dropdownIcon: {
    fontSize: 24,
    color: '#888888',
  },
  dropdownPost: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 30,
    elevation: 5,
    width: 120,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: '#333333',
  },
});

export default PhotoDetailPost;
