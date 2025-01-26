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

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faGreaterThan,
  faMagnifyingGlass,
  faBell,
  faUser,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

const PhotoIndex = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userAll, setUserAll] = useState([]);
  const [post, setPost] = useState([]);
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

  const PhotoProfile = () => {
    navigation.navigate("PhotoProfile");
  };

  const PhotoAllphotographer = () => {
    navigation.navigate("PhotoAllphotographer");
  };

  const PhotoAllpicture = () => {
    navigation.navigate("PhotoAllpicture");
  };

  const PhotoSearce = () => {
    navigation.navigate("PhotoSearch");
  };

  const PhotoNotify = () => {
    navigation.navigate("PhotoNotify");
  };

  const PhotoPost = () => {
    navigation.navigate("PhotoPost");
  };

  const DetailPost = () => {
    navigation.navigate("PhotoDetailPost");
  };

  const DetailUser = () => {
    navigation.navigate("PhotoDetailUser");
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
  }


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

        <View style={styles.background} />
        <View style={styles.card_top}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={images[currentIndex]}
              style={styles.imageBackground}
              resizeMode="cover"
            >
              <View style={styles.textContainer}>
                <Text style={styles.mainText}>
                  "หาช่างภาพที่ใช่ ได้ที่นี่..."
                </Text>
                <Text style={styles.subText}>
                  ถ่ายรูปปริญญา ถ่ายงานแต่ง ถ่ายแบบ และอื่นๆ
                </Text>
              </View>
              <Image
                source={require("../assets/logo/camera.png")}
                style={styles.logo}
              />
            </ImageBackground>
          </View>
        </View>

        <View style={styles.card_bottom}>
          <View style={styles.header}>
            <Text style={styles.titleBottom}>ช่างภาพ</Text>
            <TouchableOpacity
              style={styles.seeAll}
              onPress={PhotoAllphotographer}
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
              .slice(0, 6) // เลือกแค่ 6 อัน
              .map((user, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.item_top}
                  onPress={() => {
                    navigation.navigate("PhotoDetailUser", { userId: user.ID})
                  }}
                >
                  <Image
                    source={{ uri: user.Img_profile }}
                    style={styles.image}
                  />
                  <Text style={styles.name}>
                    {user.Fullname || "No Fullname Available"}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          <View style={styles.header}>
            <Text style={styles.titleBottom}>ตัวอย่างรูปภาพ</Text>
            <TouchableOpacity style={styles.seeAll} onPress={PhotoAllpicture}>
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
            {/* {userAll.map((user) => (
              <TouchableOpacity key={user.id} style={styles.item}>
                <Image source={user.image} style={styles.image_body} />
                <Text style={styles.name}>{user.name}</Text>
              </TouchableOpacity>
            ))} */}
            {post && post.length > 0 ? (
              post.map((post, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.item}
                  onPress={DetailPost}
                >
                  <Image
                    source={{ uri: post.image_url }}
                    style={styles.image_body}
                  />
                  <Text style={styles.name}>
                    {post.fullname || "No Fullname Available"}
                  </Text>
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

const styles = StyleSheet.create({
  // เพิ่ม marginTop ใน ScrollView เพื่อให้เนื้อหาไม่ทับ navbar
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 400,
    backgroundColor: "#09587A",
    opacity: 0.8,
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
    top: 60,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 5,
    padding: 10,
    width: 220,
    right: 0,
    zIndex: 100,
  },
  infoText: {
    width: 150,
    fontSize: 16,
    flexWrap: 'wrap',
    // borderWidth: 1, // ความกว้างของเส้นขอบ
    // borderColor: '#FF4D4D', // สีของเส้นขอบ
  },
  emailText: {
    color: "#BEBEBE",
    width: 150,
    fontSize: 12,
    flexWrap: 'wrap',
  },
  button: {
    width: '50%',
    height: 35,
    backgroundColor: "#FF4D4D",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

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
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "auto",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    zIndex: 1000, // ให้อยู่ด้านหน้าสุด
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
  menu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: -10 }], // ดันขึ้นครึ่งหนึ่งของความสูงเมนู
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
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

export default PhotoIndex;
