import { StyleSheet, View, Image, Pressable, ActivityIndicator, Text, Animated, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

const GetStart = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const scaleValue = useRef(new Animated.Value(1)).current; // สำหรับแอนิเมชั่นการขยายของโลโก้
  const translateY = useRef(new Animated.Value(0)).current; // สำหรับแอนิเมชั่นการเคลื่อนที่ในแนว Y
  const logoScale = useRef(new Animated.Value(1)).current; // สำหรับแอนิเมชั่นการซูมโลโก้

  useEffect(() => {
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
      // ซูมโลโก้เข้าออกหลังจาก cooldown เริ่ม
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.05, // ขยายโลโก้
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1, // หดโลโก้กลับ
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

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
  }, [scaleValue, translateY, logoScale]);

  const onPress = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate('Choose');
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <Animated.Image
            source={require('../assets/logo/camera.png')}
            style={[
              styles.image,
              {
                transform: [
                  { scale: scaleValue },
                  { translateY: translateY },
                  { scale: logoScale } // เพิ่มการซูมโลโก้เข้าออก
                ]
              },
            ]}
          />
          {cooldown ? (
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
                <Text style={styles.buttonText}>Get Started </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 280, // ขนาดโลโก้
    height: 220,
    marginBottom: 60,
  },
  cooldownText: {
    color: '#fff',
    fontSize: 30,
    marginTop: -30,
  },
  subText: {
    color: '#fff',
    fontSize: 24,
    marginTop: 5,
    textAlign: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 28,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  details: {
    top: -150
  },
  button: {
    backgroundColor: 'white',
    height: 60,
    width: 170,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    top: 50,
  },
  buttonText: {
    //borderColor: 'red',
    //borderWidth: 1,
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default GetStart;
