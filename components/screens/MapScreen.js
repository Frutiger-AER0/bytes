import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import AppHeader from '../layout/AppHeader';

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const fetchLocationAndHotspots = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLocationLoading(true);

    // 1. Get User Location
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in settings to use this feature.');
        // If permission denied, set a default region
        setMapRegion({
          latitude: 37.78825, // Default to San Francisco
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005, // Street level zoom
          longitudeDelta: 0.005, // Street level zoom
        };
        setMapRegion(newRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    } catch (e) {
      console.error("Error getting current location:", e);
      Alert.alert('Location Error', 'Could not get your current location. Please check your device settings.');
      // Set a default region even on error
      setMapRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } finally {
      setLocationLoading(false);
    }

    // 2. Fetch Hotspots
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
  }, []); // Empty dependency array for useCallback

  useFocusEffect(
    useCallback(() => {
      fetchLocationAndHotspots();
      return () => {
        // Optional: cleanup function if needed
      };
    }, [fetchLocationAndHotspots])
  );

  if (loading || locationLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading map and hotspots...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-red-500 text-lg">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader navigation={navigation} />
      {mapRegion ? ( // Render MapView only if mapRegion is set
        <MapView
          ref={mapRef}
          style={styles.map}
          provider="google"
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {hotspots.map((hotspot) => (
            hotspot.latitude && hotspot.longitude && (
              <Marker
                key={hotspot.id ? hotspot.id.toString() : `hotspot-${hotspot.name}-${hotspot.latitude}-${hotspot.longitude}`}
                coordinate={{
                  latitude: parseFloat(hotspot.latitude),
                  longitude: parseFloat(hotspot.longitude),
                }}
                title={hotspot.name}
                description={hotspot.review}
              />
            )
          ))}
        </MapView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">Map not available without location.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1, // Take up all available space
  },
});

export default MapScreen;
