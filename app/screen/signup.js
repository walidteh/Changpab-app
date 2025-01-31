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
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import app_var from "./public";

export default function LoginForm({ navigation }) {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setemail] = useState("");
  // const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    "Kanit-ExtraLight": require("../assets/fonts/Kanit-ExtraLight.ttf"),
  });

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
      navigation.navigate("login");
      setLoading(false);
    }, 1000);
  };

  const handleRoleSelection = (value) => {
    setRole(value); // อัปเดต state ของ role ด้วยค่าที่ส่งเข้ามา
  };

  const [role, setRole] = useState(""); // "" = ยังไม่ได้เลือก

  const handleSubmit = (event) => {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: username,
      password: password,
      fullname: firstname,
      lastname: lastname,
      email: email,
      role: role,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://" + app_var.api_host + "/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "ok") {
          Alert.alert(
            "Success",
            result.message, // ใช้ข้อความที่ได้จากการ login
            [
              {
                text: "OK",
                onPress: () => {
                  // เมื่อผู้ใช้กด "OK" ใน Alert ให้ทำการนำทางไปหน้า profile
                  navigation.navigate("login"); // แก้ไขเป็นชื่อหน้าที่ต้องการ
                },
              },
            ]
          );
        } else {
          Alert.alert(
            "Error",
            result.message, // ใช้ข้อความที่ได้จากการ login
            [{ text: "OK" }]
          );
        }
      })
      .catch((error) => console.error(error));
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#063B52" />
          </View>
        ) : (
          <>
            <LinearGradient
              colors={["#063B52", "#063B52"]}
              style={styles.logo}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 0.5 }}
              locations={[0, 1]}
            >
              <Animated.Image
                source={require("../assets/logo/camera1.png")}
                style={[styles.image, { transform: [{ scale: scaleValue }] }]}
              />
              <Text style={styles.title}>Ready to find a photographer?</Text>
              <Text style={styles.subtitle}>Sign up and begib your</Text>
              <Text style={styles.subtitle}>advebture!</Text>
            </LinearGradient>

            <View style={styles.choose}>
              <Text style={styles.titlech}>คุณคือใคร</Text>
              <View style={styles.content}>
                <View style={styles.btt}>
                  <Pressable
                    style={[
                      styles.buttonphoto,
                      role === "PG" && { backgroundColor: "#063B52" }, // เพิ่มสีพื้นหลังเมื่อเลือก
                    ]}
                    onPress={() => handleRoleSelection("PG")} // เรียกฟังก์ชันใหม่
                  >
                    <View style={styles.card}>
                      <Image
                        source={require("../assets/icon/photographer.png")}
                        style={styles.imagephoto}
                      />
                    </View>
                  </Pressable>
                  <Text style={styles.namebtt}>ช่างภาพ</Text>
                </View>
                <View style={styles.btt}>
                  <Pressable
                    style={[
                      styles.buttonphoto,
                      role === "CTM" && { backgroundColor: "#063B52" }, // เพิ่มสีพื้นหลังเมื่อเลือก
                    ]}
                    onPress={() => handleRoleSelection("CTM")} // เมื่อเลือกลูกค้า
                  >
                    <View style={styles.cardcustomer}>
                      <Image
                        source={require("../assets/icon/mix.png")}
                        style={styles.imagephoto}
                      />
                    </View>
                  </Pressable>
                  <Text style={styles.namebtt}>ลูกค้า</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputView}>
              {role === "" && (
                <Text style={{ textAlign: "center", color: "gray" }}>
                  กรุณาเลือกบทบาทของคุณ
                </Text>
              )}

              {role === "PG" && (
                <>
                  <Text style={styles.intoinput}>ชื่อ</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกชื่อของคุณ"
                    value={firstname}
                    onChangeText={setFirstname}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>นามสกุล</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกนามสกุลของคุณ"
                    value={lastname}
                    onChangeText={setLastname}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>เพจเฟซบุ๊ก</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกชื่อเพจเฟซบุ๊กของคุณ"
                    value={lastname}
                    onChangeText={setLastname}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>E-mail</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอก E-mail"
                    value={email}
                    onChangeText={setemail}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>ชื่อผู้ใช้</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกชื่อผู้ใช้ของคุณ"
                    secureTextEntry
                    value={username}
                    onChangeText={setUsername}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>รหัสผ่าน</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกรหัสผ่าน"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />

                  <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={handleSubmit}>
                      <Text style={styles.buttonText}>สมัคร</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.footerText}>
                    มีบัญชีอยู่แล้ว ?{" "}
                    <Text style={styles.signup} onPress={onPress}>
                      เข้าสู่ระบบ
                    </Text>
                  </Text>
                </>
              )}
              {role === "CTM" && (
                <>
                  <Text style={styles.intoinput}>ชื่อ</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกชื่อของคุณ"
                    value={firstname}
                    onChangeText={setFirstname}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>นามสกุล</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกนามสกุลของคุณ"
                    value={lastname}
                    onChangeText={setLastname}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>E-mail</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอก E-mail"
                    value={email}
                    onChangeText={setemail}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>ชื่อผู้ใช้</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกชื่อผู้ใช้ของคุณ"
                    secureTextEntry
                    value={username}
                    onChangeText={setUsername}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text style={styles.intoinput}>รหัสผ่าน</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรุณากรอกรหัสผ่านของคุณ"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />

                  <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={handleSubmit}>
                      <Text style={styles.buttonText}>สมัคร</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.footerText}>
                    มีบัญชีอยู่แล้ว ?{" "}
                    <Text style={styles.signup} onPress={onPress}>
                      เข้าสู่ระบบ
                    </Text>
                  </Text>
                </>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </ScrollView>
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
    marginBottom: -20,
    // borderColor: 'red',
    // borderWidth:1
  },
  logo: {
    width: "100%",
    backgroundColor: "#003f5c", // สีพื้นหลัง
    borderBottomLeftRadius: 30, // โค้งมุมซ้ายล่าง
    borderBottomRightRadius: 30, // โค้งมุมขวาล่าง
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Kanit-ExtraLight",
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Kanit-ExtraLight",
    textAlign: "center",
    color: "white",
  },
  inputView: {
    gap: 5,
    width: "100%",
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  input: {
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  intoinput: {
    gap: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#063B52",
    height: 45,
    width: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    margin: 20,
    alignItems: "center",
    paddingRight: 30,
  },
  footerText: {
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },
  signup: {
    textDecorationLine: "underline",
    color: "blue",
    fontSize: 13,
  },

  choose: {
    width: "100%",
    alignItems: "flex-start",
  },
  content: {
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  titlech: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginBottom: -15,
    paddingLeft: 20,
    paddingTop: 15,
  },
  btt: {
    alignItems: "center",
  },
  buttonphoto: {
    width: 120,
    height: 100,
    backgroundColor: "white",
    marginTop: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 50,
    height: 70,
    position: "relative",
    overflow: "hidden", // ตัดส่วนเกินของรูปภาพ
    marginTop: -5,
    marginLeft: 10,
  },
  cardcustomer: {
    width: 90,
    height: 60,
    position: "relative",
    overflow: "hidden", // ตัดส่วนเกินของรูปภาพ
    // marginTop: -10,
    // marginLeft: 10
    justifyContent: "center",
  },
  imagephoto: {
    width: "100%",
    height: "130%", // ขยายรูปภาพให้เกินขอบด้านล่าง
    transform: [{ translateY: 10 }], // เลื่อนขึ้นเพื่อตัดขอบด้านล่าง
  },
  namebtt: {
    color: "black",
    fontSize: 16,
    marginTop: 5,
  },
});
