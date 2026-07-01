import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native'; // Hook to detect system theme

const LayoutContext = createContext();

const LAYOUT_MODE_KEY = '@layout_mode';
const DARK_MODE_KEY = '@dark_mode';

export const LayoutProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' or 'dark'
  const [layoutMode, setLayoutMode] = useState('tabs'); // Default to 'tabs'
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark'); // Default to system theme
  const [isReady, setIsReady] = useState(false); // To indicate if settings are loaded

  // Load settings from AsyncStorage on app start
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedLayoutMode = await AsyncStorage.getItem(LAYOUT_MODE_KEY);
        if (storedLayoutMode !== null) {
          setLayoutMode(storedLayoutMode);
        }

        const storedDarkMode = await AsyncStorage.getItem(DARK_MODE_KEY);
        if (storedDarkMode !== null) {
          setDarkMode(JSON.parse(storedDarkMode));
        } else {
          // If no setting saved, use system preference
          setDarkMode(systemColorScheme === 'dark');
        }
      } catch (e) {
        console.error("Failed to load layout settings from AsyncStorage", e);
      } finally {
        setIsReady(true);
      }
    };
    loadSettings();
  }, [systemColorScheme]);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    if (isReady) { // Only save after initial load
      AsyncStorage.setItem(LAYOUT_MODE_KEY, layoutMode).catch(e => console.error("Failed to save layout mode", e));
    }
  }, [layoutMode, isReady]);

  useEffect(() => {
    if (isReady) { // Only save after initial load
      AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode)).catch(e => console.error("Failed to save dark mode", e));
    }
  }, [darkMode, isReady]);

  // Apply dark mode to NativeWind's global state
  useEffect(() => {
    if (darkMode) {
      // This is a placeholder. NativeWind typically reads system theme or a global config.
      // For dynamic toggling, you might need to configure NativeWind's dark mode strategy
      // or manually add/remove a 'dark' class to a top-level View if not using a global provider.
      // For now, we'll assume NativeWind picks up the system theme or is configured to respond
      // to a global state.
      // If NativeWind doesn't automatically pick up the context, you might need to
      // manually set a global class or use a library like 'react-native-dark-mode'
      // or 'nativewind/tailwind.js' configuration for dynamic theme switching.
    }
  }, [darkMode]);


  const value = {
    layoutMode,
    setLayoutMode,
    darkMode,
    setDarkMode,
    isReady,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
