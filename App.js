import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './components/screens/MainScreen';
import SettingScreen from './components/screens/SettingScreen';
import MapScreen from './components/screens/MapScreen';
import CreateHotspotScreen from './components/screens/CreateHotspotScreen';
import EditHotspotScreen from './components/screens/EditHotspotScreen';
import HotspotScreen from './components/screens/HotspotScreen';
import './global.css';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
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
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="CreateHotspot" component={CreateHotspotScreen} />
        <Stack.Screen name="EditHotspot" component={EditHotspotScreen} />
        <Stack.Screen name="HotspotDetail" component={HotspotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}