import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import PostItem from '../components/PostsList';

const Home = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [baseImage, setBaseImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [postData, setPostData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  // console.log(userId,'userId')

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = JSON.parse(await AsyncStorage.getItem('userData'));
        setUserId(userData);
      } catch (error) {
        console.log('Error retrieving user data:', error);
      }
    }
    fetchUserData();
    fetchPosts();
  }, []);

  const clearText = () => {
    setTitle('');
    setContent('');
    setSelectedImage(null);
  };

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

        setSelectedImage(result.assets[0].uri); // Set the selected image URI

        setBaseImage(base64Image);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  // posts  upload  api
  const handleUploadData = async () => {
    try {
      const apiEndpoint = 'http://192.168.100.4:5000/posts';
      const data = {
        author: userId?._id,
        title,
        content,
        photo: baseImage,
      };
      // console.log(data,'dataaaa')

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(res => {
          console.log(res, 'response data');
          if (res.message === 'post uploaded successfully') {
            setMessage('Post Uploaded Successfully');
            fetchPosts();
            setTimeout(() => {
              setMessage('');
              // Empty the variables
              clearText();
            }, 2000);
          }
        });
    } catch (error) {
      console.log('Error uploading data:', error);
    }
  };

  //Refresh controller
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true to show the loading indicator
    fetchPosts(); // Fetch the posts again from the server
  };
  // Fetching Post from database
  const fetchPosts = async () => {
    try {
      await fetch('http://192.168.100.4:5000/posts/get_all_posts')
        .then(res => res.json())
        .then(res => {
          setPostData(res.posts);
          setRefreshing(false);
        });
    } catch (error) {
      console.log('Error ', error);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', color: 'green', top: 7}}>
        {' '}
        {message}{' '}
      </Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
        multiline
      />
      <TouchableOpacity onPress={handleSelectImage}>
        {selectedImage ? (
          <Image source={{uri: selectedImage}} style={styles.selectedImage} />
        ) : (
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        )}
      </TouchableOpacity>

      {selectedImage && title && content && (
        <TouchableOpacity
          onPress={handleUploadData}
          style={styles.uploadButton}
        >
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      )}

      <View style={styles.postMainView}>
        <FlatList
          data={postData}
          keyExtractor={index => index.photo}
          renderItem={({item}) => (
            <PostItem data={item} fetchPosts={fetchPosts} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
    justifyContent: 'center',
  },
  selectedImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  uploadButton: {
    marginTop: 12,
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 14,
  },
  postMainView: {
    flex: 1,
    paddingHorizontal: 22,
    marginBottom: 60,
    width: '100%',
    marginBottom: 60,
  },
});
