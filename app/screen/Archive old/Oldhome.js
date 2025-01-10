import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // นำเข้าไอคอนจาก FontAwesome
import app_var from "./public";

const Home = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userAll, setUserAll] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false); // Declare refreshing state

  const handlePress = () => {
    navigation.navigate("Profile");
  };

  const onRefresh = () => {
    setRefreshing(true);
    // จำลองการดึงข้อมูลใหม่หรือการรีเฟรช
    setTimeout(() => {
      setRefreshing(false); // หยุดการรีเฟรชหลังจาก 2 วินาที
    }, 1000);
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

  const Profile = ({ id }) => {
    navigation.navigate("Profile", { id: id });
  };

  const Allphotographer = () => {
    navigation.navigate("Profile");
  };

  const Allpicture = () => {
    navigation.navigate("Profile");
  };
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
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
                  uri:
                    user.Img_profile,
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>

            {/* แสดง dropdown */}
            {isDropdownVisible && (
              <View style={styles.dropdown}>
                <Text style={styles.infoText}>
                  <Icon name="user-o" size={20} />{" "}
                  {user.Fullname || "No Fullname Available"}{" "}
                  {user.Lastname || "No Lastname Available"}
                </Text>
                <Text style={styles.infoText}>
                  <Icon name="user-o" size={20} />:{" "}
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

        <View style={styles.background} />
        <View style={styles.card_top}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={require("../assets/imageContainer.png")}
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
                source={require("../assets/camera.png")}
                style={styles.logo}
              />
            </ImageBackground>
          </View>
        </View>

        <View style={styles.card_bottom}>
          <View style={styles.header}>
            <Text style={styles.titleBottom}>ช่างภาพ</Text>
            <TouchableOpacity style={styles.seeAll} onPress={Allphotographer}>
              <Text style={{ fontSize: 14, color: "#000" }}>ทั้งหมด</Text>
              <Icon
                name="chevron-circle-right"
                size={25}
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
            {userAll.slice(0, 6).map((user) => (
              <View style={styles.item_top}>
                <Image
                  source={{ uri: user.Img_profile }}
                  style={styles.image}
                />
                <Text style={styles.name}>
                  {user.Fullname || "No Fullname Available"}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.header}>
            <Text style={styles.titleBottom}>ตัวอย่างรูปภาพ</Text>
            <TouchableOpacity style={styles.seeAll} onPress={Allpicture}>
              <Text style={{ fontSize: 14, color: "#000" }}>ทั้งหมด</Text>
              <Icon
                name="chevron-circle-right"
                size={25}
                color="#000"
                style={{ marginLeft: 3, marginTop: 3 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* {photographers.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => Profile(item.id)}
              >
                <Image source={item.image} style={styles.image_body} />
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            ))} */}

            {userAll.map((user) => (
              <View key={user.userId} style={styles.item}>
                <Image
                  source={{ uri: user.Img_profile }}
                  style={styles.image_body}
                />
                <Text style={styles.name}>
                  {user.Fullname || "No Fullname Available"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* menu */}
      <View style={styles.menu}>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Icon name="home" size={30} color="#000" style={styles.menuItem} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Icon name="search" size={30} color="#000" style={styles.menuItem} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Icon
            name="plus-square-o"
            size={30}
            color="#000"
            style={styles.menuItem}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Icon name="bell-o" size={30} color="#000" style={styles.menuItem} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Icon name="user-o" size={30} color="#000" style={styles.menuItem} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  infoText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 5,
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
    backgroundColor: "#84ACBD",
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
    // top:1,
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
    top: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
