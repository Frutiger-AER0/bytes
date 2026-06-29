import React from 'react';
import { View, Text } from 'react-native';
import AppHeader from '../layout/AppHeader';

const SettingScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      <AppHeader navigation={navigation} showMenuButton={false} showBackButton={true} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">Setting Screen</Text>
      </View>
    </View>
  );
};

export default SettingScreen;
