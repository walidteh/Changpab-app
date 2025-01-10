import React from 'react';
import { View, Text } from 'react-native';

const Detail = ({ route }) => {
  // เช็กว่ามี route.params.id หรือไม่
  const { id } = route.params || {}; // ใช้ default value ถ้าไม่มี params

  // log ค่า id ที่ได้รับ
  console.log("Received id: ", id);

  return (
    <View>
        <Text>{route.params.id}</Text>
        <Text>{route.params.id}</Text>
        <Text>{route.params.id}</Text>
      {id ? (
        // ถ้ามี id ให้แสดงค่า
        <Text>{id}</Text>
      ) : (
        // ถ้าไม่มี id ให้แสดงข้อความเตือน
        <Text>No ID found in pdasdasdasdasdasdarams</Text>
      )}

      {/* ทดสอบการแสดงผลแบบอื่น */}
      <Text>Route Params ID: {id || "No ID provided"}</Text>

      {/* คุณสามารถเพิ่มข้อความเตือนหรือการแสดงผลเพิ่มเติมได้ */}
    </View>
  );
};

export default Detail;

