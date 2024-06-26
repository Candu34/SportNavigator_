import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import React, {useState} from "react";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import validate from 'react-native-email-validator';





const Page = () => {
    useWarmUpBrowser();
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const handleMailChange = (text:string) => {
        setMail(text);
    };
    
    const handlePasswordChange = (text:string) => {
        setPassword(text);
    };
    
    const handleSubmit = () => {
            validate(mail)
              ? console.log('Email is valid')
              : Alert.alert('Invalid mail');

              password.length < 8 ? Alert.alert("Invalid password"): console.log("valid password");
       }


    return (
        <View style={[styles.container, {marginBottom: 30}]}>
            <TextInput autoCapitalize='none' 
            placeholder='Email'
            value={mail}
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
                <TouchableOpacity style={styles.btnOutline}>
                    <Ionicons name='call-outline' size={24} style={defaultStyles.btnIcon}/>
                    <Text style={styles.btnOutlineText}>Continue with Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline}>
                    <SimpleLineIcons name="social-google" size={24} style={defaultStyles.btnIcon}/>
                    <Text style={styles.btnOutlineText}>Continue with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline}>
                    <SimpleLineIcons name='social-facebook' size={24} style={defaultStyles.btnIcon}/>
                    <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline}>
                    <AntDesign name='apple-o' size={24} style={defaultStyles.btnIcon}/>
                    <Text style={styles.btnOutlineText}>Continue with Apple</Text>
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
      },
})
export default Page