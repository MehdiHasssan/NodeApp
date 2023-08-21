import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';   

const PostItem = React.memo(({ data,fetchPosts }) => {
  const [message, setMessage] = useState('');

  const navigation = useNavigation();
     // handle delete button 
  const handleDeletePost = async(postId)=>{
    // console.log(postId, 'deleted successfully')
    try{
      await fetch (`http://192.168.100.4:5000/delete_posts/${postId}`,{
        method:"DELETE"
      })
      .then((res)=>res.json())
      .then (res=>{
        if(res){
          res.message === "deleted successfully"
          setMessage("Post Deleted Successfully")
        }
        fetchPosts()

        setTimeout(()=>{
          setMessage('')
        },2000)
      })

    }
    catch(error){
      console.log(error)
    }
  }


    return (
      <View key={data.photo} style={styles.flatlistContainer}>
        <Text style={{fontWeight: 'bold', color: 'green',top:7}}> {message} </Text>
         <View style= {{ flexDirection : 'row'}}>
         {data ? (
                 <Image
                    style={{height: 100, width: 100 , resizeMode : 'contain' , borderRadius : 50}}
                    source={{uri: data.photo}}
                  />
              ) : (
                <Text>No photo available</Text>
              )}
              <View style = {{justifyContent : 'center'}}>

              <Text style={{left:12,margin:4}}><Text style={{fontWeight:'bold',fontSize:14,}}>Title:</Text>{data.title}</Text>
              <Text style={{left:12,margin:4}}><Text style={{fontWeight:'bold',fontSize:14}}>Content:</Text>{data.content}</Text>
              </View>
              

              </View>
                  {/* button view */}
                  <View style= {styles.buttonView}>
                {/* delete button */}
                <TouchableOpacity onPress={()=>handleDeletePost(data._id)}>
                <Icon name = "delete" size={23} color={'red'} />
                </TouchableOpacity>
              
              {/* update button */}
                <TouchableOpacity onPress={()=>navigation.navigate('update',{
                  title : data.title,
                  photo:data.photo,
                  content: data.content,
                  postId : data._id,
                  author: data.author,
                  fetchPosts : fetchPosts // passing fetch function for direct update
                })} >
                <Icon name = "book-edit" size={23} color={'blue'} marginLeft={20} />
                </TouchableOpacity>
              </View>
      </View>
    );
  });


export default PostItem

const styles = StyleSheet.create({
    flatlistContainer:{
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems:'center',
        top:10,
        marginTop:12,
        borderColor : "black",
        borderWidth : 1,
        padding : 10,
      },
      buttonView:{
        flexDirection:'row',
        justifyContent:'flex-end',
        alignContent:'flex-end',
        margin:8
    
      },
  
})