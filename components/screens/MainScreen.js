import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../layout/AppHeader';

const MainScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      <AppHeader navigation={navigation} />
      <View className="flex-1 justify-center items-center">
        <Text>Welcome to MainScreen!</Text>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        onPress={() => navigation.navigate('CreateHotspot')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;
