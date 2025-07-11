import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { View, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; 
import { defaultStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@/constants/api_url";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Colors from "@/constants/Colors";
import AppLoader from "@/components/AppLoader";


const Page = () => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();
    const params = useLocalSearchParams();
    const courtId = params.id;

    useEffect(() => {
            const fetchUserId = async () => {
                try {
                    const userData = await SecureStore.getItemAsync('user');
                    if (!userData) {
                        throw new Error("[addReview] User not found in storage");
                    }
    
                    const user = JSON.parse(userData);
                    if (!user.id) {
                        throw new Error("[addReview] Invalid user data");
                    }
    
                    setUserId(user.id);
                } catch (error) {
                    console.error("[addReview] Error fetching user ID:", error);
                }
            };
    
            fetchUserId();
        }, []);


    const handleDescriptionChange = (text: string) => {
      setDescription(text);
  };

  const handleSummit = async () => {
    if (description.length === 0) {
        setErrorMsg('Please fill the description');
        setError(true);
        return;
    } 

    if (rating === 0) {
        setErrorMsg('Please select a rating');
        setError(true);
        return;
    }
    setError(false);

    const reviewDTO = {
        description: description, 
        rating: rating,
        userID: userId,
        sportCourtID: courtId,
    };
    console.log("[addReview] ", reviewDTO);
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/reviews`, reviewDTO, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      setLoading(false);
            if (response.status === 200) {
                setDescription('');
                setRating(0);
                setError(false);
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
  }


    return(
        <>
        <View style={styles.container}>
        <TextInput autoCapitalize='none' multiline={true}
                                numberOfLines={10}
                                maxLength={200}
                                placeholder='Description'
                                value={description}
                                style={[defaultStyles.inputField, { marginBottom: 30, fontFamily: 'pop', height: 110, borderRadius: 30 }]}
                                onChangeText={handleDescriptionChange} />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome5
              name="basketball-ball"
              size={32}
              color={star <= rating ? Colors.primary : Colors.dark} 
              style={{ marginHorizontal: 10, marginBottom: 30 }}
            />
          </TouchableOpacity>
        ))}
      </View>
        <TouchableOpacity
            onPress={handleSummit}
            style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>Leave Review</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>
      {loading && <AppLoader />}
        </>
)}

    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 26,
            paddingTop: 150,
        },
        errorText: {
            color: 'red',
            marginTop: 15,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: 'pop',
            textDecorationLine: 'underline'
        }
    })

    export default Page;

