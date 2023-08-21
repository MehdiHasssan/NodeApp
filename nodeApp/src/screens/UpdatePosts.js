import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UpdatePosts = ({route, navigation}) => {
  const [updateTitle, setUpdateTitle] = useState(route.params.title);
  const [updateContent, setUpdateContent] = useState(route.params.content);
  const [updatePhoto, setUpdatePhoto] = useState(null);
  const [selectedImage, setSelectedImage] = useState(route.params.photo);
  const [message , setMessage] = useState('')

  const postId = route.params.postId;
  const handleSelectImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 500,
        maxHeight: 500,
      };
      const result = await launchImageLibrary(options);
      if (!result.didCancel) {
        // Read the image file as base64
        const base64Image = await RNFS.readFile(result.assets[0].uri, 'base64');

        // Set the selected image URI and updatePhoto state
        // setSelectedImage(result.assets[0].uri);
        setUpdatePhoto(base64Image);
        setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };


  const handleUpdate = async () => {
    const data = {
      postId: postId,
      title: updateTitle,
      content: updateContent,
      photo: updatePhoto,
    };
    const apiEndpoint = `http://192.168.100.4:5000/update_posts`;
    try {
      await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(res => {
          if (res) {
            res.message === 'Post updated successfully';
            setMessage("Post Updated Successfully")
            route.params.fetchPosts();
          }
          setTimeout(()=>{
            setMessage('')
          },4000)
          navigation.goBack();
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>

      <View>
      <Text style={{color:'green'}}>
      {message}
    </Text>
        <TouchableOpacity onPress={handleSelectImage} style={styles.imageView}>
        <Icon name = 'plus' size={32} color="blue" style={styles.icon} />

          {selectedImage ? (
            <Image
              style={{
                height: 100,
                width: 100,
                resizeMode: 'contain',
                borderRadius: 50,
              }}
              source={{
                uri:
                  typeof selectedImage === 'string'
                    ? selectedImage
                    : `data:image/jpeg;base64,${selectedImage}`,
              }}
            />
          ) : (
            <Text>Select Photo</Text>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Title"
          value={updateTitle}
          onChangeText={setUpdateTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Content"
          value={updateContent}
          onChangeText={setUpdateContent}
          style={styles.input}
          multiline
        />
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={{color: 'white', textAlign: 'center'}}>Update</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default UpdatePosts;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  button: {
    width: '80%',
    marginHorizontal: 30,
    backgroundColor: 'blue',
    padding: 7,
    borderRadius: 10,
    top: 12,
  },
  imageView:{
    justifyContent:'center',
    alignItems:'center'
  },
  icon:{
    top:17,
    zIndex:10,
    left:20
  }

});
