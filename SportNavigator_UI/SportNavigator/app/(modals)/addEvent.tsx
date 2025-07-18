import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import DatePicker from 'react-native-modern-datepicker';
import AppLoader from "@/components/AppLoader";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@/constants/api_url";

const Page = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState("");
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [maxParticipants, setMaxParticipants] = useState('');


    const router = useRouter();
    const params = useLocalSearchParams();
    const courtId = params.id;

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userData = await SecureStore.getItemAsync('user');
                if (!userData) {
                    throw new Error("User not found in storage");
                }

                const user = JSON.parse(userData);
                if (!user.id) {
                    throw new Error("Invalid user data");
                }

                setUserId(user.id);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    const handleSubmit = async () => {
        if (!name || !description || !date) {
            Alert.alert('Error', 'Please fill in all fields and select a date');
            return;
        }
        if (isNaN(Number(maxParticipants)) || Number(maxParticipants) <= 0) {
            Alert.alert('Error', 'Max participants must be a positive number');
            return;
        }
        setLoading(true);

        const eventDTO = {
            name: name,
            description: description,
            sportCourtID: courtId,
            userId: userId,
            event_time: date,
            maxParticipants: parseInt(maxParticipants, 10),
        };

        try {
            const response = await axios.post(`${API_URL}/events`, eventDTO, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setLoading(false);
            if (response.status === 200) {
                setName('');
                setDescription('');
                setDate("");
                Alert.alert('Success');
                router.navigate("/listing/" + courtId);
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            Alert.alert('Error', error.message);
        }
    };

    const handleNameChange = (text: string) => {
        setName(text);
    };

    const handleDescriptionChange = (text: string) => {
        setDescription(text);
    };

    const handleOnSelectedChange = (selectedDate: any) => {
        setDate(getFormattedDateTime(selectedDate));
        console.log(getFormattedDateTime(selectedDate));
    }

    const handleOnPressDateTime = () => {
        setShowDateTimePicker(!showDateTimePicker);
    }

    function getFormattedDateTime(dateString: string) {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.container}>
                    <TextInput autoCapitalize='none' placeholder='Name'
                        style={[defaultStyles.inputField, { marginBottom: 15, fontFamily: 'pop' }]}
                        value={name}
                        maxLength={15}
                        onChangeText={handleNameChange} />
                    <TextInput autoCapitalize='none' multiline={true}
                        numberOfLines={4}
                        placeholder='Description'
                        maxLength={30}
                        value={description}
                        style={[defaultStyles.inputField, { marginBottom: 20, fontFamily: 'pop', height: 80 }]}
                        onChangeText={handleDescriptionChange} />
                        <TextInput
                        keyboardType="number-pad"
                        placeholder="Max participants"
                        value={maxParticipants}
                        onChangeText={setMaxParticipants}
                        style={[defaultStyles.inputField, { marginBottom: 15, fontFamily: 'pop' }]}/>
                    <TouchableOpacity onPress={handleOnPressDateTime} style={[defaultStyles.btn, { flexDirection: 'row', gap: 20 }]}>
                        <MaterialCommunityIcons name="timetable" size={24} color="white" />
                        <Text style={defaultStyles.btnText}>Select date and time</Text>
                    </TouchableOpacity>
                    <View style={styles.seperatorView}>
                        <View style={{
                            borderBottomColor: '#000',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            flex: 1,
                        }} />
                    </View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={defaultStyles.btn}>
                        <Text style={defaultStyles.btnText}>Add Event</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showDateTimePicker}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>

                                <DatePicker
                                    onSelectedChange={date => handleOnSelectedChange(date as any)}
                                    minuteInterval={5}
                                    options={{
                                        defaultFont: 'pop-sb',
                                        headerFont: 'pop-b',
                                        backgroundColor: '#080516',
                                        textHeaderColor: '#469ab6',
                                        textDefaultColor: '#fff',
                                        selectedTextColor: '#fff',
                                        mainColor: Colors.primary,
                                        textSecondaryColor: '#469ab6',
                                        borderColor: 'rgba(122,146, 165, 0.1)',
                                    }}
                                />

                                <TouchableOpacity onPress={handleOnPressDateTime}>
                                    <Text style={defaultStyles.btnText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
            {loading && <AppLoader />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 26,
        paddingTop: 70,
    },
    btnOutlineText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'pop-sb',
    },
    seperatorView: {
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
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    modalView: {
        margin: 20,
        backgroundColor: "#080516",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 35,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})
export default Page;