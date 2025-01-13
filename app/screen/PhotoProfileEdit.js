import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'

import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";

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
import {
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";


const PhotoProfileEdit = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userAll, setUserAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

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
  }, []);

  const handleImagePicker = async () => {
    // ขออนุญาตเข้าถึง Media Library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow access to your gallery to upload an image."
      );
      return;
    }

    // เปิดแกลเลอรีเพื่อเลือกภาพ
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // ตัดรูปให้เป็นสี่เหลี่ยมจัตุรัส
      quality: 1, // คุณภาพของรูป (0 ถึง 1)
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri; // URI ของรูปที่เลือก
      setProfileImage(selectedImage); // เก็บ URI ของรูปที่เลือกไว้ใน state
      await SaveImageProfile(selectedImage); // บันทึกภาพที่เลือกทันที
    }
  };

  const SaveImageProfile = async (imageUri) => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image before uploading.", [{ text: "OK" }]);
      return;
    }

    try {
      // ดึงข้อมูลชื่อไฟล์เดิมจาก URI
      const fileName = imageUri.split("/").pop(); // ดึงชื่อไฟล์จาก URI

      // สร้าง FormData
      const formData = new FormData();

      formData.append("FileOld", user.Img_profile);

      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg", // ปรับตามประเภทไฟล์
        name: fileName, // ใช้ชื่อไฟล์เดิมจาก URI
      });

      // ดึง Token จาก AsyncStorage
      const token = await AsyncStorage.getItem("@token");

      // ตรวจสอบว่ามี token หรือไม่
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.", [{ text: "OK" }]);
        return;
      }

      // สร้าง Request Options
      const requestOptions = {
        method: "POST", // ใช้ POST
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // ระบุว่าใช้ FormData
        },
        body: formData, // ส่ง FormData ที่ประกอบด้วยไฟล์
      };

      // เรียก API
      const response = await fetch(
        `http://${app_var.api_host}/users/upload_image_profile`, // เปลี่ยนเส้นทางตาม API ของคุณ
        requestOptions
      );
      const result = await response.json();

      // ตรวจสอบผลลัพธ์
      if (response.ok && result.status === "ok") {
        Alert.alert("สำเร็จ", "เปลี่ยนรูปโปรไฟล์สำเร็จ!", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "PhotoProfile" }],
              });
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to upload the image.", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "An unexpected error occurred.", [{ text: "OK" }]);
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
          <FontAwesomeIcon icon={faBars} size={25} color="#000" />
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
        <Text style={styles.exitText}>แก้ไขข้อมูล</Text>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: user.Img_profile,
              }}
              style={styles.logo}
            />
            <TouchableOpacity onPress={handleImagePicker} style={styles.uploadImage}>
              <FontAwesomeIcon icon={faCamera} size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.name}>
              {`${user.Fullname || "No Fullname Available"} ${user.Lastname || ""}`.trim()}
            </Text>
          </View>
          <View style={styles.inputView}>
            <Text style={styles.intoinput}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              // value={firstname}
              // onChangeText={setFirstname}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <Text style={styles.intoinput}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              // value={firstname}
              // onChangeText={setFirstname}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <Text style={styles.intoinput}>First name</Text>
            <TextInput
              style={styles.inputBio}
              placeholder="เขียนอะไรสักหน่อย"
              // value={text}
              // onChangeText={handleTextChange}
              autoCorrect={false}
              autoCapitalize="none"
              multiline
              textAlignVertical="top"
            />
            <View style={styles.contact}>
              <Text style={styles.intoinput}>First name</Text>
              <View style={styles.contactname}>
                <FontAwesomeIcon icon={faFacebook} size={24} color="#1877f2" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  // value={firstname}
                  // onChangeText={setFirstname}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                // value={firstname}
                // onChangeText={setFirstname}
                autoCorrect={false}
                autoCapitalize="none"
              />
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
  )
}

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
    width: "auto",
  },

  logoContainer: {
    position: "relative", // ทำให้ปุ่มสามารถวางซ้อนบนโลโก้ได้
    padding: 10,
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1
  },
  logo: {
    width: 150, // ขนาดโลโก้
    height: 150,
    borderRadius: 100, // รูปทรงกลม
  },
  uploadImage: {
    position: "absolute", // ทำให้ปุ่มอยู่ทับโลโก้
    bottom: 50, // ตำแหน่งด้านล่างของโลโก้
    right: 120, // ตำแหน่งด้านขวาของโลโก้
    backgroundColor: "#696969", // สีพื้นหลังปุ่ม
    borderRadius: 50, // รูปทรงกลม
    padding: 10, // ระยะห่างภายในปุ่ม
    elevation: 5, // เงาสำหรับ Android
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },

  inputView: {
    gap: 5,
    width: "100%",
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  input: {
    height: 40,
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  inputBio: {
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

export default PhotoProfileEdit