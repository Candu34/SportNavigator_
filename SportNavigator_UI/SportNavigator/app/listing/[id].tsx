import { View, Text, StyleSheet, Dimensions, Touchable, TouchableOpacity, Share } from "react-native";
import React, {useState, useEffect, useLayoutEffect} from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
  } from 'react-native-reanimated';
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedView } from "react-native-reanimated/lib/typescript/reanimated2/component/View";


const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');


const Page = () => {
    const { id } = useLocalSearchParams<{id: string}>();
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [base64Image, setBase64Image] = useState<string>('');
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
        }catch (err) {
            console.log(err);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackground: () => ( 
                <Animated.View style={[styles.header, headerAnimatedStyle]}/>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity style={styles.roundButton} onPress={shareCourt} >
                        <Ionicons name='share-outline' size={22} color={'#000'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} >
                        <Ionicons name='heart-outline' size={22} color={'#000'}/>
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButton} onPress={() => (router.back())} >
                    <Ionicons name='chevron-back' size={24} color={'#000'}/>
                </TouchableOpacity>
            ),
        });
    }, [])

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
            setLoading(false)
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    useEffect(() => {
        fetchItems();
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
            </Animated.ScrollView>
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

});

export default Page