import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  Pressable,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // นำเข้าไอคอนจาก FontAwesome
import app_var from "./public";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userAll, setUserAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.headerContainer}>
          {/* ไอคอนลูกศรซ้าย */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconContainer}
          >
            <Icon name="angle-double-left" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.ex}>ช่างภาพทั้งหมด</Text>

          {/* ข้อความ "changpab" */}
          <Text style={styles.changpabText}>CHANGPAB</Text>

          <View style={styles.profileContainer}>
            {/* กดที่รูปโปรไฟล์เพื่อแสดง dropdown */}
            <TouchableOpacity onPress={toggleDropdown}>
              <Image
                source={{
                  uri:
                    user.Img_profile &&
                    user.Img_profile !== "http://192.168.1.4:8080/get_image/"
                      ? user.Img_profile
                      : "https://cdn.discordapp.com/attachments/1250077512738799689/1324407457388298260/default.png?ex=67780a10&is=6776b890&hm=13974538c45dd610297e73a4d50291ad662175fc8bc85044201b81725767a7e6&",
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
                  onPress={() => navigation.navigate("login")}
                />
              </View>
            )}
          </View>
        </View>
      )}
      <ScrollView style={styles.changpab}>
        <View style={styles.cp_box}>
          {userAll.map((user) => (
            <View key={user.userId} style={styles.box}>
              <Image source={{ uri: user.Img_profile }} style={styles.img_cp} />
              <Text style={styles.name}>
                {user.Fullname || "No Fullname Available"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footer_menu}>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Icon
              name="home"
              size={30}
              color="#000"
              style={styles.footer_icon}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Icon
              name="search"
              size={30}
              color="#000"
              style={styles.footer_icon}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Icon
              name="plus-square-o"
              size={30}
              color="#000"
              style={styles.footer_icon}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Icon
              name="bell-o"
              size={30}
              color="#000"
              style={styles.footer_icon}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Icon
              name="user-o"
              size={30}
              color="#000"
              style={styles.footer_icon}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // ใช้พื้นที่ทั้งหมด
    justifyContent: "flex-start", // เนื้อหาจะเริ่มจากด้านบน
    alignItems: "center",
    backgroundColor: "#84ACBD",
  },
  headerContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconContainer: {
    position: "absolute",
    left: 15,
    top: 50,
  },
  ex: {
    position: "absolute",
    fontSize: 15,
    top: 50,
    left: 40,
    width: 200,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
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
    zIndex: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 5,
  },
  changpabText: {
    left: 5,
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  changpab: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 130,
  },
  cp_box: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    left: 20,
  },
  box: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    marginLeft: 20,
  },
  img_cp: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 120,
  },
  name: {
    marginTop: 10,
    top: -5,
    left: 10,
    fontSize: 14,
    width: "100%",
  },
  footer: {
    width: "100%",
    height: 55,
    backgroundColor: "#84ACBD",
    position: "absolute", // ทำให้ footer อยู่ที่ขอบล่าง
    bottom: 0, // ทำให้ footer อยู่ที่ขอบล่าง
    alignItems: "center",
    justifyContent: "center", // จัดให้เนื้อหากลาง
    // borderWidth: 1
  },

  footer_menu: {
    top: -10,
    width: "80%",
    height: 45,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffff",
    borderRadius: 40,
    // การเพิ่มเงา
    shadowColor: "#000", // สีของเงา (ดำ)
    shadowOffset: { width: 0, height: 2 }, // การเลื่อนเงา
    shadowOpacity: 0.1, // ความโปร่งแสงของเงา
    shadowRadius: 8, // ความเบลอของเงา
    elevation: 5, // เงาสำหรับ Android
  },

  footer_icon: {
    marginHorizontal: 10, // เพิ่มระยะห่างระหว่างไอคอน
  },
});

export default Profile;
