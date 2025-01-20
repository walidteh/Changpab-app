import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import login from './screen/login.js'
import Getstart from './screen/OldGetstart';
import signup from './screen/signup.js';

import photoindex from './screen/PhotoIndex.js';
import PhotoAllphotographer from './screen/PhotoAllphotographer.js';
import PhotoAllPicture from './screen/PhotoAllpicture.js';
import PhotoSearch from './screen/PhotoSearce.js'
import PhotoProfile from './screen/PhotoProfile.js';
import PhotoNotify from './screen/PhotoNotify.js';
import PhotoPost from './screen/PhotoPost.js';
import PhotoDetailPost from './screen/PhotoDetailPost.js';
import PhotoProfileEdit from './screen/PhotoProfileEdit.js';
import PhotoDetailUser from './screen/PhotoDetailUser.js';

import Userindex from './screen/UserIndex.js'
import UserProfile from './screen/UserProfile.js'
import UserAllphotographer from './screen/UserAllpicture.js'
import UserAllpicture from './screen/UserAllpicture.js'
import UserSearch from './screen/UserSearce.js'
import UserNotify from './screen/UserNotify.js'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="GetStart"
          component={Getstart}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen name="login" component={login} options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="signup" component={signup} options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="PhotoIndex" component={photoindex} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoAllphotographer" component={PhotoAllphotographer} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoAllpicture" component={PhotoAllPicture} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoSearch" component={PhotoSearch} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoProfile" component={PhotoProfile} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoNotify" component={PhotoNotify} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoPost" component={PhotoPost} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoProfileEdit" component={PhotoProfileEdit} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoDetailPost" component={PhotoDetailPost} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="PhotoDetailUser" component={PhotoDetailUser} options={{ headerShown: false, animation: 'none'}} />
        <Stack.Screen name="Userindex" component={Userindex} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="Allphotographer" component={UserAllphotographer} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="Allpicture" component={UserAllpicture} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="UserSearch" component={UserSearch} options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="UserNotify" component={UserNotify} options={{ headerShown: false, animation: 'none' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App