import { View, Text, StyleSheet, Dimensions, Touchable, TouchableOpacity, Share } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import  { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import MapView from "react-native-maps";
import { FontAwesome5 } from '@expo/vector-icons';
import { defaultStyles } from "@/constants/Styles";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const INITIAL_REGION_ROMANIA = {
  latitude: 45.9432,
  longitude: 24.9668,
  latitudeDelta: 7,
  longitudeDelta: 7,
}


const Page = () => {
  const { id } = useLocalSearchParams<{id: string}>();
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [intialRegion, setInitialRegion] = useState(INITIAL_REGION_ROMANIA);
  const [isFavorite, setIsFavorite] = useState(); 
  const [activities, setActivities] = useState<string>('0');

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const navigation = useNavigation();
  

  const item_url = 'https://3q55nqgg-8080.euw.devtunnels.ms/api/courts/'+id;
  const router = useRouter();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const shareCourt = async() => {
    try{
      await Share.share({
        title: item.name,
        url: item_url,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const addToFavorite = (courtId: string) => {
    const url = `https://3q55nqgg-8080.euw.devtunnels.ms/api/favorite?userId=1&courtId=`+id;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }
      return response.text(); 
    })
    .then(data => {
      console.log('Response data:', data);
      setIsFavorite(data === "true"); 
    })
    .catch(error => {
      console.error('Error adding to favorites:', error);
    });
  }

  const toggleFavorite = async () => {
    const response = await fetch(`https://3q55nqgg-8080.euw.devtunnels.ms/api/favorite/verify?userId=1&courtId=`+item.id);
    const isFavoriteString = await response.text(); 
    const isFavorite = isFavoriteString === "true"; 
    setIsFavorite(isFavorite as any);
  };

  const getNumberOfEvents = async () => {
    try {
      const response = await fetch(`https://3q55nqgg-8080.euw.devtunnels.ms/api/events/count/`+item.id);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching events count:', error);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => ( 
        <Animated.View style={[styles.header, headerAnimatedStyle]}/>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareCourt}>
            <Ionicons name='share-outline' size={22} color={'#000'}/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.roundButton} 
            onPress={() => addToFavorite(item.id)}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? 'red' : '#000'}/>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => (router.back())} >
          <Ionicons name='chevron-back' size={24} color={'#000'}/>
        </TouchableOpacity>
      ),
    });
  }, [isFavorite])




    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value, 
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [2, 1, 1],
                    )
                }
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
        }
    })

    const fetchItems = async () => {
        try{
            setLoading(true);
            const response = await fetch(item_url);
            const responseJson = await response.json();
            setItem(responseJson); 
            setIsLoaded(true);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
      toggleFavorite();
    }, [item]); 
  
    useEffect(() => {
      getNumberOfEvents();
    }, [item]);
    
  useEffect(() => {
    const INITIAL_REGION_ITEM = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
  }

  setInitialRegion(INITIAL_REGION_ITEM);
  }, []);


    return(
        <View style={styles.container}>
            <Animated.ScrollView ref={scrollRef}
            scrollEventThrottle={16}>
                {item.images && item.images.length > 0 ? (
                    <Animated.Image 
                        source={{ uri: `data:${item.images[0].mime};base64,${item.images[0].data}` }}
                        style={[styles.image, imageAnimatedStyle]} />
                ) : (
                    <Animated.Image 
                        source={require('../../assets/images/placeholder.jpg')} 
                        style={[styles.image, imageAnimatedStyle]} />
                )}

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.divider} />
                    <View style={{gap: 10, flexDirection: "row", alignItems: 'center'}}>
                        <Text style={styles.courtType}>Type of coverage:</Text>
                        <Text style={{fontFamily: 'pop'}}>{item.courtType}</Text>
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
                {/* {isLoaded && (<View style={{flex: 1, alignItems: 'center', alignContent: 'center'}}>
                  <TouchableOpacity style={styles.mapLink}>
                    <MapView style={styles.mapView}
                          provider={PROVIDER_GOOGLE}
                          showsMyLocationButton={false}
                          showsUserLocation={false}
                          animationEnabled={false}>

                          
                      </MapView>
                  </TouchableOpacity>
                </View>)} */}

            </Animated.ScrollView>

            <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)} >
                <View style={{flexDirection: 'row', gap: 40 , alignItems: 'center'}}>
                  <TouchableOpacity style={{flexDirection: 'row', gap: 10}}>
                      <Text style={{fontSize: 16, fontFamily: 'pop-sb', textDecorationLine: 'underline'}}>{activities}</Text>
                      <Text style={{fontSize: 16, fontFamily: 'pop-sb'}}>Upcoming activities</Text>
                  </TouchableOpacity>
                  <Link style={defaultStyles.btn}
                      href={{
                        pathname: "/(modals)/addEvent",
                        params: { id: item.id},
                      }}
                    >
                      <Text style={defaultStyles.btnText}>Add Event</Text>
                    </Link>
                  {/* <TouchableOpacity style={defaultStyles.btn} onPress={() => {router.push({pathname: "/(modals)/addEvent", params:  item.id   })}}>
                    <Text style={[defaultStyles.btnText, {paddingHorizontal: 10}]}>Add activity</Text>
                  </TouchableOpacity> */}
                </View>
            </Animated.View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff'
    },
    image: {
        height: IMG_HEIGHT,
        width,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'pop-sb',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey,
        marginVertical: 16,
    },
    courtType:{
        fontFamily: 'pop-sb',
        fontSize: 18,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'pop',
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.primary,
    },
    header: {
        backgroundColor: '#fff',
        height: 100,
        borderBottomColor: Colors.grey,
        borderWidth: StyleSheet.hairlineWidth,
    },
    mapLink: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center'
    },
    mapView: {
      height: 100,
      width: 300,
      borderRadius: 30,
    }
});

export default Page