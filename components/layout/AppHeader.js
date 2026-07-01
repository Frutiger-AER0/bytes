import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLayout } from '../../context/LayoutContext';

const AppHeader = ({ navigation, showMenuButton = true, showBackButton = false }) => {
  const { darkMode } = useLayout();

  return (
    <View className={`w-full h-[100px] flex-row items-end px-[15px] border-b pt-[10px] pb-[10px] ${darkMode ? 'bg-gray-800 border-b-gray-700' : 'bg-[#f8f8f8] border-b-[#e0e0e0]'}`}>
      <View className="w-[42px] h-[42px] justify-center items-center">
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color={darkMode ? "white" : "black"} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 justify-center items-center">
        <Text className={`text-[24px] font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Bytes</Text>
      </View>

      <View className="w-[42px] h-[42px] justify-center items-center">
        {showMenuButton && (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="menu" size={32} color={darkMode ? "white" : "black"} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppHeader;
