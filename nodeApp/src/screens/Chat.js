import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GiftedChat, Send, Composer,InputToolbar } from 'react-native-gifted-chat';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ImageBackground,View,TouchableOpacity,Text,StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Image from '../../assets/chat.jpg'

const Chat = ({route,navigation}) => {
    const [senderId , setSenderId] = useState('');
    const [reciverId , setReciverId] = useState(route.params.data._id);
    const [messages, setMessages] = useState([]);
    const socket = useRef(null);

    const {data} = route.params

    const getUserData = async () => {
        try {
            const value = await AsyncStorage.getItem('userData');
            if (value !== null) {
                const userData = JSON.parse(value);
                setSenderId(userData._id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUserData();
        socket.current = io("http://192.168.100.4:5000");
        socket.current.emit('register', senderId);
    
        socket.current.on('message', (messageData) => {
            setMessages(previousMessages => GiftedChat.append(previousMessages, messageData));
        });
    
        return () => {
            socket.current.disconnect();
        };
    }, []);

    const onSend = useCallback((messages = []) => {
        if (socket.current) {
            socket.current.emit('message', {
                text: messages[0].text,
                senderId,
                reciverId
            });
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, [senderId, reciverId]);

    const renderSend = (props) => {
        return (
            <Send {...props} alwaysShowSend>
                <View style={{marginRight: 10,marginBottom:8}}>
                    <Icon name="send" size={30} color={props.text.trim().length > 0 ? "#000" : "#ccc"} />
                </View>
            </Send>
        );
    }
    
    const  renderInputToolbar = (props) => (
        <InputToolbar
          {...props}
          containerStyle={{
            borderTopWidth: 1,
            borderColor: '#E8E8E8',
            backgroundColor: 'white',
            borderRadius: 12,
            // marginBottom: 6,
            marginLeft: 6,   // <- Space from the left
            marginRight: 6,  // <- Space from the right
          }}
          primaryStyle={{ alignItems: 'center' }} // Create space for the + button
        />
      );
      

    return (
        <>
        {/* header part  */}
        <View style={styles.header}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Icon name='arrow-left' size={29} style={{left:8}}/>
            </TouchableOpacity>
            <Text style={styles.headerName}> {data.name} </Text>
        </View>
        {/* chat body */}
        <ImageBackground source={Image} style={{flex:1}}> 
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: reciverId,
            }}
            renderSend={renderSend}
            renderInputToolbar={renderInputToolbar}
        // alwaysShowSend = {true}
        textInputStyle ={{backgroundColor:'#fff',borderRadius:12}}
        />
        </ImageBackground>
        </>
    );
};

export default Chat;

const styles = StyleSheet.create({
    header:{
        backgroundColor:'#fff',
        height:"6%",
        flexDirection:'row',
        alignItems:'center'
    },
    headerName:{
        fontSize:18,
        fontWeight:'400',
        color:'#000',
        left:12,
        fontFamily:'sans-serif'
    }
})
