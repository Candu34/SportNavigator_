import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import React, {useState} from "react";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import validate from 'react-native-email-validator';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";





const Page = () => {
    useWarmUpBrowser();
    const [email, setMail] = useState('');
    const [password, setPassword] = useState('');
    const {onLogin, onRegister} = useAuth();
    const router = useRouter();

    const handleMailChange = (text:string) => {
        setMail(text);
    };
    
    const handlePasswordChange = (text:string) => {
        setPassword(text);
    };
    
    const handleSubmit = async () => {
        if (!validate(email)) {
          return Alert.alert('Invalid email');
        }
    
        if (password.length < 8) {
          return Alert.alert('Password should be at least 8 characters');
        }
    
        try {
          const result = await onLogin(email, password);
          if (result.error) {
            Alert.alert('Login failed', result.msg);
          } else {
            console.log('Login successful');
            router.replace('/(tabs)'); 
          }
        } catch (error) {
          console.error('Login failed:', error);
          Alert.alert('Login failed', error.message.toString());
        }
      };


    return (
        <View style={[styles.container, {marginBottom: 30}]}>
            <TextInput autoCapitalize='none' 
            placeholder='Email'
            value={email}
            style={[defaultStyles.inputField, {marginBottom: 15, fontFamily: 'pop'}]}
            onChangeText={handleMailChange}/>
            <TextInput autoCapitalize='none' secureTextEntry={true} 
            placeholder='Password'
            onChangeText={handlePasswordChange}
            value={password}
            style={[defaultStyles.inputField, {marginBottom: 30, fontFamily: 'pop'}]}/>
            <TouchableOpacity style={defaultStyles.btn} onPress={handleSubmit}>
                <Text style={defaultStyles.btnText}>Continue</Text>
            </TouchableOpacity>
            <View style={styles.seperatorView}>
                <View style={{borderBottomColor: '#000',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        flex: 1,
                }}/>
                <Text style={styles.separator}>
                    or
                </Text>
                <View style={{borderBottomColor: '#000',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        flex: 1,
                }}/>
            </View>

            <View style={{gap: 20}}>
                <TouchableOpacity style={styles.btnOutline} onPress={() => router.navigate('/(modals)/register')}>
                <FontAwesome name="sign-in" size={24} color="black" style={defaultStyles.btnIcon}/>
                    <Text style={styles.btnOutlineText}>Create Account</Text>
                </TouchableOpacity>

            </View>
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
        marginLeft: 20,
      },
})
export default Page