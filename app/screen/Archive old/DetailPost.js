import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "../public";
import { useRoute } from "@react-navigation/native";
const route = useRoute();
const { userId } = route.params;

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
      console.log("Received postId:", userId);
      fetchUser();
    }, []);


  return (
    <View style={styles.container}>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 200,
    borderRadius: 40,
  },
});

export default DetailPost;
