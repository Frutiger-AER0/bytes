import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const CreateForm = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [latitude, setLatitude] = useState(37.78825);
  const [longitude, setLongitude] = useState(-122.4324);
  const [mapRegion, setMapRegion] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in settings to use this feature.');
        setLocationLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const newLatitude = location.coords.latitude;
        const newLongitude = location.coords.longitude;

        setLatitude(newLatitude);
        setLongitude(newLongitude);

        const region = {
          latitude: newLatitude,
          longitude: newLongitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setMapRegion(region);

        // Animate to the user's location if mapRef is available
        if (mapRef.current) {
          mapRef.current.animateToRegion(region, 1000);
        }
      } catch (error) {
        console.error("Error getting current location:", error);
        Alert.alert('Location Error', 'Could not get your current location. Please check your device settings.');
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  const handleMapPress = (event) => {
    const newLatitude = event.nativeEvent.coordinate.latitude;
    const newLongitude = event.nativeEvent.coordinate.longitude;
    setLatitude(newLatitude);
    setLongitude(newLongitude);
    setMapRegion({
      ...mapRegion,
      latitude: newLatitude,
      longitude: newLongitude,
    });
  };

  const handleSubmit = async () => {
    if (!name || !review || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill in all fields and select a location on the map.');
      return;
    }

    const formData = {
      name,
      latitude,
      longitude,
      review,
    };

    try {
      const response = await fetch('http://145.24.237.86:8011/hotspots', { // Assuming /hotspots endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Hotspot created successfully!');
        setName('');
        setReview('');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', `Failed to create hotspot: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Network request failed:', error);
      Alert.alert('Error', 'Could not connect to the server. Please check your network.');
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Create New Hotspot</Text>

      <Text className="text-lg mb-2">Hotspot Name:</Text>
      <TextInput
        className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
        placeholder="Enter hotspot name"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-lg mb-2">Location (Tap on map to select):</Text>
      {locationLoading ? (
        <View style={styles.mapLoadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-600">Getting your location...</Text>
        </View>
      ) : (
        mapRegion && ( // Only render MapView if mapRegion is set
          <MapView
            ref={mapRef} // Assign ref to MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion} // Use the fetched mapRegion
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        )
      )}
      <Text className="text-sm text-gray-600 mb-4">
        Latitude: {latitude.toFixed(5)}, Longitude: {longitude.toFixed(5)}
      </Text>

      <Text className="text-lg mb-2">Review:</Text>
      <TextInput
        className="border border-gray-300 p-3 rounded-lg mb-6 text-base h-24"
        placeholder="Enter your review"
        value={review}
        onChangeText={setReview}
        multiline
      />

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white text-lg font-bold">Create Hotspot</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 256,
    marginBottom: 16,
    borderRadius: 8,
  },
  mapLoadingContainer: {
    width: '100%',
    height: 256,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
});

export default CreateForm;
