import { View, FlatList, ListRenderItem, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from 'react';
import { defaultStyles } from "@/constants/Styles";
import { ListItem } from "@/components/ExpandListItem";

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [nextPage, setNextPage] = useState('');
    const [isLast, setIsLast] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();
    const courtId = params.id;

    const initialPage = `https://3q55nqgg-8080.euw.devtunnels.ms/api/events/court/${courtId}`;

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(initialPage);
            const responseJson = await response.json();

            if (responseJson.eventsDTO && responseJson.responseInfo) {
                setItems(responseJson.eventsDTO);
                console.log(responseJson.responseInfo.pageNo);
                const nextPageNo = parseInt(responseJson.responseInfo.pageNo) + 1;
                setIsLast(responseJson.responseInfo.last);
                const nextUrl = `${initialPage}?pageNo=${nextPageNo}`;
                setNextPage(nextUrl);
            } else {
                console.error("Unexpected response structure", responseJson);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };

    const loadMore = async () => { 
        if (loading){
            return;
        }
            if (!isLast) {
                setLoading(true);

                const response = await fetch(nextPage as any);
                const responseJson = await response.json();
                setItems((existingItems) => {
                    return [...existingItems, ...responseJson.favoriteSportCourts] as any;
                });

                const nextPageNo = parseInt(responseJson.responseInfo.pageNo) + 1;
                const nextUrl = nextPage.replace(/pageNo=\d+/, 'pageNo=' + nextPageNo);
                setNextPage(nextUrl as any);
        };  
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    const renderRow: ListRenderItem<any> = ({ item }) => {
        return (
            <ListItem item={item} />
        );
    };

    return (
        <View style={defaultStyles.container}>
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
        </View>
    );
}

export default Page;
 