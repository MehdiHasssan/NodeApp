import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../../Fonts/Colors';

const CustomButton = ({btnText, onPress}) => {
  return (
    <View style={styles.btnStyle}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.btnText}>{btnText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: Colors.gray,
    marginHorizontal: 20,
    top: 8,
    padding: 8,
    borderRadius: 50,
  },
  btnText: {
    color: 'blue',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
