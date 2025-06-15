import { View, FlatList, ListRenderItem, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from 'react';
import { defaultStyles } from "@/constants/Styles";
import { ListItem } from "@/components/ListItem";
import axios from 'axios';
import { API_URL } from "@/constants/api_url";

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [nextPage, setNextPage] = useState('');
    const [isLast, setIsLast] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();
    const courtId = params.id;

    const initialPage = `${API_URL}/events/court/${courtId}`;

    const fetchItems = async (url: string) => {
        try {
            setLoading(true);
            console.log(`Fetching items from URL: ${url}`);
            const response = await axios.get(url);
            const responseData = response.data;

            if (responseData.eventsDTO && responseData.responseInfo) {
                setItems(responseData.eventsDTO);
                const nextPageNo = parseInt(responseData.responseInfo.pageNo) + 1;
                setIsLast(responseData.responseInfo.last);
                const nextUrl = `${initialPage}?pageNo=${nextPageNo}`;
                setNextPage(nextUrl);
                console.log(`Next page URL: ${nextUrl}`);
            } else {
                console.error("Unexpected response structure", responseData);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loading || isLast) {
            return;
        }

        try {
            setLoading(true);
            console.log(`Loading more items from URL: ${nextPage}`);
            const response = await axios.get(nextPage);
            const responseData = response.data;

            setItems((existingItems) => [...existingItems, ...responseData.eventsDTO]);
            const nextPageNo = parseInt(responseData.responseInfo.pageNo) + 1;
            const nextUrl = nextPage.replace(/pageNo=\d+/, `pageNo=${nextPageNo}`);
            setNextPage(nextUrl);
            setIsLast(responseData.responseInfo.last);
            setLoading(false);
        } catch (error) {
            console.error("Error loading more items:", error);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems(initialPage);
        }, [initialPage])
    );

    const renderRow: ListRenderItem<any> = ({ item }) => {
        return (
           <ListItem item={item} />
        );
    };

    return (
        <View style={defaultStyles.container}>
            {loading && items.length === 0 ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderRow}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={1}
                    ListFooterComponent={() => loading && <ActivityIndicator />}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={3}
                    windowSize={5}
                />
            )}
            {!loading && items.length === 0 && (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No events found.</Text>
            )}
        </View>
    );
}

export default Page;