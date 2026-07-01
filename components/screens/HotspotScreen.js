import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayout } from '../../context/LayoutContext'; // Import useLayout

// Define the directory for storing images
const HOTSPOT_IMAGES_DIR = FileSystem.documentDirectory + 'hotspot_images/';

const HotspotScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotspot } = route.params;
  const [imageUri, setImageUri] = useState(null);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const { darkMode } = useLayout(); // Get darkMode from context

  // Function to load image from local storage
  const loadImage = async () => {
    if (!hotspot || !hotspot.id) {
      console.log("Hotspot or hotspot ID is missing, cannot load image.");
      return;
    }
    try {
      const storageKey = `hotspotImage_${hotspot.id}`;
      const storedUri = await AsyncStorage.getItem(storageKey);
      if (storedUri) {
        const fileInfo = await FileSystem.getInfoAsync(storedUri);
        if (fileInfo.exists) {
          setImageUri(storedUri);
          console.log(`[Image Load] Loaded image for hotspot ${hotspot.id}: ${storedUri}`);
        } else {
          console.log(`[Image Load] Stored URI ${storedUri} for hotspot ${hotspot.id} does not exist. Clearing.`);
          await AsyncStorage.removeItem(storageKey);
          setImageUri(null);
        }
      } else {
        setImageUri(null);
        console.log(`[Image Load] No image found for hotspot ${hotspot.id}.`);
      }
    } catch (e) {
      console.error("[Image Load] Failed to load image from AsyncStorage:", e);
      Alert.alert("Error", "Failed to load image. Please try again.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadImage();
      return () => {
      };
    }, [hotspot.id])
  );

  const pickImage = async () => {
    if (isPickingImage) {
      console.log("[Image Pick] Already picking an image, ignoring multiple tap.");
      return;
    }
    setIsPickingImage(true);

    console.log("[Image Pick] pickImage function called.");
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log(`[Image Pick] Media library permission status: ${status}`);

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        setIsPickingImage(false);
        return;
      }

      console.log("[Image Pick] Attempting to launch ImagePicker...");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      console.log(`[Image Pick] ImagePicker.launchImageLibraryAsync() resolved.`);
      console.log(`[Image Pick] ImagePicker result: ${JSON.stringify(result)}`);

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        const newImageUri = selectedAsset.uri;
        console.log(`[Image Pick] Selected image URI: ${newImageUri}`);

        try {
          const dirInfo = await FileSystem.getInfoAsync(HOTSPOT_IMAGES_DIR);
          if (!dirInfo.exists) {
            console.log("[Image Pick] Hotspot image directory does not exist, creating...");
            await FileSystem.makeDirectoryAsync(HOTSPOT_IMAGES_DIR, { intermediates: true });
            console.log("[Image Pick] Hotspot image directory created.");
          }
        } catch (dirError) {
          console.error("[Image Pick] Failed to ensure image directory exists:", dirError);
          Alert.alert('Error', 'Failed to prepare image storage. Please try again.');
          setIsPickingImage(false);
          return;
        }

        const fileName = `hotspot_${hotspot.id}_${Date.now()}.jpg`;
        const localFilePath = HOTSPOT_IMAGES_DIR + fileName;
        console.log(`[Image Pick] Local file path for saving: ${localFilePath}`);

        try {
          await FileSystem.copyAsync({
            from: newImageUri,
            to: localFilePath,
          });
          console.log("[Image Pick] Image copied successfully to local storage.");

          const storageKey = `hotspotImage_${hotspot.id}`;
          await AsyncStorage.setItem(storageKey, localFilePath);
          setImageUri(localFilePath);
          Alert.alert('Success', 'Image saved locally!');
          console.log(`[Image Pick] Image URI stored in AsyncStorage: ${localFilePath}`);
        } catch (e) {
          console.error("[Image Pick] Failed to save image locally:", e);
          Alert.alert('Error', `Failed to save image locally: ${e.message}`);
        }
      } else {
        console.log("[Image Pick] Image picking canceled by user.");
      }
    } catch (error) {
      console.error("[Image Pick] An unexpected error occurred during image picking:", error);
      Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleDeleteHotspot = async () => {
    Alert.alert(
      "Delete Hotspot",
      "Are you sure you want to delete this hotspot? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`http://145.24.237.86:8011/hotspots/${hotspot.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete hotspot: ${errorData.message || response.statusText}`);
              }

              const storageKey = `hotspotImage_${hotspot.id}`;
              const storedUri = await AsyncStorage.getItem(storageKey);
              if (storedUri) {
                console.log(`[Delete Hotspot] Deleting local image file: ${storedUri}`);
                await FileSystem.deleteAsync(storedUri, { idempotent: true });
                await AsyncStorage.removeItem(storageKey);
                console.log("[Delete Hotspot] Local image deleted.");
              }

              Alert.alert('Success', 'Hotspot and its local image deleted successfully!');
              navigation.goBack();
            } catch (error) {
              console.error('[Delete Hotspot] Deletion failed:', error);
              Alert.alert('Error', `Could not delete hotspot: ${error.message || 'Network error'}`);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Custom Header */}
      <View className="w-full h-[100px] flex-row items-end px-[15px] bg-[#f8f8f8] dark:bg-gray-800 border-b border-b-[#e0e0e0] dark:border-b-gray-700 pt-[10px] pb-[10px]">
        {/* Left Section (Back Button) */}
        <View className="w-[42px] h-[42px] justify-center items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color={darkMode ? "white" : "black"} />
          </TouchableOpacity>
        </View>

        {/* Center Section (Hotspot Name) */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-[24px] font-bold text-black dark:text-white" numberOfLines={1} ellipsizeMode="tail">{hotspot.name}</Text>
        </View>

        {/* Right Section (Edit and Delete Buttons) */}
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.navigate('EditHotspot', { hotspot: hotspot })} className="p-1">
            <Ionicons name="pencil-outline" size={28} color={darkMode ? "white" : "black"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteHotspot} className="p-1 ml-2">
            <Ionicons name="trash-outline" size={28} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Image Section */}
        <TouchableOpacity
          onPress={pickImage}
          disabled={isPickingImage}
          className={`w-full h-64 rounded-lg mb-4 justify-center items-center overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          ) : (
            <Text className={`text-gray-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tap to add image</Text>
          )}
        </TouchableOpacity>

        {/* Review */}
        <Text className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Review:</Text>
        <Text className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{hotspot.review}</Text>
      </ScrollView>
    </View>
  );
};

export default HotspotScreen;
