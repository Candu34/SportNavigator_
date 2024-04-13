import { View, Text, ListRenderItem, FlatList, Image, StyleSheet, Touchable, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import  Animated, { FadeInLeft, FadeOutLeft }  from "react-native-reanimated";

interface Props{
    listings: any[];
    category: string;
}


const Listings = ({ listings, category } : Props) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const listRef = useRef<FlatList>(null);
    const [base64Image, setBase64Image] = useState<string>('');
    const [nextPage, setNextPage] = useState();

    const initialPage = 'https://3q55nqgg-8080.euw.devtunnels.ms/api/courts'+'?sport='+category;

    const fetchItems = async () => {
        try {
            setLoading(true);
            console.log("Fetching -------------------")
            const response = await fetch(initialPage);
            const responseJson = await response.json();
            setItems(responseJson.content); 
            const nextPageNo = parseInt(responseJson.responseInfo.pageNo) + 1;
            const nextUrl = initialPage + '&pageNo='+ nextPageNo
            setNextPage(nextUrl as any)
    
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    
    
    const loadMore = async () => { 
        if (loading){
            return;
        }
            if (nextPage) {
                setLoading(true);
                console.log("Fetching -------------------") ;

                const response = await fetch(nextPage as any);
                const responseJson = await response.json();
                setItems((existingItems) => {
                    return [...existingItems, ...responseJson.content] as any;
                });

                const nextPageNo = parseInt(responseJson.responseInfo.pageNo) + 1;
                const nextUrl = nextPage.replace(/pageNo=\d+/, 'pageNo=' + nextPageNo);
                setNextPage(nextUrl as any);
    };
};


    useEffect(() => {
        fetchItems();
    }, [category]);

    const renderRow: ListRenderItem<any> = ({ item }) => {
        const handleImageLoad = () => {
            setBase64Image(item.images[0].data);
        };
        return (
            <Link href={`/listing/${item.id}`} asChild>
                <TouchableOpacity>

                    <Animated.View style={styles.listing} entering={FadeInLeft} exiting={FadeOutLeft}>
                        <Image
                            onLoad={handleImageLoad}
                            source={{ uri: `data:image/png;base64,${item.images[0].data}` }}
                            style={styles.image} 
                        />
                        <TouchableOpacity style={{position: 'absolute', right: 30, top: 30}}>
                            <Ionicons name="heart-outline" size={24} color={'#fff'}/>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between',
                            paddingTop: 10
                        }}>
                            <View style={styles.textContainer}>
                                <Text style={{fontFamily: 'pop-b', fontSize: 16}}>{item.name}</Text>
                                <Text style={{fontFamily: 'pop-sb'}}>{item.courtType}</Text>
                            </View>
                            <View style={{flexDirection: 'row', gap: 4}}>
                                    <Ionicons name={'star'} size={14} />
                                    <Text style={{fontFamily: 'pop-sb', paddingHorizontal: 5}}>0.0</Text>
                            </View>
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
            ListFooterComponent={() => loading && <ActivityIndicator/>}
            showsVerticalScrollIndicator={false}      
            initialNumToRender={3}   
            windowSize={5}
          />
        </View>
    );
}

const styles = StyleSheet.create({
    listing: {
        padding: 10,
        gap: 10,
    },
    itemContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5, 
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 25,
    },
    textContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
});

export default Listings;
