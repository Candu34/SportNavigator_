import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Share } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import AppLoader from "@/components/AppLoader";
import { API_URL } from "@/constants/api_url";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import openMap from 'react-native-open-maps';
import Fontisto from '@expo/vector-icons/Fontisto';

const IMG_HEIGHT = 325;
const { width } = Dimensions.get('window');

const INITIAL_REGION_ROMANIA = {
  latitude: 45.9432,
  longitude: 24.9668,
  latitudeDelta: 7,
  longitudeDelta: 7,
};

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialRegion, setInitialRegion] = useState(INITIAL_REGION_ROMANIA);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activities, setActivities] = useState<string>('0');
  const stars = Array(5).fill(0);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const navigation = useNavigation();
  const router = useRouter();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const item_url = `${API_URL}/courts/${id}`;

  const openMaps = () => {
     openMap({
      travelType: 'drive',
      end: `${item.latitude},${item.longitude}`,
     })
  }
  

  const addToFavorite = async (courtId: string) => {
    const userData = await SecureStore.getItemAsync('user');
    if (!userData) {
        throw new Error("User not found in storage");
    }
    
    const user = JSON.parse(userData); 
    if (!user.id) {
        throw new Error("Invalid user data");
    }
    const url = `${API_URL}/favorite?courtId=${id}&userId=${user.id}`;
    try {
      const response = await axios.post(url, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (!userData) {
          throw new Error("User not found in storage");
      }
      
      const user = JSON.parse(userData); 
      if (!user.id) {
          throw new Error("Invalid user data");
      }
      const response = await axios.get(`${API_URL}/favorite/verify?courtId=${id}&userId=${user.id}`);
      setIsFavorite(response.data);
    } catch (error) {
      console.error('Error verifying favorite status:', error);
    }
  };

  const getNumberOfEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/count/${id}`);
      if (response.status === 200) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Error fetching events count:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View style={[styles.header, headerAnimatedStyle]} />
      ),
      headerRight: () => (
        <View style={styles.bar}>
          {!loading && (
            <TouchableOpacity style={styles.roundButton} onPress={openMaps}>
              <Fontisto name="map" size={22} color={"#000"} />
            </TouchableOpacity>
          )}
          {!loading && (
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => addToFavorite(id)}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "red" : "#000"}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity>
      ),
    });
  }, [isFavorite, loading, item]);
  

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
    };
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(item_url);
      setItem(response.data);
      console.log("Item loaded ...");
      setIsLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

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
    console.log(item.ratingData);
    if (item.latitude && item.longitude) {
      const INITIAL_REGION_ITEM = {
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setInitialRegion(INITIAL_REGION_ITEM);
    }
  }, [item]);

  return (
    <>
      <View style={styles.container}>
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
          {item.images && item.images.length > 0 ? (
            <Animated.Image
              source={{ uri: `data:${item.images[0].mime};base64,${item.images[0].data}` }}
              style={[styles.image, imageAnimatedStyle]} />
          ) : (
            <Animated.Image
              source={require('../../assets/images/placeholder.jpg')}
              style={[styles.image, imageAnimatedStyle]} />
          )}
  
          <Link
          style={{ flexDirection: 'row', alignItems: 'center' }}
          href={{
            pathname: "/(modals)/viewReviews",
            params: { id: id },
          }}
        >
          <View style={styles.ratingContainer}>
            {stars.map((_, index) => {
              const rating = item.ratingData?.averageRating || 0;
              let starName = "star-outline";
              if (index < Math.floor(rating)) {
                starName = "star";
              } else if (index < rating) {
                starName = "star-half";
              }

              return (
                <Ionicons
                  key={`star-${index}`}
                  name={starName}
                  size={16}
                  color="#FFB800"
                />
              );
            })}
            {item.ratingData && (
              <Text style={styles.reviewText}>
                ({item.ratingData.reviewCount} Reviews)
              </Text>
            )}
          </View>
        </Link>
  
          <View style={styles.divider} />
          <View style={{ gap: 10, flexDirection: "row", alignItems: 'center' , marginLeft: 24 }}>
            <Text style={styles.courtType}>Type of coverage:</Text>
            <Text style={{ fontFamily: 'pop' }}>{item.courtType}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
  
          <View>
            <Link style={{ color: 'blue' }} asChild
                  href={{
                    pathname: "/(modals)/addReview",
                    params: { id: id },
                  }}>
              <TouchableOpacity style={styles.buttonLink}>
                <Text style={styles.link}>Leave a review</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.ScrollView>
  
        {isLoaded && (
          <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
            <View style={{ flexDirection: 'row', gap: 40, alignItems: 'center' }}>
              <Link asChild href={{
                pathname: "/(modals)/events",
                params: { id: id }
              }}>
                <TouchableOpacity style={{ flexDirection: 'row', gap: 10 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'pop-sb', textDecorationLine: 'underline' }}>
                    {activities}
                  </Text>
                  <Text style={{ fontSize: 16, fontFamily: 'pop-sb' }}>Upcoming activities</Text>
                </TouchableOpacity>
              </Link>
  
              <Link style={defaultStyles.btn} asChild
                href={{
                  pathname: "/(modals)/addEvent",
                  params: { id: id },
                }}>
                <TouchableOpacity style={defaultStyles.btn}>
                  <Text style={[defaultStyles.btnText, { paddingHorizontal: 10 }]}>Add activity</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        )}
      </View>
  
      {loading && <AppLoader />}
    </>
  );
};

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
  courtType: {
    fontFamily: 'pop-sb',
    fontSize: 18,
  },
  description: {
    marginLeft: 24,
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'pop',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
  },
  icon: {
    zIndex: 800,
  },
  link:{
    color: Colors.primary, 
    fontSize: 16,
    fontFamily: 'pop-sb', 
    textDecorationLine: 'underline', 
    paddingLeft: 24, 
  },
  buttonLink: {

  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 24,
  },
  reviewText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#777',
  },
});

export default Page;