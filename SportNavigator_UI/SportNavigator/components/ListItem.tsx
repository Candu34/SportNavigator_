  import React from "react";
  import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
  import { useRouter } from "expo-router";
  import Colors from "@/constants/Colors";

  export const ListItem = ({ item }) => {
    const router = useRouter();

    return (
      <TouchableOpacity
        style={styles.wrap}
        activeOpacity={0.8}
        onPress={() => router.push(`/event/${item.id}`)}
      >
        {/* Optionally display event owner image */}
        {item.user && item.user.image && item.user.image.data ? (
          <Image
            source={{ uri: `data:${item.user.image.mime};base64,${item.user.image.data.slice(16)}` }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.counterText}>
            {(item.participants ?? 0)}/{item.maxParticipants ?? 0} participants
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    wrap: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#ccc",
      marginTop: 10,
      borderWidth: 1,
      marginVertical: 5,
      marginHorizontal: 10,
      borderRadius: 20,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.12,
      padding: 10,
    },
    image: {
      width: 50,
      height: 50,
      marginRight: 16,
      borderRadius: 30,
    },
    imagePlaceholder: {
      width: 50,
      height: 50,
      marginRight: 16,
      borderRadius: 30,
      backgroundColor: '#ccc',
    },
    title: {
      fontFamily: 'pop-b',
      fontSize: 20,
      marginBottom: 2,
    },
    counterText: {
      fontFamily: 'pop',
      fontSize: 15,
      color: Colors.primary,
      opacity: 0.8,
    },
  });
