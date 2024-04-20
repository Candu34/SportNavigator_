import { View, Text } from "react-native";
import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import ListingMap from "@/components/ListingMap";
import Listings from "@/components/Listings";
import ListingBottomSheet from "@/components/ListingBottomSheet";

const Page = () => {
const [category, setCategory] = useState('Basketball')
const onDataChanged = (category: string) => {
    setCategory(category);
}


    return (
        <View style={{flex: 1, marginTop: 140 }}>
           <Stack.Screen 
                options={{
                    header: () => <ExploreHeader onCategoryChanged={onDataChanged}/>,
                }}
           />
           {/* <Listings  category={category}/> 
            <ListingBottomSheet category={category}/> */}
            <ListingMap category={category}/> 
        </View>
    )
}

export default Page