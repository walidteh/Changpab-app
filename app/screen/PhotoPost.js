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
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";

import * as ImagePicker from "expo-image-picker";

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

const PhotoPost = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState(""); // เพิ่ม state สำหรับ TextInput
  const [user, setUser] = useState({});
  const [images, setImages] = useState([]); // จัดเก็บ URI ของรูปหลายรูป
  const [imageSave, setImageSave] = useState([]);
  const maxChars = 200; // จำนวนตัวอักษรสูงสุด
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
  useEffect(() => {
    fetchUser();
  }, []);

  const handleTextChange = (input) => {
    const words = input.split(/\s+/).filter(Boolean); // แยกข้อความเป็นคำ
    if (input.length <= maxChars) {
      setText(input);
    }
  };

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

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow access to your gallery to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // เปิดให้เลือกหลายรูป
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      // เอาภาพที่เลือกใหม่มาเพิ่มใน images
      const newImages = result.assets.slice(0, 10).map((asset) => asset.uri); // จำกัดที่ 10 รูป
      setImages((prevImages) => [...prevImages, ...newImages]); // เพิ่มภาพใหม่ไปยังภาพที่มีอยู่แล้ว
      const combinedImages = [...images, ...newImages].slice(0, 10); // จำกัดจำนวนภาพที่ 10
      setImages(combinedImages); // อัปเดต state

      // ถ้าต้องการอัปโหลดรูปพร้อมกัน
      setImageSave([...images, ...newImages])
    }
  };



  // ฟังก์ชันสำหรับลบรูป
  const handleDeleteImage = (uri) => {
    setImages((prevImages) => prevImages.filter((image) => image !== uri)); // ลบรูปตาม URI
  };

  // ฟังก์ชันสำหรับอัปโหลดภาพไปยังเซิร์ฟเวอร์
  const uploadImages = async () => {
    const token = await AsyncStorage.getItem("@token");
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("postdetail", text);
    imageSave.forEach((uri, index) => {
      formData.append("files", {
        uri,
        type: "image/jpeg", // หรือประเภทไฟล์ที่เหมาะสมกับไฟล์ภาพ
        name: uri.split("/").pop(),
      });
    });

    const response = await fetch("http://" + app_var.api_host + "/users/create_post", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Upload successful:", result);
      navigation.reset({
        index: 0,
        routes: [{ name: "PhotoIndex" }],
      });
    } else {
      console.error("Upload failed:", response.statusText);
      alert("Failed to upload images.");
    }
  };

  const postImage = () => {
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
        <Text style={styles.exitText}>สร้างโพสต์</Text>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.profile}>
            <Image
              source={{
                uri: user.Img_profile,
              }}
              style={styles.profileImagePost}
            />
            <Text style={styles.profilename}>{user.Fullname}</Text>
          </View>

          <View style={styles.contentpost}>
            <TextInput
              style={styles.input}
              placeholder="เขียนอะไรสักหน่อย"
              value={text}
              onChangeText={handleTextChange}
              autoCorrect={false}
              autoCapitalize="none"
              multiline
              textAlignVertical="top"
            />

            {/* แสดงภาพที่เลือก */}
            <View style={styles.imageContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    onPress={() => handleDeleteImage(uri)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* ปุ่มสำหรับแนบภาพ */}
            <View style={styles.buttonContainer}>
              {images.length < 10 && ( // แสดงปุ่มเฉพาะเมื่อมีรูปน้อยกว่า 10
                <TouchableOpacity
                  style={styles.buttonPost}
                  onPress={handleImagePicker}
                >
                  <Text style={styles.buttonText}>
                    เลือกภาพ (สูงสุด 10 รูป)
                  </Text>
                </TouchableOpacity>
              )}
              {images.length > 0 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={uploadImages}
                >
                  <Text style={styles.buttonText}>โพสต์</Text>
                </TouchableOpacity>
              )}
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80, // ชดเชยความสูงของ Navbar
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90, // ความสูงของ Navbar
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30, // เพิ่มระยะด้านบนสำหรับ SafeArea
    paddingBottom: 10,
    zIndex: 1000,
  },
  leftBox: {
    flex: 1,
  },
  rightBox: {
    flex: 1,
    alignItems: "flex-end",
  },
  titleTop: {
    fontSize: 20,
    fontWeight: "bold",
  },

  dropdown: {
    position: "absolute",
    top: 35,
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 2,
  },

  exit: {
    flexDirection: "row", // จัดเรียงไอเท็มในแนวนอน
    alignItems: "center", // จัดให้อยู่ตรงกลางในแนวตั้ง
    justifyContent: "center", // ข้อความอยู่ตรงกลาง
    paddingVertical: 10,
    position: "relative", // เพื่อจัดไอคอนให้อยู่ซ้ายสุด
  },
  exitIcon: {
    position: "absolute", // ทำให้ไอคอนย้ายไปด้านซ้ายสุด
    left: 20, // ระยะห่างจากขอบซ้าย
  },
  exitText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    width: "100%",
  },
  profile: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileImagePost: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  profilename: {
    fontSize: 20,
    paddingLeft: 15,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    // borderColor: '#B3B3B3',
    // borderWidth: 1,
    textAlignVertical: "top", // ข้อความเริ่มต้นด้านบน
    minHeight: 100, // ความสูงขั้นต่ำของ TextInput
    maxHeight: 120, // ความสูงสูงสุดของ TextInput
    fontSize: 16, // ขนาดตัวอักษร
    color: "black", // สีข้อความ
  },

  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // จัดให้รูปแสดงหลายแถว
    marginVertical: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 5,
  },
  buttonContainer: {
    paddingBottom: 100,
    alignItems: "center",
  },
  buttonPost: {
    flex: 1,
    width: "80%",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  deleteButton: {
    width: 28,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
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

export default PhotoPost;
