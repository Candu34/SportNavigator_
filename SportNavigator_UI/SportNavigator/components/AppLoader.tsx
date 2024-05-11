import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import LottieView from 'lottie-react-native';


const AppLoader = () => {
    return(
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            {/* <LottieView style={{flex: 1,   width: 200,height: 200,zIndex: 9999,}} 
            source={require('../assets/images/loading.json')}
                autoPlay={true} loop={true}/> */}
                <Image  style={{zIndex: 9999, height: 200}} source={require('../assets/images/loading_.gif')}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9997,
    },
})

export default AppLoader;