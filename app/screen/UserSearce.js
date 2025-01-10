import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faTimes, faMagnifyingGlass, faArrowLeft, faHouse, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const photographers = [
  { id: 1, name: 'fauzan studio', image: require('../assets/photographer/fauzan studio.jpg') },
  { id: 2, name: 'fullframe', image: require('../assets/photographer/fullframe.jpg') },
  { id: 3, name: 'hilmee photographer', image: require('../assets/photographer/hilmee photographer.jpg') },
  { id: 4, name: 'kasut buruk', image: require('../assets/photographer/kasut buruk.png') },
  { id: 5, name: 'pl-photographer', image: require('../assets/photographer/pl-photographer.jpg') },
  { id: 6, name: 'Supang', image: require('../assets/photographer/supang.jpg') },
  { id: 7, name: 'fauzan studio', image: require('../assets/photographer/fauzan studio.jpg') },
  { id: 8, name: 'fullframe', image: require('../assets/photographer/fullframe.jpg') },
  { id: 9, name: 'hilmee photographer', image: require('../assets/photographer/hilmee photographer.jpg') },
  { id: 10, name: 'kasut buruk', image: require('../assets/photographer/kasut buruk.png') },
  { id: 11, name: 'pl-photographer', image: require('../assets/photographer/pl-photographer.jpg') },
  { id: 12, name: 'Supang', image: require('../assets/photographer/supang.jpg') },
];

const UserSearch = () => {
  const [text, setText] = useState('');

  // ฟังก์ชั่นลบข้อความเมื่อกดปุ่ม
  const clearText = () => {
    setText('');
  };

  const navigation = useNavigation();

  const UserIdex = () => {
    navigation.navigate('Userindex');
  };

  const UserSearce = () => {
    navigation.navigate('UserSearch');
  };

  const UserNotify = () => {
    navigation.navigate('UserNotify');
  };

  const UserProfile = () => {
    navigation.navigate('UserProfile');
  };

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
          ค้นหาช่างภาพ
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.search}>
        <TextInput
          placeholder="Search"
          value={text} // ค่าของ TextInput
          onChangeText={setText} // ฟังก์ชันในการเปลี่ยนข้อความ
          style={styles.bttsearch}
        />
        {text.length === 0 && (
          <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="#B7B7B7" style={styles.searchIcon} />
        )}
        {text.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearText}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 15 }}>
        <TouchableOpacity style={styles.boxfillter}>
          <Text>แต่งงาน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxfillter}>
          <Text>แต่งงาน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxfillter}>
          <Text>แต่งงาน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxfillter}>
          <Text>แต่งงาน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxfillter}>
          <Text>แต่งงาน</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView>
        <View style={styles.body}>
          {photographers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => Profile(item.id)}
            >
              <Image source={item.image} style={styles.image_body} />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* เมนูด้านล่าง */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={UserIdex}>
          <FontAwesomeIcon
            icon={faHouse}
            size={24}
            color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={UserSearce}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={24}
            color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={UserNotify}>
          <FontAwesomeIcon
            icon={faBell}
            size={24}
            color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={UserProfile}>
          <FontAwesomeIcon
            icon={faUser}
            size={24}
            color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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

  search: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    position: 'relative', // เพื่อให้ไอคอนอยู่ในตำแหน่งที่เหมาะสม
  },
  searchIcon: {
    position: 'absolute',
    right: 15, // ตำแหน่งไอคอนค้นหาที่ด้านซ้าย
    top: '50%',
    transform: [{ translateY: -10 }], // ไอคอนอยู่กลางแนวตั้ง
  },
  bttsearch: {
    width: '100%',
    height: 45,
    backgroundColor: '#EEECEC',
    borderRadius: 10,
    paddingLeft: 15, // เพิ่มช่องว่างให้ข้อความไม่ทับไอคอนค้นหา
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    right: 10, // ตำแหน่งไอคอนลบที่ด้านขวา
    top: '50%',
    transform: [{ translateY: -10 }], // ไอคอนอยู่กลางแนวตั้ง
  },

  boxfillter: {
    width: 100,
    height: 35,
    borderRadius: 100,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 18,
  },

  body: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap', // จัดเรียงหลายคอลัมน์
    justifyContent: 'space-between',
  },
  item: {
    width: '48%', // ขนาดกล่อง 48% เพื่อให้มีระยะห่างระหว่างกล่อง
    aspectRatio: 1, // ทำให้กล่องเป็นสี่เหลี่ยมจัตุรัส
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // สำหรับ Android
  },
  image_body: {
    width: '70%',
    height: '70%',
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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

export default UserSearch;
