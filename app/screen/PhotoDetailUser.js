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

const PhotoDetailUser = ({ navigation }) => {
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
  const [contactInfo, setContactInfo] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [rateInfo, setRateInfo] = useState([]);
  const route = useRoute();
  const { userId } = route.params;

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
        }/users/get_post_visitors?userId=${encodeURIComponent(userId)}`,
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
        setRateInfo(data.userRate);
        setContactInfo(data.userContact);
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

  var contactData = [];

  const ImageProfile = "";

  useEffect(() => {
    console.log("Received userId:", userId);
    fetchUserVisitors();
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
          img_id: image.image_id,
        })),
      });
    });
    contactInfo.forEach((item) => {
      var temp = {};
      for (let i of HostInfo) {
        if (i.platform == item.Contact_host) {
          temp = i;
        }
      }
      if (temp !== undefined) {
        contactData.push({
          id: item.ID,
          contact_name: item.Contact_name,
          contact_link: item.Contact_link,
          contact_icon: temp.icon,
          contact_color: temp.color,
        });
      }
    });
    console.log(PostUser[0]);
    if (PostUser.length > 0) {
      return PostUser.map((user, i) => (
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
          <Swiper style={stylesIn.swiper} showsPagination={true} loop={false}>
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
      ));
    } else {
      <Text style={{ textAlign: "center", marginTop: 20 }}>ไม่มีโพสต์</Text>;
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

      <ScrollView>
        <View style={stylesIn.content}>
          <View style={stylesIn.imageContainer}>
            <ImageBackground
              source={require("../assets/background/03.jpg")}
              style={stylesIn.imageBackground}
              resizeMode="cover"
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
              </TouchableOpacity>
              <View style={stylesIn.logoContainer}>
                <Image
                  source={{
                    uri: userVisitors.img_profile,
                  }}
                  style={stylesIn.logo}
                />
              </View>
            </ImageBackground>
          </View>

          {/* ชื่อ และ เมนู */}
          <View style={stylesIn.info}>
            <View style={stylesIn.info_top}>
              <Text style={stylesIn.name}>{userVisitors.fullname}</Text>
            </View>
          </View>

          {/* ส่วนเนื้อหาที่จะเปลี่ยน */}
          <View style={stylesIn.content_home}>
            <Text style={stylesIn.titlecontent}>รายละเอียด</Text>

            <View style={stylesIn.detials}>
              <Text style={stylesIn.caption}>{userVisitors.detail || "ข้อมูล ประวัตื caption"}</Text>

              <Text style={{ fontSize: 14, marginBottom: 15 }}>
                ช่องทางการติดต่อ
              </Text>
              <View style={{ paddingTop: 10 }}>
                {contactData.map((contact) => (
                  <View key={contact.id} style={styles.contactContainer}>
                    <TouchableOpacity
                      style={styles.contact}
                      onPress={() => openlink(contact.contact_link)}
                    >
                      <FontAwesomeIcon
                        icon={contact.contact_icon}
                        size={24}
                        color={contact.contact_color}
                      />
                      <Text style={styles.contactText}>
                        {contact.contact_name}
                      </Text>
                    </TouchableOpacity>

                  </View>
                ))}
              </View>

              <Text style={{ fontSize: 14, marginBottom: 10 }}>เรทราคา</Text>
              <View style={stylesIn.rate}>
                {rateInfo.map((item, i) => (
                  <View key={i} style={{ paddingVertical: 6 }}>
                    <Text style={styles.textrate}>
                      {item.Type} {item.Price}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={stylesIn.titlecontent}>ผลงาน</Text>
            <View style={stylesIn.body}>{renderContent()}</View>
          </View>
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
  content: {
    width: "auto",
    marginTop: 80,
  },
  imageContainer: {
    width: "100%",
    height: 220,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: 20,
    justifyContent: "space-between",
  },
  logoContainer: {
    position: "relative", // ทำให้ปุ่มสามารถวางซ้อนบนโลโก้ได้
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120, // ขนาดโลโก้
    height: 120,
    borderRadius: 100, // รูปทรงกลม
  },

  info: {
    width: "100%",
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  info_top: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  btt_info: {
    backgroundColor: "#d4d4d4",
    padding: 8,
    borderRadius: 5,
  },
  menuInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: -20,
  },
  titleInfo: {
    paddingTop: 10,
    fontSize: 20,
  },

  content_home: {
    marginBottom: 100,
    padding: 15,
    marginTop: -10,
  },
  titlecontent: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detials: {
    padding: 10,
  },

  contact: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  rate: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textcontact: {
    paddingHorizontal: 10,
  },
  textrate: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  caption: {
    marginBottom: 20,
  },

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
  swiper: {
    height: 270,
  },
  image_body: {
    width: "100%", // ปรับรูปให้เต็มความกว้างของกล่องg
    aspectRatio: 1.5, // กำหนดอัตราส่วนภาพ เช่น 1.5 สำหรับภาพแนวนอน
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "contain", // ปรับการแสดงผลของรูปภาพ
  },
  name_body: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 10,
    // textAlign: "center",
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
});

export default PhotoDetailUser;
