import { View, Text, StyleSheet, Touchable, TouchableOpacity} from "react-native";
import React, {useState, useEffect} from "react";
import MapInput, { MapInputVariants } from 'react-native-map-input';
import { router, useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import  { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import { defaultStyles } from "@/constants/Styles";
import MapView from "react-native-map-clustering";
import Colors from "@/constants/Colors";
import { FontAwesome5 } from '@expo/vector-icons';

const INITIAL_REGION_ROMANIA = {
    latitude: 45.9432,
    longitude: 24.9668,
    latitudeDelta: 7,
    longitudeDelta: 7,
}


const Page = () => {
    const [errorMsg, setErrorMsg] = useState(null);
    const [location, setLocation] = useState(null);
    const [markerPosition, setMarkerPosition] = useState({ latitude: 0, longitude: 0 });
    const navigation = useNavigation();

    const [draggableMarkerCoord, setDraggableMarkerCoord] = useState({
        latitude: INITIAL_REGION_ROMANIA.latitude,
        longitude: INITIAL_REGION_ROMANIA.longitude,
      });

      const handleRegionChange = (region) => {
        const centerLat = region.latitude;
        const centerLng = region.longitude;
        setMarkerPosition({ latitude: centerLat, longitude: centerLng });
      };

    const [coordinate, setCoordinate] = useState({
        latitude: 45.9432,
        longitude: 24.9668,
        latitudeDelta: 7,
        longitudeDelta: 7,
      });

      const onSelectLocation = () => {
        navigation.navigate('add_new', { markerPosition }); 
    };

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
        <View style={StyleSheet.absoluteFill}>
            <MapView style={styles.map} showsUserLocation={true}
            animationEnabled={false}
            onRegionChange={handleRegionChange}
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton={true}
            initialRegion={INITIAL_REGION_ROMANIA}
            clusterColor={Colors.primary}
            clusterFontFamily='pop-sb'
            mapType="hybrid"
            >
                <Marker coordinate={markerPosition} >
                <FontAwesome5 name="map-pin" size={35} color={Colors.primary} />
                </Marker>
            </MapView>
            <TouchableOpacity onPress={onSelectLocation} style={[defaultStyles.btn, styles.btnLocation, {paddingHorizontal: 20}]}>
                <Text style={defaultStyles.btnText}>Select location</Text>
            </TouchableOpacity>
        </View>
    )
}

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
        },  
    },
    staticMarker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'red', 
    },
    btnLocation: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
	    width: 0,
	    height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
    }
})


export default Page