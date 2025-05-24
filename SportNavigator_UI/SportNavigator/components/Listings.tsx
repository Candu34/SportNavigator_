import { View, Text, ListRenderItem, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from "@/constants/Styles";
import { Link, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import { API_URL } from "@/constants/api_url";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Listings = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const listRef = useRef<FlatList>(null);
    const [base64Image, setBase64Image] = useState<string>('');
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [initialPage, setInitialPage] = useState<string | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);

    useEffect(() => {
        const fetchInitialPage = async () => {
            try {
                const userData = await SecureStore.getItemAsync('user');
                if (!userData) {
                    throw new Error("User not found in storage");
                }

                const user = JSON.parse(userData);
                if (!user.id) {
                    throw new Error("Invalid user data");
                }

                const initialPageUrl = `${API_URL}/favorite?userId=${user.id}`;
                setInitialPage(initialPageUrl);
                fetchItems(initialPageUrl);
            } catch (error) {
                console.error("Error fetching initial page:", error);
            }
        };

        fetchInitialPage();
    }, []);

    const fetchItems = async (url: string) => {
        try {
            setLoading(true);
            const response = await axios.get(url);
            const responseData = response.data;
            setItems(responseData.favoriteSportCourts);
            const nextPageNo = parseInt(responseData.responseInfo.pageNo) + 1;
            const nextUrl = `${url}&pageNo=${nextPageNo}`;
            setNextPage(nextUrl);
            setIsLastPage(responseData.responseInfo.last);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loading || !nextPage || isLastPage) {
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(nextPage);
            const responseData = response.data;
            setItems((existingItems) => [...existingItems, ...responseData.favoriteSportCourts]);
            const nextPageNo = parseInt(responseData.responseInfo.pageNo) + 1;
            const nextUrl = nextPage.replace(/pageNo=\d+/, `pageNo=${nextPageNo}`);
            setNextPage(nextUrl);
            setIsLastPage(responseData.responseInfo.last);
            setLoading(false);
        } catch (error) {
            console.error("Error loading more items:", error);
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (initialPage) {
                fetchItems(initialPage);
            }
        }, [initialPage])
    );

    const addToFavorite = async (courtId: string) => {
        const url = `${API_URL}/favorite?userId=1&courtId=${courtId}`;
        try {
            await axios.post(url, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    const renderRow: ListRenderItem<any> = ({ item }) => {
        const handleImageLoad = () => {
            setBase64Image(item.images[0].data);
        };
        return (
            <Link href={`/listing/${item.id}`} asChild>
                <TouchableOpacity>
                    <Animated.View style={styles.listing} entering={FadeInLeft} exiting={FadeOutLeft}>
                        <View style={Platform.OS === 'android' && styles.androidShadow}>
                            <Image
                                onLoad={handleImageLoad}
                                source={{ uri: `data:image/png;base64,${item.images[0].data}` }}
                                style={styles.image}
                            />
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }} onPress={() => addToFavorite(item.id)}>
                            <Ionicons name="heart-outline" size={24} color={'#fff'} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
                            <View style={styles.textContainer}>
                                <Text style={{ fontFamily: 'pop-b', fontSize: 16 }}>{item.name}</Text>
                                <Text style={{ fontFamily: 'pop-sb' }}>{item.courtType}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                <Ionicons name={'star'} size={14} />
                                <Text style={{ fontFamily: 'pop-sb', paddingHorizontal: 5 }}>{item.ratingData.averageRating}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Text style={{ fontFamily: 'pop-sb' }}>Sport</Text>
                            <Text style={{ fontFamily: 'pop' }}>{item.sport}</Text>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Link>
        );
    };

    return (
        <View style={defaultStyles.container}>
            <FlatList
                data={items}
                ref={listRef}
                renderItem={renderRow}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={1}
                ListFooterComponent={() => loading && !isLastPage && <ActivityIndicator />}
                showsVerticalScrollIndicator={false}
                initialNumToRender={3}
                windowSize={5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listing: {
        padding: 10,
        gap: 10,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 25,
        overflow: 'hidden',
    },
    androidShadow: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    textContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
});

export default Listings;