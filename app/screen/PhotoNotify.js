import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faTimes, faMagnifyingGlass, faArrowLeft, faHouse, faBell, faUser, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const photographers = [
  { id: 1, name: 'fauzan studio' },
  { id: 2, name: 'fullframe' },
  { id: 3, name: 'hilmee photographer' },
  { id: 4, name: 'kasut buruk' },
  { id: 5, name: 'pl-photographer' },
  { id: 6, name: 'Supang' },
  { id: 7, name: 'fauzan studio' },
  { id: 8, name: 'fullframe' },
  { id: 9, name: 'hilmee photographer' },
  { id: 10, name: 'kasut buruk' },
  { id: 11, name: 'pl-photographer' },
  { id: 12, name: 'Supang' },
];

const PhotoNotify = ({ navigation }) => {
  
  const PhotoIdex = () => {
    navigation.navigate('PhotoIndex');
  };

  const PhotoSearce = () => {
    navigation.navigate('PhotoSearch');
  };

  const PhotoNotify = () => {
    navigation.navigate('PhotoNotify');
  };

  const PhotoProfile = () => {
    navigation.navigate('PhotoProfile');
  };

  const PhotoPost = () => {
    navigation.navigate('PhotoPost');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.leftBox}>
          <Text style={styles.titleTop}>CHANGPAB</Text>
        </View>
        <View style={styles.rightBox}>
          <FontAwesomeIcon icon={faBars} size={25} color="#000" />
        </View>
      </View>

      {/* ย้อนกลับ */}
      <View style={styles.exit}>
        <TouchableOpacity
          style={styles.exitIcon}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={18}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={styles.exitText}>
          แจ้งเตือน
        </Text>
      </View>

      {/*เนื้อหา*/}
      <ScrollView>
        <View style={styles.message}>
          {photographers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => PhotoNotify()}
            >
              <Text style={styles.name}>{item.id}</Text>
              <Text style={styles.sub}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* เมนูด้านล่าง */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoIdex}>
          <FontAwesomeIcon
            icon={faHouse}
            size={24}
            color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoSearce}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={24}
            color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoPost}>
          <FontAwesomeIcon
            icon={faSquarePlus}
            size={24}
            color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoNotify}>
          <FontAwesomeIcon
            icon={faBell}
            size={24}
            color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={PhotoProfile}>
          <FontAwesomeIcon
            icon={faUser}
            size={24}
            color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80, // ชดเชยความสูงของ Navbar
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90, // ความสูงของ Navbar
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignItems: 'flex-end',
  },
  titleTop: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  exit: {
    flexDirection: 'row', // จัดเรียงไอเท็มในแนวนอน
    alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
    justifyContent: 'center', // ข้อความอยู่ตรงกลาง
    paddingVertical: 10,
    position: 'relative', // เพื่อจัดไอคอนให้อยู่ซ้ายสุด
  },
  exitIcon: {
    position: 'absolute', // ทำให้ไอคอนย้ายไปด้านซ้ายสุด
    left: 20, // ระยะห่างจากขอบซ้าย
  },
  exitText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  message: {
    marginBottom: 80,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 15,
    marginBottom: 10,
  },
  item: {
    width: '100%', // กำหนดให้กล่องแต่ละอันครึ่งหนึ่งของหน้าจอ
    backgroundColor: '#f9f9f9',
    borderWidth: 1, // ความกว้างของเส้นขอบ
    borderColor: '#ddd', // สีของเส้นขอบ
    padding: 10,
  },

  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: -10 }], // ดันขึ้นครึ่งหนึ่งของความสูงเมนู
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 100,
    marginHorizontal: 16, // เพิ่มขอบซ้ายขวา
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5, // สำหรับ Android
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PhotoNotify