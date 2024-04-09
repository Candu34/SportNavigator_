import Colors from "@/constants/Colors";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import React from "react-native";
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons, Octicons   } from '@expo/vector-icons';


const Layout = () => {
    return <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarLabelStyle: {
                fontFamily: 'pop-sb',
            }
        }}>
           <Tabs.Screen name="index" options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color, size}) =>  
            <Ionicons name="search" color={color} size={size} />
           }}/>
           <Tabs.Screen name="favorits" options={{
            tabBarLabel: 'Favorits',
            tabBarIcon: ({ color, size}) =>  
            <MaterialIcons  name="favorite-border" color={color} size={size+1} />
           }}/>
           <Tabs.Screen name="inbox" options={{
            tabBarLabel: 'Inbox',
            tabBarIcon: ({ color, size}) =>  
            <AntDesign name="message1" color={color} size={size} />
           }}/>
            <Tabs.Screen name="add_new" options={{
            tabBarLabel: 'Add new',
            tabBarIcon: ({ color, size}) =>  
            <Ionicons name="add-circle-outline" color={color} size={size+3} />
           }}/>
            <Tabs.Screen name="profile" options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size}) =>  
            <Octicons  name="person" color={color} size={size+1} />
           }}/>
    </Tabs>;
}

export default Layout