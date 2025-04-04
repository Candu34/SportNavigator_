import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { View, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; 
import { defaultStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";


const Page = () => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(false);


    const handleDescriptionChange = (text: string) => {
      setDescription(text);
  };

  const handleSummit = () => {
    if (description.length === 0 && rating === 0) {
        setError(true);
        return;
    }

  }


    return(
        <>
        <View style={styles.container}>
        <TextInput autoCapitalize='none' multiline={true}
                                numberOfLines={6}
                                placeholder='Description'
                                value={description}
                                style={[defaultStyles.inputField, { marginBottom: 30, fontFamily: 'pop', height: 80 }]}
                                onChangeText={handleDescriptionChange} />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome
              name="star"
              size={32}
              color={star <= rating ? "orange" : "gray"} 
              style={{ marginHorizontal: 5, marginBottom: 30 }}
            />
          </TouchableOpacity>
        ))}
      </View>
        <TouchableOpacity
            onPress={handleSummit}
            style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>Leave Review</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>Please fill in all fields</Text>}
      </View>
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

