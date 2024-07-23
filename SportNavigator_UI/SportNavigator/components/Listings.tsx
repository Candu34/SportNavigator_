import { View, Text, ListRenderItem, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from "@/constants/Styles";
import { Link, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import  Animated, { FadeInLeft, FadeOutLeft }  from "react-native-reanimated";





const Listings = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const listRef = useRef<FlatList>(null);
    const [base64Image, setBase64Image] = useState<string>('');
    const [nextPage, setNextPage] = useState();

    const initialPage = 'https://3q55nqgg-8080.euw.devtunnels.ms/api/favorite?userId=1';

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(initialPage);
            const responseJson = await response.json();
            setItems(responseJson.favoriteSportCourts); 
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
    React.useCallback(() => {
        fetchItems();
    }, [])
);

const addToFavorite = (courtId: string) => {
    const url = `/favorite?userId=1&courtId=${courtId}`;
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
      })
}

useEffect(() => {
    fetchItems();
}, []);

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
                    <TouchableOpacity style={{position: 'absolute', right: 30, top: 30}} onPress={() => addToFavorite(item.id)}>
                        <Ionicons name="heart-outline" size={24} color={'#fff'}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
                        <View style={styles.textContainer}>
                            <Text style={{fontFamily: 'pop-b', fontSize: 16}}>{item.name}</Text>
                            <Text style={{fontFamily: 'pop-sb'}}>{item.courtType}</Text>
                        </View>
                        <View style={{flexDirection: 'row', gap: 4}}>
                                <Ionicons name={'star'} size={14} />
                                <Text style={{fontFamily: 'pop-sb', paddingHorizontal: 5}}>0.0</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Text style={{fontFamily: 'pop-sb'}}>Sport</Text>
                        <Text style={{fontFamily: 'pop'}}>{item.sport}</Text>
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
    elevation: 8, // Increased elevation value for a more noticeable shadow
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
