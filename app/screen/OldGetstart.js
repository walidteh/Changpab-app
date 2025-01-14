import {
  StyleSheet,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  Text,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GetStart = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("@token");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    scaleAnimation.start();

    const timer = setTimeout(() => {
      setCooldown(true);
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => {
      clearTimeout(timer);
      scaleAnimation.stop();
    };
  }, [scaleValue, translateY]);

  useEffect(() => {
    if (isLoggedIn && cooldown) {
      const navigateToIndex = async () => {
        const role = await AsyncStorage.getItem("@userRole");
        navigation.navigate(role === "PG" ? "PhotoIndex" : "Userindex");
      };
      navigateToIndex();
    }
  }, [isLoggedIn, cooldown, navigation]);

  const onPress = async () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate("login");
      setLoading(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <Animated.Image
            source={require("../assets/camera.png")}
            style={[
              styles.image,
              {
                transform: [{ scale: scaleValue }, { translateY: translateY }],
              },
            ]}
          />
          {cooldown && !isLoggedIn ? (
            <>
              <View style={styles.details}>
                <Text style={styles.subText}>Find the right</Text>
                <Text style={styles.subText}>photographer for you</Text>
                <Text style={styles.titleText}>Let's go!</Text>
              </View>
              <Pressable
                style={styles.button}
                onPress={onPress}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.cooldownText}>CHANGPAB</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#072432",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 280,
    height: 240,
    marginBottom: 60,
  },
  cooldownText: {
    color: "#fff",
    fontSize: 30,
    marginTop: -30,
  },
  subText: {
    color: "#fff",
    fontSize: 24,
    marginTop: 5,
    textAlign: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 28,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  details: {
    top: -150,
  },
  button: {
    backgroundColor: "white",
    height: 60,
    width: 170,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 50,
  },
  buttonText: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default GetStart;
