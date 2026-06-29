import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../layout/AppHeader';
import HotspotCard from '../layout/HotspotCard';

const MainScreen = ({ navigation }) => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotspots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://145.24.237.86:8011/hotspots');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHotspots(data);
    } catch (e) {
      console.error("Failed to fetch hotspots:", e);
      setError(e);
      Alert.alert("Error", "Failed to load hotspots. Please check your network connection or the server status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHotspots();
      return () => {
      };
    }, [fetchHotspots])
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading hotspots...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-red-500 text-lg">Error: {error.message}</Text>
        <TouchableOpacity className="mt-4 bg-blue-500 p-3 rounded-lg" onPress={fetchHotspots}>
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader navigation={navigation} />
      <FlatList data={hotspots} keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} renderItem={({ item }) => <HotspotCard hotspot={item} />} contentContainerStyle={{ padding: 16 }} ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-gray-500 text-lg">No hotspots found.</Text>
            <Text className="text-gray-500 text-base">Create one using the '+' button!</Text>
          </View>
        }
      />

      <TouchableOpacity className="absolute bottom-4 right-4 bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50" onPress={() => navigation.navigate('CreateHotspot')}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;
