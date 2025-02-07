import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import * as ImagePicker from "expo-image-picker";
import Swiper from "react-native-swiper";
import moment from "moment";
import styles from "./styles";
import { useRoute } from "@react-navigation/native";

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
  const [userVisitors, setUserVisitors] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const route = useRoute();
  const { userId } = route.params;
  
  const fetchUserVisitors = async () => {

    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://${app_var.api_host}/users/get_post_visitors?userId=${encodeURIComponent(userId)}`,
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
        setUserVisitors(data.user);
        setPost(data.posts);
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
  const ImageProfile = "";

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
        // console.log("User Dataaa:", user); 
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
    console.log("Received userId:", userId);
    fetchUser();
    fetchUserVisitors();
  }, []);

  const [selectedMenu, setSelectedMenu] = useState("หน้าหลัก"); // เก็บสถานะของเมนูที่เลือก
  

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

  const PostUser = [];
  
    const renderContent = () => {
      post.forEach((item) => {
        PostUser.push({
          PostId: item.post_id,
          Fullname: userVisitors.fullname,
          Img_profile: userVisitors.img_profile,
          Detail: item.post_detail,
          Date: moment(item.post_date).format("D-M-YYYY HH:mm"),
          Img_Post: item.images.map((image) => ({
            url: image.url,
            img_id: image.image_id
          })),
        });
      });
      console.log("asdasdasd", post.images)
      
      if (PostUser.length > 0) {
        return (
          PostUser.map((user, i) => (
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
              <Swiper
                style={stylesIn.swiper}
                showsPagination={true}
                loop={false}
              >
                {user.Img_Post.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img.url }}
                    style={stylesIn.image_body}
                  />
                ))}
              </Swiper>
              <Text style={stylesIn.name_body}>
                {user.Detail || "No Details Available"}
              </Text>
            </View>
          ))
        )
      } else {
        (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            ไม่มีโพสต์
          </Text>
        )
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
        {renderContent()}
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
