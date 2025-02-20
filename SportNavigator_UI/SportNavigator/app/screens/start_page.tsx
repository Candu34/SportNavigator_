import { View, Text, SafeAreaView, StyleSheet, ImageBackground, Touchable, TouchableOpacity, Platform, StatusBar  } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";



const Page = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/enter-page-bg.jpg')} resizeMode="cover" style={styles.image_bg}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <View >
                                <Text numberOfLines={1} style={{color: 'white', fontSize: 60, marginLeft: 'auto',
                                 marginRight: 'auto' , fontFamily: 'pop-b', transform: [{scaleY: 3}],        shadowColor: "#000",
                                 shadowOffset: {
                                 width: 0,
                                 height: 9,
                                 },
                                 shadowOpacity: 0.50,
                                 shadowRadius: 12.35,
                         
                                 elevation: 19, }}>
                                    SPORT 
                                </Text>
                            </View>
                            <View>
                                <Text numberOfLines={1} style={{color: 'white', fontSize: 60,  marginLeft: 'auto', 
                                marginRight: 'auto',fontFamily: 'pop-b',  transform: [{scaleY: 3}],
                                paddingTop: 30}}>
                                    NAVIGATOR 
                                </Text>
                            </View>
                        </View>
                        <View style={styles.buttons_container}>
                            <TouchableOpacity  style={styles.loginButton} onPress={() => {router.navigate("/(modals)/login")}}>
                                <Text  style={{fontSize: 20, fontFamily: 'pop-sb'}}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.joinButton} onPress={() => {router.navigate("/(modals)/register")}}>
                                <Text style={{fontSize: 20, fontFamily: 'pop-sb', color: '#fff'}}>Join now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    image_bg: {
        flex: 1
    },
    content:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    title:{
        marginTop: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        color: '#fff',
    },
    buttons_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 80,
        paddingLeft: 50,
        paddingRight: 50,
    },
    loginButton: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth, 
        borderColor: 'black',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
	    width: 0,
	    height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
    },
    joinButton:{
        backgroundColor: Colors.primary,
        borderWidth: StyleSheet.hairlineWidth, 
        borderColor: 'black',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
	    width: 0,
	    height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
    }
})


export default Page