import React from 'react';
import { View } from 'react-native';
import AppHeader from '../layout/AppHeader';
import EditForm from '../forms/EditForm'; // Import the CreateForm component

const EditHotspotScreen = ({ navigation }) => {
    return (
        <View className="flex-1 bg-white">
            <AppHeader navigation={navigation} showMenuButton={false} showBackButton={true} />
            <EditForm />
        </View>
    );
};

export default EditHotspotScreen;