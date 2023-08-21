import { StyleSheet,Button } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../screens/Home';
import UpdatePosts from '../../screens/UpdatePosts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatList from '../../screens/ChatList';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

const BottomNav = () => {

    const Logout =(navigation)=>{
        try {
          fetch('http://192.168.100.4:5000/logout', {
            method: 'POST', // or 'GET' depending on your server implementation
            credentials: 'include', // include credentials to send cookies
          })
            .then(() => {
              // Clear the stored token from AsyncStorage or any other secure storage mechanism
              AsyncStorage.removeItem('accessToken')
            
                .then(() => {
                  navigation.navigate('login');
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }

      // Fetch the user data from AsyncStorage


  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
    
          if (route.name === 'home') {
            iconName = focused
              ? 'home'
              : 'home-outline';  // these are example names for MaterialCommunityIcons
          } else if (route.name === 'chatlist') {
            iconName = focused ? 'chat' : 'chat-outline'; // choose the correct names
          }
    
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
    })}
    
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={({navigation}) => ({
          headerRight: () => (
            <Button
              onPress={() => Logout(navigation)}
              title="Logout"
              color="blue"
            />
          ),
        })}
      />
      <Tab.Screen name="chatlist" component={ChatList} />
    </Tab.Navigator>
  )
}

export default BottomNav

const styles = StyleSheet.create({})