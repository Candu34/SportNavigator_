import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { View, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; 
import { defaultStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";


const Page = () => {
    const [score, setScore] = useState(1);
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');


    const handleDescriptionChange = (text: string) => {
      setDescription(text);
  };

  const handleSummit = () => {
    console.log("Sending review to server");
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
      </View>
        </>
)}

    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 26,
            paddingTop: 150,
        }
    })

    export default Page;

