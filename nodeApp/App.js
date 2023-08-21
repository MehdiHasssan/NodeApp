
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import StackNav from './src/components/Navigator/StackNav';



const App = () => {

  
  return (
    <View style={styles.sectionContainer}>
      <NavigationContainer>
        <StackNav />
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
