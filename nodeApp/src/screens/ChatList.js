import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, { useCallback } from 'react';
import {useEffect, useState} from 'react';
import { TouchableOpacity } from 'react-native';

const ChatList = ({navigation}) => {
  const [userData, setUserData] = useState([]);

  const getAllUser = async () => {
    try {
      await fetch('http://192.168.100.4:5000/all_users')
        .then(res => res.json())
        .then(res => setUserData(res.users));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const onPressItem = useCallback((item)=>{
    navigation.navigate('chat',{
      data: item
    })
  },[])

  const renderItem = ({item}) => {
    return (
      <View
        style={styles.mainView}
      >
        <TouchableOpacity 
        onPress={()=>onPressItem(item)}
        style={{padding:6, flexDirection:'row'}}>
          <View>
            <Text style={{fontWeight:'bold', fontSize:16}}>Name :</Text>
            <Text style={{fontWeight:'bold', fontSize:16}}>UserName :</Text>
            <Text style={{fontWeight:'bold', fontSize:16}}>Email :</Text>
          </View>
          <View style={{marginLeft:8}}>
            <Text>{item.name}</Text>
            <Text>{item.username}</Text>
            <Text>{item.email}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex:1,bottom:6}}>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          marginTop: 6,
          color: 'black',
        }}
      >
        Register User
      </Text>
      <FlatList
        data={userData}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#fff',
    margin: 4,
    padding: 4,
    borderRadius: 10,
    shadowColor : '#EFEFEF',
    shadowOffset: {width: -2, height: 4},  
    shadowColor: 'gray',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
    
  },
});
