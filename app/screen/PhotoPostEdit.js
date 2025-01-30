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
import styles from "./styles";

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
  const [text, setText] = useState(""); 
  const [user, setUser] = useState({});
  const [images, setImages] = useState([]); 
  const [imageSave, setImageSave] = useState([]);
  const [oldImagePost, setOldImagePost] = useState([]);
  const [imagePostDelete, setImagePostDelete] = useState([]);
  const maxChars = 200;
  const route = useRoute();
  const { postId } = route.params;
  const { imagePost } = route.params;
  const { detailPost } = route.params;
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

    const imgIds = imagePostDelete.map((img) => {
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
    const words = input.split(/\s+/).filter(Boolean);
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
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.slice(0, 10).map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...newImages]); 
      const combinedImages = [...images, ...newImages].slice(0, 10); 
      setImages(combinedImages); 

      setImageSave([...images, ...newImages]);
    }
  };

  const handleDeleteImage = (type, uri) => {
    if (type === 1) {
      setImages((prevImages) => prevImages.filter((image) => image !== uri));
    } else {
      setOldImagePost((prevImages) => {
        const imageToDelete = prevImages.find((image) => image.img_id === uri);

        if (imageToDelete) {
          setImagePostDelete((prevDeleted) => [...prevDeleted, imageToDelete]);
        }

        return prevImages.filter((image) => image.img_id !== uri);
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.leftBox}>
          <Text style={styles.titleTop}>CHANGPAB</Text>
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
        <View style={stylesIn.content}>
          <View style={stylesIn.profile}>
            <Image
              source={{
                uri: user.Img_profile,
              }}
              style={stylesIn.profileImage}
            />
            <Text style={stylesIn.profilename}>{user.Fullname}</Text>
          </View>

          <View style={stylesIn.contentpost}>
            <TextInput
              style={stylesIn.input}
              placeholder="เขียนอะไรสักหน่อย"
              value={text}
              onChangeText={handleTextChange}
              autoCorrect={false}
              autoCapitalize="none"
              multiline
              textAlignVertical="top"
            />

            {/* แสดงภาพที่เลือก */}
            <View style={stylesIn.imageContainer}>
              {oldImagePost.map((img, index) => (
                <View key={index} style={stylesIn.imageWrapper}>
                  <Image
                    source={{ uri: img.url }}
                    style={stylesIn.imagePreview}
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteImage(2, img.img_id)}
                    style={stylesIn.deleteButton}
                  >
                    <Text style={stylesIn.deleteText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {images.map((uri, index) => (
                <View key={index} style={stylesIn.imageWrapper}>
                  <Image source={{ uri }} style={stylesIn.imagePreview} />
                  <TouchableOpacity
                    onPress={() => handleDeleteImage(1, uri)}
                    style={stylesIn.deleteButton}
                  >
                    <Text style={stylesIn.deleteText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* ปุ่มสำหรับแนบภาพ */}
            <View style={stylesIn.buttonContainer}>
              {images.length < 10 && ( // แสดงปุ่มเฉพาะเมื่อมีรูปน้อยกว่า 10
                <TouchableOpacity
                  style={stylesIn.button}
                  onPress={handleImagePicker}
                >
                  <Text style={stylesIn.buttonText}>
                    เลือกภาพ (สูงสุด 10 รูป)
                  </Text>
                </TouchableOpacity>
              )}
              {/* {images.length > 0 || oldImagePost.length > 0 && ( */}
                <TouchableOpacity style={stylesIn.button} onPress={SavePostEdit}>
                  <Text style={stylesIn.buttonText}>บันทึก</Text>
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

const stylesIn = StyleSheet.create({
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
});

export default PhotoPostEdit;
