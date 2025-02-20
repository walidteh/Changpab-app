import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import * as ImagePicker from "expo-image-picker";
import styles from './styles';

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

import { useRoute } from "@react-navigation/native";


const PhotoProfileEdit = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userAll, setUserAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [fullname, setFullname] = useState("");
  const [lastname, setLastname] = useState("");
  const [textdetail, setTextDetail] = useState(""); 
  const [textfullname, setTextFullname] = useState(""); 
  const [textLastname, setTextLastname] = useState(""); 
  const maxChars = 200;
  const [selectedImage, setSelectImage] = useState(""); 
  
  const route = useRoute();
    const { fullnameedit } = route.params;
    const { lastnameedit } = route.params;
    const { detailedit } = route.params;

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


  const save = async () => {
    console.log("asdasdsad")
    try {
      if(profileImage){
         await SaveImageProfile(profileImage); 
      }
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      let formData = new FormData();
      formData.append("fullname", textfullname);
      formData.append("lastname", textLastname);

      const response = await fetch(
        "http://" + app_var.api_host + "/users/edit_user",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      console.log(fullname);
      console.log(lastname);

      const data = await response.json();

      if (response.ok) {
        
        // alert("แก้ไขข้อมูลเรียบร้อย!");
        navigation.reset({
          index: 0,
          routes: [{ name: "PhotoProfile" }],
        });
        return data;
      } else {
        alert("กรุณากรอกทั้งชื่อและนามสกุล");
      }
    } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
};
  const saveDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      let formData = new FormData();
      formData.append("Detail", textdetail);

      const response = await fetch(
        "http://" + app_var.api_host + "/users/update_detail",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        
        // alert("แก้ไขข้อมูลเรียบร้อย!");
        navigation.reset({
          index: 0,
          routes: [{ name: "PhotoProfile" }],
        });
        return data;
      } else {
        alert("กรุณากรอกทั้งชื่อและนามสกุล");
      }
    } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
};


  useEffect(() => {
    fetchUser();
    fetchAllUser();
    setTextDetail(detailedit);
    setTextFullname(fullnameedit);
    setTextLastname(lastnameedit);
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
      setProfileImage(selectedImage); 
    }
  };

  const SaveImageProfile = async (imageUri) => {
    console.log("asdasdsad")

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
      if (response.ok && result.status !== "ok") {
        Alert.alert("Error", result.message || "Failed to upload the image.", [{ text: "OK" }]);
      } 
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "An unexpected error occurred.", [{ text: "OK" }]);
    }
  };

  const onSave = () => {
    // ใส่ฟังก์ชันสำหรับการบันทึกข้อมูล
    Alert.alert("บันทึกสำเร็จ", "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว");
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

  const FullName = (input) => {
    const words = input.split(/\s+/).filter(Boolean);
    if (input.length <= maxChars) {
      setTextFullname(input);
    }
  };
  const LastName = (input) => {
    const words = input.split(/\s+/).filter(Boolean);
    if (input.length <= maxChars) {
      setTextLastname(input);
    }
  };
  const DetailEdit = (input) => {
    const words = input.split(/\s+/).filter(Boolean);
    if (input.length <= maxChars) {
      setTextDetail(input);
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
            <FontAwesomeIcon icon={faBars} size={25} color="#000" />
          </TouchableOpacity>

          {/* แสดง dropdown */}
          {isDropdownVisible && (
            <View style={styles.dropdown1}>
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
          onPress={() => navigation.navigate("PhotoProfile")}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.exitText}>แก้ไขข้อมูล</Text>
      </View>

      <ScrollView>
        <View style={stylesIn.content}>
          <View style={stylesIn.logoContainer}>
            <Image
              source={{
                uri: !profileImage ? user.Img_profile:profileImage,
              }}
              style={stylesIn.logo}
            />
            <TouchableOpacity onPress={handleImagePicker} style={stylesIn.uploadImage}>
              <FontAwesomeIcon icon={faCamera} size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={stylesIn.name}>
              {`${user.Fullname || "No Fullname Available"} ${user.Lastname || ""}`.trim()}
            </Text>
          </View>
          <View style={stylesIn.inputView}>
            <Text style={stylesIn.intoinput}>ชื่อ</Text>
            <TextInput
              style={stylesIn.input}
              placeholder="กรุณาป้อนชื่อ"
              value={textfullname}
              onChangeText={FullName}
              autoCorrect={false}
              autoCapitalize="none"
              multiline
              textAlignVertical="top"
            />
            <Text style={stylesIn.intoinput}>นามสกุล</Text>
            <TextInput
              style={stylesIn.input}
              placeholder="กรุณาป้อนนามสกุล"
              value={textLastname}
              onChangeText={LastName}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <Text style={stylesIn.intoinput}>ประวัติ</Text>
            <TextInput
              style={stylesIn.inputBio}
              placeholder="เพิ่มประว้ติ"
              value={textdetail}
              onChangeText={DetailEdit}
              autoCorrect={false}
              autoCapitalize="none"
              multiline
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity style={stylesIn.bottom} onPress={() => { save(); saveDetail(); }}>
            <Text style={stylesIn.buttonText}>บันทึก</Text>
          </TouchableOpacity>
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

const stylesIn = StyleSheet.create({
  content: {
    width: "auto",
    marginBottom: 150,
    alignItems: 'center',
  },

  logoContainer: {
    position: "relative", // ทำให้ปุ่มสามารถวางซ้อนบนโลโก้ได้
    padding: 10,
    alignItems: 'center',
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
    paddingHorizontal: 30,
  },
  intoinput: {
    marginTop: 20,
  },
  input: {
    width: '95%',
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

  Boxinput: {
    flexDirection: 'row',
    marginTop: 15,
  },
  contactname: {
    width: '90%',
    marginLeft: 10,
  },

  bottom: {
    width: '70%',
    height: 43,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PhotoProfileEdit