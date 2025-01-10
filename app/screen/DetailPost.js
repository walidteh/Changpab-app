import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";

const DetailPost = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});


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

  // const images = [
  //   require("../assets/background/03.jpg"),
  //   require("../assets/ddd.jpg"),
  // ];

  // const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // สลับภาพวนไปเรื่อยๆ
  //   }, 5000); // 10 วินาที

  //   return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  // }, []);


  return (
    <View style={styles.container}>
      {/* <Image source={images[currentIndex]} style={styles.image} /> */}
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  // เพิ่ม marginTop ใน ScrollView เพื่อให้เนื้อหาไม่ทับ navbar
  image: {
    width: 400,
    height: 200,
    borderRadius: 40,
  },
});

export default DetailPost;
