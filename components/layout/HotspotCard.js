import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const HotspotCard = ({ hotspot }) => {
  const navigation = useNavigation();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Load favorite status from AsyncStorage when component mounts
    const loadFavoriteStatus = async () => {
      try {
        const favorited = await AsyncStorage.getItem(`@favorite_hotspot_${hotspot.id}`);
        if (favorited === 'true') {
          setIsFavorited(true);
        }
      } catch (e) {
        console.error("Failed to load favorite status:", e);
      }
    };
    loadFavoriteStatus();
  }, [hotspot.id]); // Reload if hotspot ID changes

  const toggleFavorite = async () => {
    try {
      const newState = !isFavorited;
      setIsFavorited(newState);
      if (newState) {
        await AsyncStorage.setItem(`@favorite_hotspot_${hotspot.id}`, 'true');
      } else {
        await AsyncStorage.removeItem(`@favorite_hotspot_${hotspot.id}`);
      }
    } catch (e) {
      console.error("Failed to toggle favorite status:", e);
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-md"
      onPress={() => navigation.navigate('HotspotDetail', { hotspot: hotspot })}
    >
      <Text className="text-lg font-semibold text-gray-800">{hotspot.name}</Text>
      <TouchableOpacity className="p-2" onPress={toggleFavorite}>
        <Ionicons name={isFavorited ? "star" : "star-outline"} size={24} color={isFavorited ? "gold" : "gray"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default HotspotCard;
