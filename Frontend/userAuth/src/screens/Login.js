import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Colors from '../../Fonts/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    const data = {
      username: username,
      password: password,
    };
    try {
      fetch('http://192.168.100.4:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(resData => {
          if (resData.auth) {
            const {token, user} = resData;
            AsyncStorage.setItem('accessToken', token);
            AsyncStorage.setItem('userData', JSON.stringify(user)).then(() => {
              navigation.navigate('home');
            });
          } else {
            setMessage(resData.message);
            setTimeout(() => {
              setTimeout(() => {
                setMessage('');
              }, 2000);
            });
          }
        });
    } catch (error) {
      console.log(error, 'hello error');
    }
  };

  return (
    <View style={styles.main}>
      <Text
        style={{textAlign: 'center', color: 'red', fontSize: 15, bottom: 12}}
      >
        {(error = message)}
      </Text>

      <View style={{alignItems: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Login</Text>
      </View>
      <View style={styles.input}>
        <CustomInput
          lable="Username"
          placeholder="username"
          IconName="account"
          onChangeText={text => setUsername(text)}
          value={username}
          error={message.username}
        />

        <CustomInput
          lable="Password"
          IconName="lock"
          placeholder="password"
          onChangeText={text => setPassword(text)}
          value={password}
          password
          error={message.password}
        />
      </View>
      <View>
        <CustomButton btnText="Login" onPress={handleLogin} />
      </View>

      <View style={{marginHorizontal: 25, height: 50, top: 24}}>
        <Text style={styles.loginText1}>
          don't have an account?
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.loginText2}>Register</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    justifyContent: 'center',
  },
  loginBtn: {},
  loginText1: {
    color: 'gray',
  },
  loginText2: {
    color: 'blue',
    fontSize: 14,
    fontWeight: 'bold',
    top: 9,
    marginLeft: 7,
    padding: 8,
  },
});
