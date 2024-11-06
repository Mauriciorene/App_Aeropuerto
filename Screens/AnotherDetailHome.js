import { View, Text,} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function AnotherDetailsHome() {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor:'violet', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>AnotherDatailsHome</Text>
      
    </View>
  );
}