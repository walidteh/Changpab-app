import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import * as ImagePicker from "expo-image-picker";
import Swiper from "react-native-swiper";
import moment from "moment";
import { useRoute } from "@react-navigation/native";
import styles from "./styles";
import { Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faBell,
  faUser,
  faBars,
  faArrowLeft,
  faSquarePlus,
  faCamera,
  faFontAwesome,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const PhotoDetailPost = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userVisitors, setUserVisitors] = useState({});
  const [post, setPost] = useState([]);
  const HostInfo = [
    { platform: "facebook", icon: faFacebook, color: "#1877f2" },
    { platform: "instagram", icon: faInstagram, color: "#f56949" },
    { platform: "phone", icon: faPhone, color: "#34A853" },
    { platform: "email", icon: faEnvelope, color: "#d44638" },
    { platform: "default", icon: faEnvelope, color: "#000000" },
  ];
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const route = useRoute();
  const { postId } = route.params;
  const { userId } = route.params;
  const [selectedDropdown, setSelectedDropdown] = useState(null);

  const [isFullView, setIsFullView] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // เก็บ index ของภาพที่เลือก
  const [selectedImages, setSelectedImages] = useState([]); // เก็บรูปทั้งหมดในโพสต์

  // ฟังก์ชันเปิด FullView
  const openFullView = (imgList, index) => {
    setSelectedImages(imgList);
    setSelectedIndex(index);
    setIsFullView(true);
  };

  // ฟังก์ชันปิด FullView
  const closeFullView = () => {
    setIsFullView(false);
    setSelectedImages([]);
    setSelectedIndex(0);
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

  const fetchUserVisitors = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://${
          app_var.api_host
        }/users/get_user_visitors?userId=${encodeURIComponent(userId)}`,
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
        setUserVisitors(data.userVisitors);
        // console.log("User Dataaa:", userVisitors.fullname);
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

  const fetchPostVisitors = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://${
          app_var.api_host
        }/users/post_visitor?postId=${encodeURIComponent(postId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched Data:", data); // ดูข้อมูลทั้งหมดที่ได้รับจาก API

      if (data.status === "OK") {
        setPost(data.post);
      } else {
        alert("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data");
    }
  };

  const PostUser = [];

  var contactData = [];

  useEffect(() => {
    console.log("postId >>> :", postId);
    console.log("userId >>> :", userId);
    fetchUserVisitors();
    fetchPostVisitors();
    fetchUser();
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
      await AsyncStorage.removeItem("@token");
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.log("Token removed successfully");
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "login" }],
      });
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  };

  const renderPost = () => {
    if (post && Array.isArray(post) && post.length > 0) {
      const postDetails = post[0];
      console.log("Post Details:", postDetails);
      console.log("Images Data:", postDetails.images);

      PostUser.push({
        PostId: postDetails.post_id,
        Fullname: userVisitors.fullname,
        Img_profile: userVisitors.img_profile,
        Detail: postDetails.post_detail,
        Date: moment(postDetails.post_date).format("D-M-YYYY ( HH:mm น.)"),
        Img_Post:
          postDetails.images && Array.isArray(postDetails.images)
            ? postDetails.images.map((image) => ({
                url: image.url,
                img_id: image.image_id,
              }))
            : [],
      });

      return PostUser.length > 0 ? (
        PostUser.map((user, i) => (
          <View key={i} style={stylesIn.item}>
            <View>
              <TouchableOpacity
                key={i}
                style={stylesIn.profile_header}
                onPress={() => {
                  navigation.navigate("PhotoDetailUser", { userId: userVisitors.user_id });
                }}
              >
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
                </TouchableOpacity>
            </View>
            <Swiper style={stylesIn.swiper} showsPagination={true} loop={false}>
              {user.Img_Post && user.Img_Post.length > 0 ? (
                user.Img_Post.map((item, index) => (
                  <View key={index} style={stylesIn.item}>
                    <Image
                      source={{ uri: item.url }}
                      style={stylesIn.image_body}
                    />
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  ไม่มีรูปภาพ
                </Text>
              )}
            </Swiper>
            <Text style={stylesIn.name_body}>
              {user.Detail || "No Details Available"}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>ไม่มีโพสต์</Text>
      );
    } else {
      return (
        <Text style={{ textAlign: "center", marginTop: 20 }}>ไม่มีโพสต์</Text>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.leftBox}>
          <Text style={styles.titleTop}>CHANGPAB</Text>
        </View>
        <View style={styles.rightBox}>
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

      <ScrollView>
        <View style={stylesIn.content}>
          <View style={styles.exit}>
            <TouchableOpacity
              style={styles.exitIcon}
              onPress={() => navigation.goBack()}
            >
              <FontAwesomeIcon icon={faArrowLeft} size={18} color="#000" />
            </TouchableOpacity>
            <Text style={styles.exitText}>รายละเอียดโพสต์</Text>
          </View>
          <View style={stylesIn.body}>{renderPost()}</View>
        </View>
      </ScrollView>

      <Modal visible={isFullView} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={closeFullView}>
          <View style={stylesIn.fullViewContainer}>
            <View style={stylesIn.swiperContainer}>
              <Swiper
                index={selectedIndex} // ให้เริ่มที่รูปที่เลือก
                loop={false}
                showsPagination={true} // แสดงตัวเลขหรือจุด pagination
                onIndexChanged={(index) => setSelectedIndex(index)} // อัปเดต index เมื่อสไลด์
              >
                {selectedImages.map((img, index) => (
                  <View key={index} style={stylesIn.fullViewSlide}>
                    <Image
                      source={{ uri: img }}
                      style={stylesIn.fullViewImage}
                    />
                  </View>
                ))}
              </Swiper>
              {/* แสดงตำแหน่งของรูปที่กำลังแสดง */}
              <Text style={stylesIn.imagePositionText}>
                {`Image ${selectedIndex + 1} of ${selectedImages.length}`}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    width: "100%",
    height: "120%",
    // marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  profile_header: {
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profile_post: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  name_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date_text: {
    fontSize: 12,
    color: "#888",
  },
  swiper: {
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
  },
  image_body: {
    width: "100%", // ปรับรูปให้เต็มความกว้างของกล่องg
    aspectRatio: 1.5, // กำหนดอัตราส่วนภาพ เช่น 1.5 สำหรับภาพแนวนอน
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "contain", // ปรับการแสดงผลของรูปภาพ
  },
  name_body: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
    // marginTop: 10,
  },
  fullViewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullViewSlide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullViewImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  imagePositionText: {
    position: "absolute",
    top: 20, // ระยะห่างจากขอบบน
    left: "50%", // จัดกลาง
    // transform: [{ translateX: -50% }], // ทำให้ข้อความอยู่กลางจริงๆ
    color: "white", // สีตัวอักษร
    fontSize: 18, // ขนาดตัวอักษร
    zIndex: 1, // ให้ข้อความอยู่ข้างหน้าภาพ
  },
});

export default PhotoDetailPost;
