import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import AppHeader from '../layout/AppHeader';
import { useLayout } from '../../context/LayoutContext'; // Import useLayout

const SettingScreen = ({ navigation }) => {
  const { layoutMode, setLayoutMode, darkMode, setDarkMode } = useLayout();

  return (
    <View className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <AppHeader navigation={navigation} showMenuButton={false} showBackButton={true} />

      <View className="p-4">
        {/* Dark Mode Toggle */}
        <View className={`flex-row items-center justify-between p-3 mb-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <Text className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dark Mode</Text>
          <Switch
            onValueChange={setDarkMode}
            value={darkMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* Layout Mode Selection */}
        <Text className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Layout Mode</Text>
        <View className={`flex-row justify-around p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <TouchableOpacity
            className={`flex-1 p-3 rounded-md items-center ${layoutMode === 'tabs' ? (darkMode ? 'bg-blue-700' : 'bg-blue-500') : ''}`}
            onPress={() => setLayoutMode('tabs')}
          >
            <Text className={`text-base font-bold ${layoutMode === 'tabs' ? 'text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Tabs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-3 rounded-md items-center ml-2 ${layoutMode === 'swipe' ? (darkMode ? 'bg-blue-700' : 'bg-blue-500') : ''}`}
            onPress={() => setLayoutMode('swipe')}
          >
            <Text className={`text-base font-bold ${layoutMode === 'swipe' ? 'text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Swipe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingScreen;
