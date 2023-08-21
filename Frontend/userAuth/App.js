
import React from 'react';
import {StyleSheet, Text, View,Button} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Registration from './src/screens/Registration';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdatePosts from './src/screens/UpdatePosts';


const Stack = createNativeStackNavigator();

const App = () => {

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
  return (
    <View style={styles.sectionContainer}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Registration} />
          <Stack.Screen name = "update" component={UpdatePosts} />

          <Stack.Screen name = "home" component={Home} 
         options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => Logout(navigation)}
              title="Logout"
              color="blue"
            />
          ),
        })}
        
            />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
