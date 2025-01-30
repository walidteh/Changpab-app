import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";
import * as ImagePicker from "expo-image-picker";
import Swiper from "react-native-swiper";
import moment from "moment";
import { Linking } from "react-native";

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
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const PhotoProfile = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [userAll, setUserAll] = useState([]);
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleDropdownToggle = (index) => {
    setSelectedDropdown(selectedDropdown === index ? null : index); // เปิด/ปิดเมนู
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

  const fetchAllPost = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        "http://" + app_var.api_host + "/users/get_post_info",
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
        setPost(data.post);
        // console.log(post);
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

  const [refreshing, setRefreshing] = useState(false); // Declare refreshing state
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
    fetchAllPost();
  }, []);

  const [selectedMenu, setSelectedMenu] = useState("หน้าหลัก"); // เก็บสถานะของเมนูที่เลือก

  // ตัวอย่างรูป
  const PostUser = [];

  const DeletePost = async (post_id) => {
    Alert.alert("ระบบ", "ต้องการลบโพสต์หรือไม่", [
      {
        text: "ยกเลิก",
        onPress: () => {
          return;
        },
      },
      {
        text: "ตกลง",
        onPress: async () => {
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
                "/users/delete_post?postId=" +
                encodeURIComponent(post_id),
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await response.json();
            console.log(data.status);
            navigation.reset({
              index: 0,
              routes: [{ name: "PhotoProfile" }],
            });
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while searching.");
          }
        },
      },
    ]);
    console.log(post_id);
  };

  // const contactData = [
  //   { icon: faFacebook, text: "Facebook", key: "facebook" },
  //   { icon: faFontAwesome, color: "#ffa500", text: "Page Facebook", key: "page" },
  //   { icon: faInstagram, color: "#f56949", text: "Instagram", key: "instagram" },
  //   { icon: faPhone, color: "#34A853", text: "Phone Number", key: "phone" },
  //   { icon: faEnvelope, color: "#d44638", text: "E-mail", key: "email" }
  // ];

  // const userContacts = {
  //   facebook: "https://facebook.com/user",
  //   instagram: "https://instagram.com/user",
  //   // phone: "0123456789",
  //   email: "walid.123377az@gmial.com"
  // };

  const openlink = (url) => {
    // ตรวจสอบว่า URL นั้นสามารถเปิดได้หรือไม่
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          // เปิด URL
          Linking.openURL(url);
        } else {
          console.log("ไม่สามารถเปิดลิงก์นี้ได้");
        }
      })
      .catch((err) => console.error("เกิดข้อผิดพลาดในการเปิดลิงก์:", err));
  };

  const contactData = [
    {
      id: 1,
      contact_name: "walid",
      contact_link: "https://www.facebook.com/Waris058/",
      contact_icon: faFacebook,
      contact_color: "#1877f2",
    },
    {
      id: 2,
      contact_name: "waris_04",
      contact_link: "https://www.google.co.th/",
      contact_icon: faInstagram,
      contact_color: "#f56949",
    },
  ];

  // const filteredContacts = contactData.filter(
  //   (contact) => userContacts[contact.key]
  // );

  const renderContent = () => {
    post.forEach((item) => {
      PostUser.push({
        PostId: item.post_id,
        Fullname: user.Fullname,
        Img_profile: user.Img_profile,
        Detail: item.post_detail,
        Date: moment(item.post_date).format("D-M-YYYY HH:mm"),
        Img_Post: item.images.map((image) => ({
          url: image.url,
          img_id: image.image_id,
        })),
      });
    });
    if (selectedMenu === "หน้าหลัก") {
      return (
        <ScrollView>
          <View style={styles.content_home}>
            <Text style={styles.titlecontent}>รายละเอียด</Text>

            <View style={styles.detials}>
              <Text style={styles.caption}>ข้อมูล ประวัตื caption </Text>

              <View style={styles.container}>
      <View style={styles.header}>
        <Text>ช่องทางการติดต่อ</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={{ fontSize: 24 }}>+</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput placeholder="Enter your name" style={styles.input} />
          <TextInput placeholder="Enter your link" style={styles.input} />
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      )}
        <View style={{paddingTop: 10}}>
          {contactData.map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.contact} onPress={() => openlink(contact.contact_link)}>
              <FontAwesomeIcon icon={contact.contact_icon} size={24} color={contact.contact_color} />
              <Text style={styles.contactText}>{contact.contact_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
    </View>
              <Text style={{ fontSize: 14, marginBottom: 15 }}>เรทราคา</Text>
              <View style={styles.contact}>
                <Text style={styles.textcontact}>ปริญญา</Text>
                <Text style={styles.textcontact}>3000 - 5000</Text>
              </View>
              <View style={styles.contact}>
                <Text style={styles.textcontact}>งานแต่ง</Text>
                <Text style={styles.textcontact}>3000 - 8000</Text>
              </View>
            </View>

            <Text style={styles.titlecontent}>ผลงาน</Text>
            <View style={styles.body}>
              {PostUser.length > 0 ? (
                PostUser.map((user, i) => (
                  <View key={i} style={styles.item} onPress={DetailPost}>
                    <View style={styles.profile_header}>
                      <Image
                        source={{
                          uri: user.Img_profile,
                        }}
                        style={styles.profile_post}
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

                    <View style={styles.dropdownMenu}>
                      <TouchableOpacity onPress={() => handleDropdownToggle(i)}>
                        <Text style={styles.dropdownIcon}>⋯</Text>
                      </TouchableOpacity>
                      {selectedDropdown === i && (
                        <View style={styles.dropdownPost}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate("PhotoPostEdit", {
                                postId: user.PostId,
                                imagePost: user.Img_Post,
                                detailPost: user.Detail,
                              });
                            }}
                          >
                            <Text style={styles.dropdownItem}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => DeletePost(user.PostId)}
                          >
                            <Text
                              style={[
                                styles.dropdownItem,
                                styles.dropdownItemLast,
                              ]}
                            >
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <Swiper
                      style={styles.swiper}
                      showsPagination={true}
                      loop={false}
                    >
                      {user.Img_Post.map((img, index) => (
                        <Image
                          key={index}
                          source={{ uri: img.url }}
                          style={styles.image_body}
                        />
                      ))}
                    </Swiper>
                    <Text style={styles.name_body}>
                      {user.Detail || "No Details Available"}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  ไม่มีโพสต์
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      );
    } else if (selectedMenu === "ถูกใจ") {
      return (
        <ScrollView>
          <View style={styles.body}>
            {userAll.map((user, i) => (
              <TouchableOpacity
                key={i}
                style={styles.item}
                onPress={DetailPost}
              >
                <Image
                  source={{ uri: user.Img_profile }}
                  style={styles.image_body}
                />
                <Text style={styles.name_body}>
                  {user.Fullname || "No Fullname Available"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    }
    return null;
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

  const DetailPost = () => {
    navigation.navigate("DetailPost");
  };

  const ProfileEdit = () => {
    navigation.navigate("PhotoProfileEdit");
  };

  const handleImagePicker = async () => {
    // ขออนุญาตเข้าถึง Media Library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      Alert.alert("Error", "Please select an image before uploading.", [
        { text: "OK" },
      ]);
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
        Alert.alert("Error", "Authentication token is missing.", [
          { text: "OK" },
        ]);
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
        Alert.alert("Error", result.message || "Failed to upload the image.", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "An unexpected error occurred.", [{ text: "OK" }]);
    }
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
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={require("../assets/background/03.jpg")}
              style={styles.imageBackground}
              resizeMode="cover"
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Image
                  source={{
                    uri: user.Img_profile,
                  }}
                  style={styles.logo}
                />
                <TouchableOpacity
                  onPress={handleImagePicker}
                  style={styles.uploadImage}
                >
                  <FontAwesomeIcon icon={faCamera} size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          {/* ชื่อ และ เมนู */}
          <View style={styles.info}>
            <View style={styles.info_top}>
              <Text style={styles.name}>
                {`${user.Fullname || "No Fullname Available"} ${
                  user.Lastname || ""
                }`.trim()}
              </Text>
              <TouchableOpacity style={styles.btt_info} onPress={ProfileEdit}>
                <Text style={{ fontSize: 12 }}>แก้ไขข้อมูล</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuInfo}>
              <TouchableOpacity
                style={styles.titleInfo}
                onPress={() => setSelectedMenu("หน้าหลัก")}
              >
                <Text
                  style={selectedMenu === "หน้าหลัก" ? styles.activeMenu : null}
                >
                  หน้าหลัก
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.titleInfo}
                onPress={() => setSelectedMenu("ถูกใจ")}
              >
                <Text
                  style={selectedMenu === "ถูกใจ" ? styles.activeMenu : null}
                >
                  ถูกใจ
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ส่วนเนื้อหาที่จะเปลี่ยน */}
          <View style={styles.dynamicContent}>{renderContent()}</View>
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
    // padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
    // padding: 10
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  form: {
    marginBottom: 14,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // สำหรับ Android
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#063B52",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // paddingTop: 80,
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
    flexWrap: "wrap",
  },
  emailText: {
    color: "#BEBEBE",
    width: 150,
    fontSize: 12,
    flexWrap: "wrap",
  },
  button: {
    width: "50%",
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

  content: {
    width: "auto",
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
    position: "relative", // ทำให้ปุ่มสามารถวางซ้อนบนโลโก้ได้
    // alignItems: "center",
    // justifyContent: "center",
  },
  logo: {
    width: 100, // ขนาดโลโก้
    height: 100,
    borderRadius: 50, // รูปทรงกลม
  },
  uploadImage: {
    position: "absolute", // ทำให้ปุ่มอยู่ทับโลโก้
    bottom: 0, // ตำแหน่งด้านล่างของโลโก้
    left: 70, // ตำแหน่งด้านขวาของโลโก้
    backgroundColor: "#696969", // สีพื้นหลังปุ่ม
    borderRadius: 50, // รูปทรงกลม
    padding: 10, // ระยะห่างภายในปุ่ม
    elevation: 5, // เงาสำหรับ Android
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  info: {
    width: "100%",
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 5,
  },
  info_top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
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

  dynamicContent: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  activeMenu: {
    fontWeight: "bold",
    color: "blue",
  },

  content_home: {
    marginBottom: 100,
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
  textcontact: {
    paddingHorizontal: 10,
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

  dropdownMenu: {
    position: "absolute",
    right: 20,
    top: 10,
    zIndex: 1,
  },
  dropdownIcon: {
    fontSize: 24,
    color: "#888888",
  },
  dropdownPost: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    position: "absolute",
    right: 0,
    top: 30,
    elevation: 5,
    width: 120,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: "#333333",
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

export default PhotoProfile;
