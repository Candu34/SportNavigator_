import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import LottieView from 'lottie-react-native';


const AppLoader = () => {
    const animation = useRef(null);
    useEffect(() => {

    }, []);



    return(
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
                <Image  style={{zIndex: 9999}} source={require('../assets/images/VZ1I25iKuQ.gif')}/>
        </View>
    )
}
//'../assets/images/loading.json'

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9997,
    },
})

export default AppLoader;