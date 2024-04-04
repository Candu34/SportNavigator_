import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Page = () => {
    const { id } = useLocalSearchParams<{id: string}>();
    return(
        <View>
            <Text>
                Id
            </Text>
        </View>
    )
}

export default Page