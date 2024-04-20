import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Listings from "@/components/Listings";
import { useNavigation } from '@react-navigation/native';
import Colors from "@/constants/Colors";

const Page = () => {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: '', 
            headerStyle: {
                backgroundColor: '#ffffff', 
                height: 160,
            },
            headerTintColor: '#000000', 
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <Text style={[styles.title]}>Your favorites</Text>
                    <Text style={[styles.title, {color: Colors.primary}]}>Courts</Text>
                </View>
            ),
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <Listings />
        </View>
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 30,
        marginTop: 40,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: -10,
        borderBottomEndRadius: 20,
        shadowColor: 'rgba(0, 0, 0, 0.5)', 
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 4, 
    },
    title: {
        fontSize: 40,
        fontFamily: 'pop-b',
        color: '#000000',
        textShadowColor: 'rgba(0, 0, 0, 0.25)', 
        textShadowOffset: { width: 1, height: 1 }, 
        textShadowRadius: 2, 
    },
});

export default Page;
