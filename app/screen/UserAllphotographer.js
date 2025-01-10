import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faHouse, faMagnifyingGlass, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const photographers = [
  { id: 1, name: 'fauzan sasdasdtudio', image: require('../assets/photographer/fauzan studio.jpg') },
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

const Allphotographer = () => {
  const navigation = useNavigation();

  const UserIdex = () => {
    navigation.navigate('UserIndex');
  };

  const UserSearce = () => {
    navigation.navigate('UserSearce');
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
          <Image style={styles.logo_user} source={require('../assets/logo/222.jpg')} />
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
          ช่างภาพทั้งหมด
        </Text>
      </View>

      {/* รูป */}
      <ScrollView>
        <View style={styles.body}>
          {photographers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => onPress(item.name)}
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
  logo_user: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  titleTop: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exit: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  exitIcon: {
    marginRight: 8,
    marginLeft: 10,
  },
  exitText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  // ตัวอย่างรูปภาพ
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

  // เมนูด้านล่าง
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: -10 }], // ดันขึ้นครึ่งหนึ่งของความสูงเมนู
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around', // จัดวางไอเท็มให้มีระยะห่างเท่ากัน
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

export default Allphotographer;
