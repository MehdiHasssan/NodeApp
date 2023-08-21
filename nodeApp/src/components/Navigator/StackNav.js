import {StyleSheet, Text, View,Button} from 'react-native';
import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../../screens/Home';
import Login from '../../screens/Login';
import Registration from '../../screens/Registration';
import UpdatePosts from '../../screens/UpdatePosts';
import BottomNav from './BottomNav';
import Chat from '../../screens/Chat';

const Stack = createNativeStackNavigator();

const StackNav = () => {

    


  return (
    <Stack.Navigator >

        
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Registration} />
      <Stack.Screen name = "tabNav" component={BottomNav} options={{ headerShown: false }}/>

      <Stack.Screen name="update" component={UpdatePosts} />
      <Stack.Screen name = "chat" component = {Chat} options={{headerShown:false}}/>

    </Stack.Navigator>
  );
};

export default StackNav;

const styles = StyleSheet.create({});
