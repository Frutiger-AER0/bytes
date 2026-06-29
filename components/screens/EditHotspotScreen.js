import React from 'react';
import { View } from 'react-native';
import AppHeader from '../layout/AppHeader';
import EditForm from '../forms/EditForm';

const EditHotspotScreen = ({ navigation, route }) => {
  const { hotspot } = route.params;

  return (
    <View className="flex-1 bg-white">
      <AppHeader navigation={navigation} showMenuButton={false} showBackButton={true} />
      <EditForm initialHotspot={hotspot} />
    </View>
  );
};

export default EditHotspotScreen;
