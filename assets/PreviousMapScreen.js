import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import * as Location from 'expo-location';
import {fetchProtests} from "../components/services/ProtestApi";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export default function MapScreen({route}) {
    const navigation = useNavigation();
    const targetId = route?.params?.id || null;
    const item = route?.params?.item || null;
    const [location, setLocation] = useState(null);
    const [protests, setProtests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let subscription;

        async function initializeMap() {
            try {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Locatietoegang is geweigerd!');
                    return;
                }

                const initialLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: initialLocation.coords.latitude,
                    longitude: initialLocation.coords.longitude,
                });

                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 10,
                    },
                    (newLocation) => {
                        setLocation({
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                        });
                    }
                );

                const savedProtests = await fetchProtests();

                if (targetId) {
                    const singleProtest = savedProtests.filter(p => p.id === targetId);
                    console.log("Gevonden protest voor ID:", targetId, singleProtest);
                    if (singleProtest.length > 0) {
                        setProtests(singleProtest);
                    } else {
                        setProtests(savedProtests);
                    }
                } else {
                    setProtests(savedProtests);
                }

            } catch (error) {
                console.error("Fout bij laden van kaartgegevens:", error);
            } finally {
                setLoading(false);
            }
        }

        initializeMap();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [targetId]);

    if (loading || !location) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#849782"/>
                <Text style={styles.loadingText}>Kaart en protesten laden...</Text>
            </View>
        );
    }

    const singleProtest = protests.length === 1 ? protests[0] : null;

    const initialRegion = {
        latitude: singleProtest ? Number(singleProtest.latitude) : (item ? Number(item.latitude) : location.latitude),
        longitude: singleProtest ? Number(singleProtest.longitude) : (item ? Number(item.longitude) : location.longitude),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider="google"
                showsCompass={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                followsUserLocation={true}
                userInterfaceStyle='light'
                initialRegion={initialRegion}
            >
                {protests.map((protest) => {
                    if (!protest.latitude || !protest.longitude) return null;
                    return (
                        <Marker
                            key={protest.id || `${protest.latitude}-${protest.longitude}`}
                            coordinate={{
                                latitude: protest.latitude,
                                longitude: protest.longitude,
                            }}
                            title={protest.title}
                            description={protest.location}
                            pinColor='red'
                        />
                    )
                })}
            </MapView>

            <View
                className="left-4 right-4 mt-8 flex-row w-full absolute justify-between items-center"
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-blue px-4 py-2.5 rounded-full"
                >

                    <Ionicons name="arrow-back" size={24} color="#F8F9FA"/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 10,
        color: '#000000',
    }
});