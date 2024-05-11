import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform} from "react-native";
import React, {useState, useEffect} from "react";
import { Link, useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useRoute } from '@react-navigation/native';
import  DateTimePicker  from "@react-native-community/datetimepicker";

const Page = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date);
    const [mode, setMode] = useState();
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');

    const router = useRouter();
    const navigation = useNavigation();
    const route = useRoute();
    const courtId = route.params?.courtId;

    const onChange = (event, selectdDate) => {
        const currentDate = selectdDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }

    const handleNameChange = (text:string) => {
        setName(text);
    };
    
    const handleDescriptionChange = (text:string) => {
        setDescription(text);
    };
    
    return (
    <View style={styles.container}>
        <View style={styles.container}>
            <TextInput autoCapitalize='none' placeholder='Name'
                            style={[defaultStyles.inputField, {marginBottom: 15, fontFamily: 'pop'}]}
                            value={name}
                            onChangeText={handleNameChange}/>
            <TextInput autoCapitalize='none' multiline={true}
                            numberOfLines={4}
                            placeholder='Description' 
                            value={description}
                            style={[defaultStyles.inputField, {marginBottom: 20, fontFamily: 'pop', height: 80}]}
                            onChangeText={handleDescriptionChange}/>
        </View>
        <View>
            
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
      headerLeft: {
        marginLeft: 30,
        marginTop: 40,
        paddingBottom: 20,
        flexDirection: 'row',
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
    }
})
export default Page;