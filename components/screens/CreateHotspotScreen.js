import React from 'react';
import { View } from 'react-native';
import AppHeader from '../layout/AppHeader';
import CreateForm from '../forms/createForm'; // Import the CreateForm component

const CreateHotspotScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      <AppHeader navigation={navigation} showMenuButton={false} showBackButton={true} />
      <CreateForm />
    </View>
  );
};

export default CreateHotspotScreen;
