import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppHeader = ({ navigation, showMenuButton = true, showBackButton = false }) => {
  return (
    <View className="w-full h-[100px] flex-row items-end px-[15px] bg-[#f8f8f8] border-b border-b-[#e0e0e0] pt-[10px] pb-[10px]">
      {/* Left Section (Back Button) */}
      <View className="w-[42px] h-[42px] justify-center items-center">
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Section (Title) */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-[24px] font-bold text-black">Bytes</Text>
      </View>

      {/* Right Section (Menu Button) */}
      <View className="w-[42px] h-[42px] justify-center items-center">
        {showMenuButton && (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="menu" size={32} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppHeader;
