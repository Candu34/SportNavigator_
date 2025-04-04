import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import * as SecureStore from 'expo-secure-store';
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";


const Page = () => {
    const router = useRouter();
    const { onLogout } = useAuth();
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await SecureStore.getItemAsync('user');
                if (!userData) {
                    throw new Error("User not found in storage");
                }

                const user = JSON.parse(userData);
                if (!user.id) {
                    throw new Error("Invalid user data");
                }

                setUser(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const handleLogOut = async () => {
        const result = await onLogout();
        router.replace('/screens/start_page');
    };

    const onSaveUser = async () => {
        setEditing(false);
    };

    const onPickImage = async () => {
        // Pick image logic here
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Profile</Text>
                <TouchableOpacity onPress={handleLogOut}>
                    <MaterialIcons name="logout" size={24} color="black" style={defaultStyles.btnIcon} />
                </TouchableOpacity>
            </View>
            {user && (
                <View style={styles.card}>
                    <TouchableOpacity>
                    {user.image ? (
                        <Image 
                            source={{ uri: `data:${user.image.mime};base64,${user.image.data}` }} 
                            style={styles.avatar} 
                        />
                    ) : (
                        <Image 
                            source={require(`../../assets/images/athlete_primary.png`)} 
                            style={styles.avatar} 
                        />
                    )}
                    </TouchableOpacity>
                    <View>
                        {editing ? (
                            <View style={styles.editColumn}>
                                <TextInput placeholder="First name" style={defaultStyles.inputField, {width: 200, fontSize: 20}}
                                    value={user.firstName}
                                    onChangeText={setFirstName} >
                                </TextInput>
                                <TextInput placeholder="Last name" style={defaultStyles.inputField, {width: 200, fontSize: 20}}
                                    value={user.lastName}
                                    onChangeText={setLastName} >
                                </TextInput>
                               <TouchableOpacity onPress={onSaveUser}>
                                    <Ionicons name="checkmark-outline" size={30} color="orange"/>
                               </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.editRow}>
                                <Text style={{fontFamily: 'pop-b', fontSize: 20}}>
                                    {user.firstName} {user.lastName}
                                </Text>
                                <TouchableOpacity onPress={() => setEditing(true)}>
                                    <Ionicons name="create-outline" size={24} color="black" style={defaultStyles.btnIcon} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'center', gap: 10}}>
                        <Text style={{fontFamily: 'pop-sb', fontSize: 16}}>
                            Email: {user.email}
                        </Text>
                        <Text style={{fontFamily: 'pop-sb', fontSize: 16}}>
                            Science: {user.science}
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    header: {
        fontFamily: 'pop-b',
        fontSize: 40,
        color: Colors.primary, 
    },
    card: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        marginHorizontal: 24,
        marginTop: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        alignItems: 'center',
        gap: 14,
        marginBottom: 24,
    },
    avatar:{
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: Colors.grey,
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    editColumn: {
        flexDirection: 'column',
        width: 200,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems: 'center',
        gap: 20,
    }
});

export default Page;