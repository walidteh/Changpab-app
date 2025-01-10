import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faMagnifyingGlass, faBell, faUser, faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const photographers = [
  { id: 1, name: 'fauzan studio', image: require('../assets/photographer/fauzan studio.jpg') },
];

const UserProfile = ({ navigation }) => {

  const [selectedMenu, setSelectedMenu] = useState('หน้าหลัก'); // เก็บสถานะของเมนูที่เลือก

  const renderContent = () => {
    if (selectedMenu === 'หน้าหลัก') {
      return <Text>นี่คือเนื้อหาสำหรับ "หน้าหลัก"</Text>;
    } else if (selectedMenu === 'ถูกใจ') {
      return <Text>นี่คือเนื้อหาสำหรับ "ถูกใจ"</Text>;
    }
    return null;
  };

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
          <FontAwesomeIcon icon={faBars} size={25} color='#000' />
        </View>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={require('../assets/background/03.jpg')}
              style={styles.imageBackground}
              resizeMode="cover"
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <Image
                source={require('../assets/logo/222.jpg')}
                style={styles.logo}
              />
            </ImageBackground>
          </View>
          {/* ชื่อ และ เมนู */}
          <View style={styles.info}>
            {photographers.map((item) => (
              <Text key={item.id} style={styles.name}>
                {item.name}
              </Text>
            ))}
            <View style={styles.menuInfo}>
              <TouchableOpacity
                style={styles.titleInfo}
                onPress={() => setSelectedMenu('หน้าหลัก')}
              >
                <Text style={selectedMenu === 'หน้าหลัก' ? styles.activeMenu : null}>
                  หน้าหลัก
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.titleInfo}
                onPress={() => setSelectedMenu('ถูกใจ')}
              >
                <Text style={selectedMenu === 'ถูกใจ' ? styles.activeMenu : null}>
                  ถูกใจ
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ส่วนเนื้อหาที่จะเปลี่ยน */}
          <View style={styles.dynamicContent}>
            {renderContent()}
          </View>
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
  content: {
    width: 'auto'
  },
  imageContainer: {
    width: '100%',
    height: 220,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },

  info: {
    width: '100%',
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  menuInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  titleInfo: {
    paddingTop: 10,
    fontSize: 20,
  },

  dynamicContent: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  activeMenu: {
    fontWeight: 'bold',
    color: 'blue',
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

export default UserProfile;
