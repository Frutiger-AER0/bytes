import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const LayoutContext = createContext();
const LAYOUT_MODE_KEY = '@layout_mode';
const DARK_MODE_KEY = '@dark_mode';

export const LayoutProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [layoutMode, setLayoutMode] = useState('tabs');
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');
  const [isReady, setIsReady] = useState(false);

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

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(LAYOUT_MODE_KEY, layoutMode).catch(e => console.error("Failed to save layout mode", e));
    }
  }, [layoutMode, isReady]);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode)).catch(e => console.error("Failed to save dark mode", e));
    }
  }, [darkMode, isReady]);

  useEffect(() => {
    if (darkMode) {
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
