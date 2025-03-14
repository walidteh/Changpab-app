import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Image,
  Modal,
  TextInput,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import Swiper from "react-native-swiper";
import moment from "moment";
import { useRoute } from "@react-navigation/native";
import styles from "./styles";
import Icon from "react-native-vector-icons/AntDesign";
import { Linking } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faBell,
  faUser,
  faArrowLeft,
  faSquarePlus,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const UserDetailUser = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userVisitors, setUserVisitors] = useState({});
  const [post, setPost] = useState([]);
  const [expanded, setExpanded] = useState(false);
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
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { userId } = route.params;
  const { userLoginId } = route.params;
  const [liked, setLiked] = useState([]);
  const [interests, setInterests] = useState([]);
  const [modalVisible, setModalVisibles] = useState(false);
  const [nameContact, setNameContact] = useState("");
  const [messageContact, setMessageContact] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // เช็คว่าส่งข้อมูลไปแล้วหรือยัง

  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };
  const openlink = (host) => {
    // console.log(host);

    if (/^\d{10}$/.test(host.contact_name)) {
      console.log("phone is : ", host.contact_name);
      const phoneNumber = `tel:${host.contact_name}`;
      console.log(phoneNumber);
      Linking.openURL(phoneNumber).catch((err) =>
        Alert.alert("Error", "Cannot open dialer")
      );
    } else if (host.contact_name.includes("@")) {
      console.log("email is : ", host.contact_name);
    } else {
      console.log("link is : ", host.contact_link);
      const url = host.contact_link;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url).catch((err) => {
              alert("ไม่สามารถเปิดลิงก์นี้ได้");
            });
          } else {
            alert("ไม่สามารถเปิดลิงก์นี้ได้");
          }
        })
        .catch((err) => console.error("เกิดข้อผิดพลาดในการเปิดลิงก์:", err));
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

  const fetchUserLike = async () => {
    try {
      const myId = userLoginId;
      const visitorId = userId;

      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      // Correct way to pass query parameters in a GET request
      const url = `http://${
        app_var.api_host
      }/users/check_like?userId=${encodeURIComponent(
        myId
      )}&likedUserId=${encodeURIComponent(visitorId)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching like data:", error);
      alert("Error fetching like data");
    } finally {
      setIsLoading(false);
    }
  };

  var contactData = [];

  const ImageProfile = "";

  useEffect(() => {
    console.log("Received userId:", userId);
    console.log("Received userLoginId:", userLoginId);
    fetchUserVisitors();
    fetchUser();
    fetchUserLike();
  }, []);

  const UserIdex = () => {
    navigation.navigate("UserIndex");
  };

  const UserSearce = () => {
    navigation.navigate("UserSearch");
  };

  const UserNotify = () => {
    navigation.navigate("UserNotify");
  };

  const UserProfile = () => {
    navigation.navigate("UserProfile");
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const userLikePress = async () => {
    const myId = user.ID;
    const visitorId = userVisitors.user_id;

    const token = await AsyncStorage.getItem("@token");
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", myId);
    formData.append("likedUserId", visitorId);

    const response = await fetch("http://" + app_var.api_host + "/users/like", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      fetchUserLike();
    } else {
      console.error("Like failed:", response.statusText);
    }
  };

  const userInterests = async () => {
    try {
      const myId = user.ID;
      const visitorId = userVisitors.user_id;

      if (!myId || !visitorId || !messageContact) {
        alert("กรอกข้อความให้เรียบร้อย");
        return;
      }

      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("userId", myId);
      formData.append("interestedUserId", visitorId);
      formData.append("message", messageContact);

      const response = await fetch(
        `http://${app_var.api_host}/users/interests`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      alert("ได้ส่งการแจ้งเตือนไปให้ช่างเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error sending interest:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@token");
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        // console.log("Token removed successfully");
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "login" }],
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
    // console.log(PostUser[0]);
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
          <Text
            style={styles.name_body}
            numberOfLines={expanded ? undefined : 3}
          >
            {user.Detail || "No Details Available"}
          </Text>

          {user.Detail.length > 100 && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text style={{ color: "grey", marginTop: 5 }}>
                {expanded ? "ย่อข้อความ" : "อ่านเพิ่มเติม"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ));
    } else {
      <Text style={{ textAlign: "center", marginTop: 20 }}>ไม่มีโพสต์</Text>;
    }
  };

  const renderContact = () => {
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
    return contactData.map((item, i) => (
      <View key={i} style={stylesIn.contactContainer}>
        <TouchableOpacity
          style={stylesIn.contact}
          onPress={() => openlink(item)}
        >
          <FontAwesomeIcon
            icon={item.contact_icon}
            size={24}
            color={item.contact_color}
          />
          <Text style={stylesIn.contactText}>{item.contact_name}</Text>
        </TouchableOpacity>
      </View>
    ));
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

          <View style={stylesIn.info}>
            <View style={stylesIn.info_top}>
              <View style={stylesIn.centerContainer}>
                <Text style={stylesIn.name}>{userVisitors.fullname}</Text>
              </View>
            </View>
          </View>

          <View></View>
          <View style={stylesIn.mainContainer}>
            <View style={stylesIn.actionRow}>
              {userId != userLoginId ? (
                <TouchableOpacity onPress={userLikePress}>
                  <Text
                    style={[stylesIn.likeText, liked && stylesIn.likedText]}
                  >
                    {liked ? "ถูกใจแล้ว" : "ถูกใจ"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {userId != userLoginId ? (
                <TouchableOpacity
                  onPress={() => setModalVisibles(true)}
                  style={[
                    stylesIn.button,
                    isSubmitted && stylesIn.buttonSubmitted,
                  ]}
                >
                  <Text
                    style={[
                      stylesIn.buttonText,
                      isSubmitted && stylesIn.textSubmitted,
                    ]}
                  >
                    {isSubmitted ? "แจ้งเตือนเรียบร้อย" : "สนใจ"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>

            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
            >
              <View style={stylesIn.modalBackground}>
                <View style={stylesIn.modalBox}>
                  <Text style={stylesIn.modalTitle}>กรอกข้อมูลติดต่อ</Text>
                  <TextInput
                    style={stylesIn.inputField}
                    placeholder="กรอกช่องทางการติดต่อ"
                    value={messageContact}
                    onChangeText={setMessageContact}
                    placeholderTextColor="#aaa"
                    multiline={true}
                    numberOfLines={4}
                    returnKeyType="default"
                  />

                  <TouchableOpacity
                    style={stylesIn.submitButton}
                    onPress={() => {
                      setModalVisibles(false);
                      setMessageContact("");
                      setIsSubmitted(true);
                      userInterests();
                    }}
                  >
                    <Text style={stylesIn.submitButtonText}>ส่ง</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={stylesIn.cancelButton}
                    onPress={() => {
                      setModalVisibles(false);
                      setMessageContact("");
                    }}
                  >
                    <Text style={stylesIn.cancelButtonText}>ยกเลิก</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={stylesIn.content_home}>
            <Text style={stylesIn.titlecontent}>รายละเอียด</Text>

            <View style={stylesIn.detials}>
              <Text style={stylesIn.caption}>
                {userVisitors.detail || "ข้อมูล ประวัตื caption"}
              </Text>

              <Text style={{ fontSize: 14, marginBottom: 15 }}>
                ช่องทางการติดต่อ
              </Text>
              <View style={{ paddingTop: 8 }}>{renderContact()}</View>

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
        <TouchableOpacity style={styles.menuItem} onPress={UserIdex}>
          <FontAwesomeIcon icon={faHouse} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={UserSearce}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={UserNotify}>
          <FontAwesomeIcon icon={faBell} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={UserProfile}>
          <FontAwesomeIcon icon={faUser} size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const stylesIn = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 100,
    marginBottom: 10,
  },

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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },

  info: {
    padding: 10,
  },
  info_top: {
    flexDirection: "row",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeText: {
    color: "#888",
    marginLeft: 5,
  },
  likedText: {
    color: "red",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
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
  contactText: {
    left: 10,
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
  textSubmitted: {
    color: "#867B29",
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
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f4f4f4",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  inputField: {
    width: "100%",
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#063B52",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});

export default UserDetailUser;
