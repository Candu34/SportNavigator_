import { View,ActivityIndicator, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import React, {useState} from "react";
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AppLoader from "@/components/AppLoader";
import { API_URL } from "@/constants/api_url";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const Page = () => {
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [images, setImages] = useState(null);
const [open, setOpen] = useState(false);
const [open1, setOpen1] = useState(false);
const [courtType, setCourtType] = useState(null);
const [loading, setLoading] = useState(false);
const [sport, setSport] = useState(null);
const [sports, setSports] = useState([
    {label: 'Basketball', value: 'BASKETBALL'},
    {label: 'Football', value: 'FOOTBALL'},
    {label: 'Tennis', value: 'TENNIS'},
    {label: 'Volleyball', value: 'VOLLEYBALL'},
    {label: 'Table tennis', value: 'TABLE_TENNIS'},
]);
const [courtTypes, setCourtTypes] = useState([
    {label: 'Indor', value: 'INDOR'},
    {label: 'Concrete', value: 'CONCRETE'},
    {label: 'Asphalt', value: 'ASPHALT'},
    {label: 'EPDM', value: 'EPDM'},
    {label: 'Modular', value: 'MODULAR'},
    {label: 'Grass', value: 'GRASS'},
]);
const router = useRouter();
const navigation = useNavigation();
const route = useRoute();
const markerPosition = route.params?.markerPosition;

const handleNameChange = (text:string) => {
    setName(text);
};

const handleDescriptionChange = (text:string) => {
    setDescription(text);
};

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
            <Text style={[styles.title]}>Add new</Text>
            <Text style={[styles.title, {color: Colors.primary}]}>Court</Text>
        </View>
        ),
    });
}, [navigation]);

const handleSubmit = async () => {
    if (!name || !description || !sport || !courtType || !markerPosition?.latitude || !markerPosition?.longitude || !images || !images.length) {
        Alert.alert('Error', 'Please fill in all fields and select images');
        return;
    }
    setLoading(true);

    try {
        const userData = await SecureStore.getItemAsync('user');
        if (!userData) {
            throw new Error("User not found in storage");
        }
        
        const user = JSON.parse(userData); 
        if (!user.id) {
            throw new Error("Invalid user data");
        }

        const sportCourtDTO = {
            name,
            description,
            sport,
            courtType,
            images,
            userID: user.id, 
            latitude: markerPosition.latitude,
            longitude: markerPosition.longitude
        };

        // Send API request
        const response = await axios.post(`${API_URL}/courts`, sportCourtDTO);
        setLoading(false);

        if (response.status === 200) {
            const data = response.data;
            setName('');
            setDescription('');
            setImages(null);
            setSport(null);
            setCourtType(null);
            Alert.alert('Success');
            router.navigate(`/listing/${data}`);
        } else {
            Alert.alert('Error', response.data.message);
        }
    } catch (error) {
        setLoading(false);
        console.error('Error:', error);
        Alert.alert('Error', error.message || "Something went wrong");
    }
};




const pickImage = async () => {
    let arr = [];


    let { status } = await ImagePicker.requestCameraPermissionsAsync(); 
  if (status !== 'granted') {
    Alert.alert('Error', 'Sorry, we need camera roll permissions to choose images.');
    return;
  }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      allowsMultipleSelection: false,
      base64: true,
    });

    if (!result.canceled) {
        arr = [];
        for (let i = 0; i < result.assets.length; i++) {
            arr.push({mime:result.assets[i].fileName, data: result.assets[i].base64 })
          }
        setImages(arr as any);
    }
  };

    return (
        <>
        <View style={[styles.container, {marginBottom: 30}]}>
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
            <DropDownPicker
                    style={[defaultStyles.inputField, {marginBottom: 20}]}
                    open={open}
                    value={sport}
                    items={sports}
                    setOpen={setOpen}
                    setValue={setSport}
                    setItems={setSports}
                    textStyle={{
                        fontFamily: 'pop',
                        fontSize: 14,
                        color: Colors.grey,
                    }}
                    placeholder={'Choose sport'}
                    zIndex={99}
                />
                <DropDownPicker
                    style={[defaultStyles.inputField, {marginBottom: 20}]}
                    open={open1}
                    value={courtType}
                    items={courtTypes}
                    setOpen={setOpen1}
                    setValue={setCourtType}
                    setItems={setCourtTypes}
                    textStyle={{
                        fontFamily: 'pop',
                        fontSize: 14,
                        color: Colors.grey,
                    }}
                    placeholder={'Choose court type'}
                    zIndex={98}
                />
            <View style={{gap: 20}}>
            <TouchableOpacity style={[defaultStyles.btn, {flexDirection: 'row', gap: 10}]} 
                                onPress={pickImage}>
                <MaterialCommunityIcons name="file-image-plus-outline" size={24} color="white" />
                <Text style={defaultStyles.btnText}>Select Images</Text>
            </TouchableOpacity>
            <TouchableOpacity style ={[defaultStyles.btn,{flexDirection: 'row', gap: 10} ]} onPress={() => {router.navigate("/(modals)/mapInput")}}>
                <Entypo name="location" size={24} color="white" />
                <Text style={defaultStyles.btnText}>Select location</Text>
            </TouchableOpacity>
            
            </View>
        <View>
            <View style={styles.seperatorView}>
                <View style={{borderBottomColor: '#000',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        flex: 1,
                }}/>
            </View>
                <TouchableOpacity style={defaultStyles.btn} onPress={handleSubmit}>
                    <Text style={defaultStyles.btnText}>Add court</Text>
                </TouchableOpacity>
            </View>
        </View>
        {loading && <AppLoader/>}
        </>
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
})

export default Page