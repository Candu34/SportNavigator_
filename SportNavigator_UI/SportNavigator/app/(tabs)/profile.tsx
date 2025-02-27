import { View, Text } from "react-native";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { TouchableOpacity } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import {StyleSheet} from 'react-native';
import Colors from "@/constants/Colors";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";


const Page = () => {
const router = useRouter();
const {onLogout} = useAuth();


const handleLogOut = async () => {
    const result = await onLogout();
    router.replace('/screens/start_page');
}


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleLogOut} style={defaultStyles.btn }>
                <MaterialIcons name="logout" size={24} color="white" style={defaultStyles.btnIcon}/>
                <Text style={defaultStyles.btnText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 26, 
    },
    seperatorView:{
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 30,
    },
    separator: {
        fontFamily: 'pop-sb',
        color: Colors.grey,
        marginLeft: 5,
        marginRight: 5,
    },
    btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
      },
      btnOutlineText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'pop-sb',
      },
})

export default Page