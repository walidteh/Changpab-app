import { View, Text, SafeAreaView, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'

const Choose = ({navigation}) => {

  const photographer = () => {
    navigation.navigate('PhotoIndex')
  }

  const user = () => {
    navigation.navigate('UserIndex')
  }

  const login = () => {
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View stylel={styles.content}>
        <Text style={styles.title}>
          คุณคือใคร
        </Text>
        <Pressable style={styles.buttonphoto} onPress={photographer}>
          <View style={styles.card}>
            <Image
              source={require('../assets/icon/photographer.png')}
              style={styles.imagephoto}
            />
          </View>
          <Text style={styles.namebtt}>
            ช่างภาพ
          </Text>
        </Pressable>
        <Pressable style={styles.buttonphoto} onPress={user}>
          <View style={styles.cardcustomer}>
            <Image
              source={require('../assets/icon/mix.png')}
              style={styles.imagephoto}
            />
          </View>
          <Text style={styles.namebtt}>
            ลูกค้า
          </Text>
        </Pressable>
        <Pressable style={styles.buttonphoto} onPress={login}>
          <View style={styles.cardcustomer}>
            <Image
              source={require('../assets/icon/mix.png')}
              style={styles.imagephoto}
            />
          </View>
          <Text style={styles.namebtt}>
            login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#072432",
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: -15
  },
  buttonphoto: {
    width: 200,
    height: 150,
    backgroundColor: 'white',
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 110,
    position: 'relative',
    overflow: 'hidden', // ตัดส่วนเกินของรูปภาพ
    marginTop: -5,
    marginLeft: 10
  },
  cardcustomer: {
    width: 150,
    height: 100,
    position: 'relative',
    overflow: 'hidden', // ตัดส่วนเกินของรูปภาพ
    marginTop: -5,
    marginLeft: 10
  },
  imagephoto: {
    width: '100%',
    height: '130%', // ขยายรูปภาพให้เกินขอบด้านล่าง
    transform: [{ translateY: 10 }], // เลื่อนขึ้นเพื่อตัดขอบด้านล่าง
  },
  namebtt: {
    color: 'black',
    fontSize: 20,
    marginTop: 5
  }
})

export default Choose