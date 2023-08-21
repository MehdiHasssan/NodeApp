import React, {useState} from 'react';
import {Text, TextInput, View, SafeAreaView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../Fonts/Colors';

const CustomInput = ({
  lable,
  IconName,
  error,
  onChangeText,
  password,
  value,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsfocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);
  return (
    <SafeAreaView>
      <View style={{paddingHorizontal: 20}}>
        <View>
          <Text style={{fontSize: 14, color: '#000', paddingVertical: 5}}>
            {lable}
          </Text>
        </View>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: error
                ? Colors.red
                : isFocused
                ? Colors.blue
                : Colors.light,
            },
          ]}
        >
          <Icon
            name={IconName}
            style={{fontSize: 22, color: Colors.darkBlue, marginRight: 10}}
          />
          <TextInput
            secureTextEntry={hidePassword}
            onChangeText={onChangeText}
            value={value}
            style={{color: Colors.darkBlue, flex: 1}}
            {...props}
          />
          {password && (
            <Icon
              onPress={() => setHidePassword(!hidePassword)}
              style={{fontSize: 22, color: Colors.darkBlue}}
              name={hidePassword ? 'eye-outline' : 'eye-off'}
            />
          )}
        </View>
        {error && <Text style={{color: Colors.red}}> {error} </Text>}
      </View>
    </SafeAreaView>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    height: 40,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    color: '#000',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Colors.light,
    marginVertical: 10,
  },
});
