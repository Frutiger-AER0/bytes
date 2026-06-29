import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HotspotCard = ({ hotspot }) => {
  return (
    <View className="flex-row items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-semibold text-gray-800">{hotspot.name}</Text>
      <TouchableOpacity className="p-2">
        <Ionicons name="star-outline" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default HotspotCard;
