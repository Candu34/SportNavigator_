import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView from "react-native-map-clustering";
import Colors from "@/constants/Colors";
import AppLoader from "@/components/AppLoader";
import { API_URL } from '@/constants/api_url';
import axios from 'axios';

interface Props {
    category: string;
}

const INITIAL_REGION_ROMANIA = {
    latitude: 45.9432,
    longitude: 24.9668,
    latitudeDelta: 7,
    longitudeDelta: 7,
}

const ListingMap = ({ category }: Props) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [icon, setIcon] = useState([]);

    const router = useRouter();

    const onMarkerSeleced = (item: any) => {
        router.push(`/listing/${item.sportCourtId}`);
    }

    const item_url = `${API_URL}/coordinate?sport=${category}`;

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(item_url);
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    useEffect(() => {
        fetchItems();
        setIcon(getIconName(category) as any);
    }, [category]);

    const getIconName = (sport: string) => {
        switch (sport) {
            case "Football":
                return "soccer";
            case "Table_tennis":
                return "table-tennis";
            default:
                return sport.toLocaleLowerCase();
        }
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied' as any);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location as any);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <>
            <View style={StyleSheet.absoluteFill}>
                <MapView style={styles.map} showsUserLocation={true}
                    animationEnabled={false}
                    provider={PROVIDER_GOOGLE}
                    showsMyLocationButton={true}
                    initialRegion={INITIAL_REGION_ROMANIA}
                    clusterColor={Colors.primary}
                    clusterFontFamily='pop-sb'
                >
                    {items.map((item: any) => (
                        <Marker
                            onPress={() => onMarkerSeleced(item)}
                            key={item.id}
                            coordinate={{
                                latitude: +item.latitude,
                                longitude: +item.longitude
                            }}
                        >
                            <View style={styles.marker}>
                                <MaterialCommunityIcons name={icon as any} size={24} color={Colors.primary} />
                            </View>
                        </Marker>
                    ))}
                </MapView>
            </View>
            {loading && <AppLoader />}
        </>
    )
};

export default ListingMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        borderRadius: 30,
        width: '100%',
        height: '100%',
        padding: 1,
    },
    marker: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        }
    }
});