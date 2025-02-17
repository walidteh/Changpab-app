import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import styles from "./styles";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faGreaterThan,
  faMagnifyingGlass,
  faBell,
  faUser,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

const UserIndex = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userAll, setUserAll] = useState([]);
  const [post, setPost] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false); 

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

  const fetchPostRandom = async (keyword) => {
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
          "/users/get_post_random?limit=" +
          encodeURIComponent(8),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "OK") {
        setPost(data.post);
        // console.log(data.post);
      } else {
        alert("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while searching.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAllUser();
    fetchPostRandom();
  }, []);

  const UserProfile = () => {
    navigation.navigate("UserProfile");
  };

  const UserAllphotographer = () => {
    navigation.navigate("UserAllphotographer");
  };

  const UserAllpicture = () => {
    navigation.navigate("UserAllpicture");
  };

  const UserSearce = () => {
    navigation.navigate("UserSearch");
  };

  const UserNotify = () => {
    navigation.navigate("UserNotify");
  };


  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // จำลองการดึงข้อมูลใหม่หรือการรีเฟรช
    setTimeout(() => {
      setRefreshing(false); // หยุดการรีเฟรชหลังจาก 2 วินาที
    }, 1000);
  };

  const images = [
    require("../assets/background/03.jpg"),
    // require("../assets/ddd.jpg"),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // สลับภาพวนไปเรื่อยๆ
    }, 3000); // 10 วินาที

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

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
      {/* เนื้อหาที่สามารถเลื่อน */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogout}
                  >
                    <Text style={styles.buttonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={stylesIn.background} />
        <View style={stylesIn.card_top}>
          <View style={stylesIn.imageContainer}>
            <ImageBackground
              source={images[currentIndex]}
              style={stylesIn.imageBackground}
              resizeMode="cover"
            >
              <View style={stylesIn.textContainer}>
                <Text style={stylesIn.mainText}>
                  "หาช่างภาพที่ใช่ ได้ที่นี่..."
                </Text>
                <Text style={stylesIn.subText}>
                  ถ่ายรูปปริญญา ถ่ายงานแต่ง ถ่ายแบบ และอื่นๆ
                </Text>
              </View>
              <Image
                source={require("../assets/logo/camera.png")}
                style={stylesIn.logo}
              />
            </ImageBackground>
          </View>
        </View>

        <View style={stylesIn.card_bottom}>
          <View style={stylesIn.header}>
            <Text style={stylesIn.titleBottom}>ช่างภาพ</Text>
            <TouchableOpacity
              style={stylesIn.seeAll}
              onPress={UserAllphotographer}
            >
              <Text style={{ fontSize: 14, color: "#000" }}>ทั้งหมด</Text>
              <FontAwesomeIcon
                icon={faGreaterThan}
                size={12}
                color="#000"
                style={{ marginLeft: 3, marginTop: 3 }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 15 }}
          >
            {userAll
              .slice(0, 15) // เลือกแค่ 15 อัน
              .map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={stylesIn.item_top}
                  onPress={() => {
                    navigation.navigate("UserDetailUser", { userId: item.ID , userLoginId: user.ID });
                  }}
                >
                  <Image
                    source={{ uri: item.Img_profile }}
                    style={stylesIn.image}
                  />
                  <Text style={stylesIn.name}>
                    {item.Fullname || "No Fullname Available"}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          <View style={stylesIn.header}>
            <Text style={stylesIn.titleBottom}>ตัวอย่างรูปภาพ</Text>
            <TouchableOpacity style={stylesIn.seeAll} onPress={UserAllpicture}>
              <Text style={{ fontSize: 14, color: "#000" }}>ทั้งหมด</Text>
              <FontAwesomeIcon
                icon={faGreaterThan}
                size={12}
                color="#000"
                style={{ marginLeft: 3, marginTop: 3 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {post && post.length > 0 ? (
              post.map((post, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.item}
                  onPress={() => {
                    navigation.navigate("UserDetailPost", {
                      postId: post.post_id,
                      userId: post.user_id,
                    });
                  }}
                >
                    <Image
                      source={{ uri: post.image_url }}
                      style={styles.image_body}
                    />
                  <View style={stylesIn.detailPost}>
                    <Image
                      source={{
                        uri: post.profile,
                      }}
                      style={stylesIn.profileImagePost}
                    />
                    <Text style={stylesIn.NamePost}>
                      {post.fullname || "No Fullname Available"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                ไม่มีโพสต์
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* เมนูด้านล่าง */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={onRefresh}>
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
  detailPost: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 10
    // alignContent: 'center'
  },
  profileImagePost: {
    width: 25,
    height: 25,
    borderRadius: 30,
  },
  NamePost: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginLeft: 4,
  },
  /********** background blue **********/
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 400,
    backgroundColor: "#09587A",
    opacity: 0.8,
  },

  /********** card image background **********/
  card_top: {
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
    zIndex: 1, // ให้อยู่เหนือพื้นหลัง
  },
  imageContainer: {
    width: "85%",
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textContainer: {
    flex: 2,
    alignItems: "center",
  },
  mainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 10,
    color: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
  },

  /********** card content bottom **********/
  card_bottom: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
    marginBottom: 50,
    alignItems: "center",
  },

  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  titleBottom: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  item_top: {
    alignItems: "center",
    marginRight: 15,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
});

export default UserIndex;
