import React, { useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import app_var from './public';

export default function LoginForm({ navigation }) {
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setconfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fontsLoaded] = useFonts({
        'Kanit-ExtraLight': require('../assets/fonts/Kanit-ExtraLight.ttf'),
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
            navigation.navigate('login');
            setLoading(false);
        }, 200);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "username": username,
            "password": password,
            "fullname": firstname,
            "lastname": lastname,
            "email": email
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://" + app_var.api_host + "/register", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                if (result.status === 'ok') {
                    Alert.alert(
                        "Success",
                        result.message, // ใช้ข้อความที่ได้จากการ login
                        [{
                            text: "OK",
                            onPress: () => {
                                // เมื่อผู้ใช้กด "OK" ใน Alert ให้ทำการนำทางไปหน้า profile
                                navigation.navigate('login'); // แก้ไขเป็นชื่อหน้าที่ต้องการ
                            }
                        }]
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
                            colors={['#063B52', '#063B52']}
                            style={styles.logo}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.5, y: 0.5 }}
                            locations={[0, 1]}
                        >
                            <Animated.Image
                                source={require('../assets/camera1.png')}
                                style={[styles.image, { transform: [{ scale: scaleValue }] }]}
                            />
                            <Text style={styles.detail}>Ready to find a photographer?</Text>
                            <Text style={styles.detail}>Sign up and begib your</Text>
                            <Text style={styles.detail}>advebture!</Text>
                        </LinearGradient>

                        <View style={styles.inputView}>
                            <Text style={styles.intoinput}>First name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your first name"
                                value={firstname}
                                onChangeText={setFirstname}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                            <Text style={styles.intoinput}>Last name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your username"
                                value={lastname}
                                onChangeText={setLastname}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                            <Text style={styles.intoinput}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your username"
                                value={email}
                                onChangeText={setemail}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                            <Text style={styles.intoinput}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Type a password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                            <Text style={styles.intoinput}>username</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="username"
                                secureTextEntry
                                value={username}
                                onChangeText={setUsername}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.buttonView}>
                            <Pressable style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Next</Text>
                            </Pressable>


                        </View>

                        <Text style={styles.footerText}>Already have an account? <Text style={styles.signup} onPress={onPress}>Login</Text>
                        </Text>
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
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    image: {
        height: 160,
        width: 170,
        marginBottom: -20,
        // borderColor: 'red',
        // borderWidth:1
    },
    logo: {
        width: 450,
        height: 320,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
    },
    detail: {
        fontSize: 18,
        paddingVertical: 5,
        fontFamily: 'Kanit-ExtraLight',
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        color: "white"
    },
    inputView: {
        gap: 5,
        width: "100%",
        paddingTop: 15,
        paddingHorizontal: 30,
    },
    input: {
        height: 50,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        borderRadius: 10
    },
    intoinput: {
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
        margin: 15
    },
    checkboxContainer: {
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    rememberText: {
        fontSize: 13
    },
    forgetText: {
        fontSize: 11,
        color: "#39619D"
    },
    button: {
        backgroundColor: "#063B52",
        height: 45,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 150,
        margin: 30
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 6,
        color: "gray",
        fontSize: 13,
        marginBottom: 1
    },
    googleButton: {
        backgroundColor: "white",
        height: 45,
        width: 350,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    googleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
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
        textAlign: "center",
        color: "gray",
    },
    signup: {
        textDecorationLine: 'underline',
        color: "blue",
        fontSize: 13
    }
});
