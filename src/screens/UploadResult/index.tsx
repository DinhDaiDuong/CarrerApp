import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TRootStackNav} from '@utils/types/RootStackNav';
import {navigationRef} from '@navigation';
type Props = NativeStackScreenProps<TRootStackNav, 'UploadResult'>;
const UploadResult = () => {
  return (
    <View>
      <TouchableOpacity
        // onPress={() => navigationRef.navigate('Result')}
        style={{
          paddingHorizontal: 40,
          paddingVertical: 20,
          backgroundColor: 'red',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
          }}>
          Navigation to Result
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadResult;
