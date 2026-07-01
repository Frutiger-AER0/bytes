import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../layout/AppHeader';
import { useLayout } from '../../context/LayoutContext';

const MapScreen = ({ navigation }) => {
  const { darkMode } = useLayout();
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

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in settings to use this feature.');
        setMapRegion({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setMapRegion(newRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    } catch (e) {
      console.error("Error getting current location:", e);
      Alert.alert('Location Error', 'Could not get your current location. Please check your device settings.');
      setMapRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } finally {
      setLocationLoading(false);
    }

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
      fetchLocationAndHotspots();
      return () => {
      };
    }, [fetchLocationAndHotspots])
  );

  if (loading || locationLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator size="large" color={darkMode ? "#fff" : "#0000ff"} />
        <Text className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading map and hotspots...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className="text-red-500 text-lg">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <AppHeader navigation={navigation} />
      {mapRegion ? (
        <MapView
          key={darkMode ? 'dark-map' : 'light-map'}
          ref={mapRef}
          style={styles.map}
          provider="google"
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userInterfaceStyle={darkMode ? 'dark' : 'light'}
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
        <View className={`flex-1 items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <Text className={`text-gray-500 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Map not available without location.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapScreen;
