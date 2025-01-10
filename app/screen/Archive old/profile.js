import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handlePress = () => {
    // ฟังก์ชันที่ต้องการให้ทำเมื่อกด
    navigation.navigate('Home');
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        // ถ้าไม่มี token หรือ token หมดอายุ ให้ไปหน้า login
        alert('Token not found. Please log in again.');
        return; // หรือทำการ redirect ไปหน้า login
      }

      const response = await fetch('http://192.168.1.9:8080/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // เพิ่มช่องว่างระหว่าง Bearer และ token
        },
      });

      const data = await response.json();
      console.log(data);  // ตรวจสอบโครงสร้างข้อมูลที่ได้จาก API

      if (data.status === 'ok') {
        setUser(data.userId); // เก็บข้อมูลผู้ใช้ใน state
      } else {
        alert('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error fetching user data');
    } finally {
      setIsLoading(false); // เปลี่ยนสถานะการโหลดเมื่อเรียบร้อยแล้ว
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // ใช้ [] เป็น dependency เพื่อให้เรียกแค่ครั้งเดียวตอนคอมโพเนนต์ถูกสร้าง

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text>{user.Fullname || 'No Fullname Available'}</Text>
          <Text>{user.Lastname || 'No Lastname Available'}</Text>
          <Text>{user.Email || 'No Email Available'}</Text>
          <Text>{user.Username || 'No Email Available'}</Text>
          <Text>{user.Password || 'No Email Available'}</Text>
        </View>
      )}

    <Pressable onPress= {() => navigation.navigate('Home')}>
      <Image
        source={require('../assets/logo/home.png')}
        style={styles.image}
      />
    </Pressable>
      {/* <View style={styles.container}>
            <Image
              source={require('../assets/home.png')}
              style={styles.image} 
            />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',  
    bottom: 0,          
    left: 0,              
    margin: 16,           
  },
  image: {
    width: 100,         
    height: 100,           
  },
});

export default Profile;
