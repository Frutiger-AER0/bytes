import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Import for swipe mode
import MainScreen from './components/screens/MainScreen';
import SettingScreen from './components/screens/SettingScreen';
import MapScreen from './components/screens/MapScreen';
import CreateHotspotScreen from './components/screens/CreateHotspotScreen';
import EditHotspotScreen from './components/screens/EditHotspotScreen';
import HotspotScreen from './components/screens/HotspotScreen';
import { LayoutProvider, useLayout } from './context/LayoutContext'; // Import LayoutProvider and useLayout
import './global.css';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native'; // Import View for the root element

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator(); // Renamed to avoid conflict
const TopTab = createMaterialTopTabNavigator(); // New TopTab navigator

function AppContent() { // New component to use context
  const { layoutMode, darkMode, isReady } = useLayout();

  if (!isReady) {
    return null; // Or a loading spinner
  }

  function TabNavigator() {
    if (layoutMode === 'swipe') {
      return (
        <TopTab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarIndicatorStyle: { backgroundColor: 'blue' },
            tabBarStyle: { backgroundColor: darkMode ? '#333' : '#f8f8f8' }, // Dark mode for tab bar
          }}
        >
          <TopTab.Screen name="Home" component={MainScreen} />
          <TopTab.Screen name="Map" component={MapScreen} />
        </TopTab.Navigator>
      );
    } else { // Default to 'tabs' mode
      return (
        <BottomTab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Map') {
                iconName = focused ? 'map' : 'map-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: darkMode ? '#333' : '#f8f8f8' }, // Dark mode for tab bar
          })}
        >
          <BottomTab.Screen name="Home" component={MainScreen} />
          <BottomTab.Screen name="Map" component={MapScreen} />
        </BottomTab.Navigator>
      );
    }
  }

  return (
    <View className={darkMode ? 'dark flex-1' : 'flex-1'}> {/* Apply dark class */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="CreateHotspot" component={CreateHotspotScreen} />
        <Stack.Screen name="EditHotspot" component={EditHotspotScreen} />
        <Stack.Screen name="HotspotDetail" component={HotspotScreen} />
      </Stack.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <LayoutProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </LayoutProvider>
  );
}