import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayout } from '../../context/LayoutContext';

const HotspotCard = ({ hotspot }) => {
  const navigation = useNavigation();
  const { darkMode } = useLayout();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
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
  }, [hotspot.id]);

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
      className={`flex-row items-center justify-between p-4 mb-3 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      onPress={() => navigation.navigate('HotspotDetail', { hotspot: hotspot })}
    >
      <Text className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{hotspot.name}</Text>
      <TouchableOpacity className="p-2" onPress={toggleFavorite}>
        <Ionicons name={isFavorited ? "star" : "star-outline"} size={24} color={isFavorited ? "gold" : (darkMode ? "gray" : "gray")} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default HotspotCard;
