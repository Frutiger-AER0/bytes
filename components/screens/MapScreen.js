import React from 'react';
import { View, Text } from 'react-native';
import AppHeader from '../layout/AppHeader';

const MapScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      <AppHeader navigation={navigation} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">Map Screen</Text>
      </View>
    </View>
  );
};

export default MapScreen;
