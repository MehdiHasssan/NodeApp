import {SafeAreaView, StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../components/CustomInput';
import Colors from '../../Fonts/Colors';
import CustomButton from '../components/CustomButton';

const Registration = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassoword] = useState('');

  const handleRegister = async () => {
    const data = {
      name: name,
      username: username,
      email: email,
      password: password,
      confirm_password: confirm_password,
    };

    try {
      await fetch('http://192.168.100.4:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        

        .then(resData => {
          // console.log(resData,'res data')
          if (resData.message === 'Register Successfully') {
            navigation.navigate('login');
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{backgroundColor: '#fff', flex: 1, justifyContent: 'center'}}
    >
      <View style={{paddingVertical: 14}}>
        <Text style={{fontSize: 32, paddingHorizontal: 15, fontWeight: 'bold'}}>
          Registration
        </Text>
        <Text style={{fontSize: 18, paddingHorizontal: 15, color: '#000'}}>
          Enter your detail to register
        </Text>
      </View>
      <View>
        <CustomInput
          IconName="account-outline"
          placeholder="Enter Your Full Name"
          lable="Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <CustomInput
          IconName="account"
          placeholder="Enter Your username"
          lable="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <CustomInput
          IconName="email"
          placeholder="Enter Your Email"
          lable="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <CustomInput
          IconName="lock-outline"
          placeholder="Enter Your Password"
          lable="Password"
          password
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <CustomInput
          IconName="lock"
          placeholder="Confirm Password"
          lable="Confirm Password"
          password
          value={confirm_password}
          onChangeText={text => setConfirmPassoword(text)}
        />
      </View>
      <View>
        <CustomButton btnText="Register" onPress={handleRegister} />
      </View>

      <Text
        style={{color: Colors.gray, fontSize: 18, textAlign: 'center', top: 14}}
      >
        Already have account?{' '}
        <Text
          onPress={() => navigation.navigate('login')}
          style={{fontWeight: 'bold', fontSize: 14, color: 'blue'}}
        >
          Login
        </Text>{' '}
      </Text>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({});
