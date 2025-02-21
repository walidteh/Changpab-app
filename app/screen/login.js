import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from 'expo-font'; // expo install expo-font
import AsyncStorage from "@react-native-async-storage/async-storage";
import app_var from "./public";

export default function LoginForm({ navigation }) {
  const navigate = useNavigation();

  const [click, setClick] = useState(false);
  const [email, setEmail] = useState(""); // ตั้งชื่อ state ให้เป็น email
  const [password, setPassword] = useState(""); // ตั้งชื่อ state ให้เป็น password
  const [loading, setLoading] = useState(false);


  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
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
      ).start();
    }
  }, [loading, scaleValue]);

  const onPress = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate("signup");
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("error", "Please enter your username");
      return; 
    }

    const response = await fetch("http://" + app_var.api_host + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });
    const data = await response.json();
    if (data.status === "ok") {
      setEmail("");
      setPassword("");
      // navigation.navigate(data.role === "PG" ? "PhotoIndex" : "UserIndex");
      navigation.reset({
        index: 0,
        routes: [{ name: data.role === "PG" ? "PhotoIndex" : "UserIndex" }],
      });
      await AsyncStorage.setItem("@token", data.token);
      await AsyncStorage.setItem("@userRole", data.role);
      console.log(data.role);
      const token = await AsyncStorage.getItem("@token");

      console.log(token);
    } else {
      Alert.alert(data.status, data.message, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const [fontsLoaded] = useFonts({
      "Kanit-ExtraLight": require("../assets/fonts/Kanit-ExtraLight.ttf"),
    });
  if (!fontsLoaded) {
    return null; // Or a loading screen
  }


  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#063B52" />
        </View>
      ) : (
        <>
          <LinearGradient
            colors={["#09587A", "#063B52"]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            locations={[0, 1]}
          >
            <Animated.Image
              source={require("../assets/logo/camera1.png")}
              style={[styles.image, { transform: [{ scale: scaleValue }] }]}
            />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Ready for more? Sign in and </Text>
            <Text style={styles.subtitle}>find a photographer</Text>
          </LinearGradient>

          <View style={styles.inputView}>
            <Text style={styles.intoinput}>ชื่อผู้ใช้</Text>
            <TextInput
              style={styles.input}
              placeholder="กรุณากรอกชื่อผู้ใช้ของคุณ"
              value={email} // ใช้ค่าจาก state email
              onChangeText={setEmail} // อัปเดตค่าจาก TextInput
              autoCorrect={false}
              autoCapitalize="none"
            />
            <Text style={styles.intoinput}>รหัสผ่าน</Text>
            <TextInput
              style={styles.input}
              placeholder="กรุณากรอกรหัสผ่านของคุณ"
              secureTextEntry
              value={password} // ใช้ค่าจาก state password
              onChangeText={setPassword} // อัปเดตค่าจาก TextInput
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.rememberView}>
            {/* <View style={styles.checkboxContainer}>
              <Checkbox
                value={click}
                onValueChange={setClick}
                color={click ? "#063B52" : "gray"}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View> */}

            <View>
              <Pressable onPress={() => Alert.alert("ลืมรหัส")}>
                <Text style={styles.forgetText}>ลืมรหัสผ่าน ?</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
            </Pressable>
            {/* <Text style={styles.optionsText}>OR</Text> */}

            {/* <Pressable
              style={styles.googleButton}
              onPress={() => Alert.alert("Continue with Google")}
            >
              <View style={styles.googleButtonContent}>
                <Image
                  source={require("../assets/logo/google.png")}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </View>
            </Pressable> */}
          </View>

          <Text style={styles.footerText}>
          ยังไม่มีบัญชี ?{" "}
            <Text style={styles.signup} onPress={onPress}>
              สมัครสมาชิก
            </Text>
          </Text>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
  },
  image: {
    height: 160,
    width: 170,
    marginTop: 20,
    marginBottom: -10,
  },
  card: {
    width: "100%",
    backgroundColor: "#003f5c", // สีพื้นหลัง
    borderBottomLeftRadius: 30, // โค้งมุมซ้ายล่าง
    borderBottomRightRadius: 30, // โค้งมุมขวาล่าง
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Kanit-ExtraLight",
    fontSize: 26,
    // fontFamily: 'Kanit-ExtraLight', 
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Kanit-ExtraLight",
    textAlign: "center",
    color: "white",
  },
  inputView: {
    gap: 9,
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  input: {
    height: 50,
    fontFamily: "Kanit-ExtraLight",
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  intoinput: {
    fontFamily: "Kanit-ExtraLight",
    gap: 1,
    paddingHorizontal: 10,
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 35,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 30,
    margin: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 13,
  },
  forgetText: {
    fontSize: 11,
    color: "#39619D",
  },
  button: {
    backgroundColor: "#063B52",
    height: 45,
    width: 320,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Kanit-ExtraLight",
    color: "white",
    fontSize: 18,
    // fontWeight: "bold",
  },
  buttonView: {
    width: "80%",
    // paddingHorizontal: 30,
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 6,
    color: "gray",
    fontSize: 13,
    marginBottom: 1,
  },
  googleButton: {
    backgroundColor: "white",
    height: 45,
    width: 350,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
  },
  footerText: {
    fontFamily: "Kanit-ExtraLight",
    textAlign: "center",
    color: "gray",
    marginTop: 15,
  },
  signup: {
    fontFamily: "Kanit-ExtraLight",
    textDecorationLine: "underline",
    color: "blue",
    fontSize: 13,
  },
});
