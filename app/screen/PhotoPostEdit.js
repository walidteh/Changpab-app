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

import { useRoute } from "@react-navigation/native";

const PhotoPostEdit = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState(""); // เพิ่ม state สำหรับ TextInput
  const [user, setUser] = useState({});
  const [images, setImages] = useState([]); // จัดเก็บ URI ของรูปหลายรูป
  const [imageSave, setImageSave] = useState([]);
  const [oldImagePost, setOldImagePost] = useState([]);
  const [imagePostDelete, setImagePostDelete] = useState([]);
  const maxChars = 200; // จำนวนตัวอักษรสูงสุด
  const route = useRoute();
  const { postId } = route.params; // รับค่า postId จาก params
  const { imagePost } = route.params; // รับค่า postId จาก params
  const { detailPost } = route.params; // รับค่า postId จาก params
  const [postDetails, setPostDetails] = useState(null);

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

  const SavePostEdit = async () => {
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
        type: "image/jpeg",
        name: uri.split("/").pop(),
      });
    });

    const imgIds = oldImagePost.map((img) => {
      const urlParts = img.url.split("/"); 
      return urlParts[urlParts.length - 1];
    });
    formData.append("imgNameNotDel", JSON.stringify(imgIds));

    const response = await fetch(
      "http://" +
        app_var.api_host +
        "/users/edit_post?postId=" +
        encodeURIComponent(postId),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch post details: ${response.statusText}`);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "PhotoProfile" }],
    });
  };

  useEffect(() => {
    console.log("Received postId:", postId);
    console.log("Received imagePost:", imagePost);
    console.log("Received detailPost:", detailPost);
    setOldImagePost(imagePost);
    fetchUser();
    setText(detailPost);
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
      setImageSave([...images, ...newImages]);
    }
  };

  // ฟังก์ชันสำหรับลบรูป
  const handleDeleteImage = (type, uri) => {
    if (type === 1) {
      setImages((prevImages) => prevImages.filter((image) => image !== uri));
    } else {
      setOldImagePost((prevImages) =>
        prevImages.filter((image) => image.img_id !== uri)
      );
      // console.log("delete from api", oldImagePost);
    }
  };
  useEffect(() => {
    console.log("delete from api", oldImagePost);
  },[oldImagePost]);

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
        name: `image_${index}.jpg`,
      });
    });

    const response = await fetch(
      "http://" + app_var.api_host + "/users/create_post",
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

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
        <Text style={styles.exitText}>แก้ไขโพสต์</Text>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.profile}>
            <Image
              source={{
                uri: user.Img_profile,
              }}
              style={styles.profileImage}
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
              {oldImagePost.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: img.url }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteImage(2, img.img_id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    onPress={() => handleDeleteImage(1, uri)}
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
                  style={styles.button}
                  onPress={handleImagePicker}
                >
                  <Text style={styles.buttonText}>
                    เลือกภาพ (สูงสุด 10 รูป)
                  </Text>
                </TouchableOpacity>
              )}
              {/* {images.length > 0 || oldImagePost.length > 0 && ( */}
                <TouchableOpacity style={styles.button} onPress={SavePostEdit}>
                  <Text style={styles.buttonText}>บันทึก</Text>
                </TouchableOpacity>
              {/* )} */}
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
  profileImage: {
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
  button: {
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

export default PhotoPostEdit;
