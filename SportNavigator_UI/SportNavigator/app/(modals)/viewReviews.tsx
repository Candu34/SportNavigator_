import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useLocalSearchParams } from "expo-router";
  import { API_URL } from "@/constants/api_url";
  import axios from "axios";
  import { Picker } from "@react-native-picker/picker";
  import { defaultStyles } from "@/constants/Styles";
  
  const placeholderImage =
    "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
  
  const ReviewCard = ({ review }) => {
    const fullName = review.user?.firstName + " " + review.user?.lastName;
  
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.userSection}>
          <Image
            source={{
              uri:
                review.user?.image?.data !== null
                  ? `data:${review.user.image.mime};base64,${review.user.image.data}`
                  : placeholderImage,
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{fullName}</Text>
        </TouchableOpacity>
        <Text style={styles.rating}>⭐ {review.rating}</Text>
        <Text style={styles.description}>{review.description}</Text>
      </View>
    );
  };
  
  const Page = () => {
    const { id: courtId } = useLocalSearchParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ratingFilter, setRatingFilter] = useState("all");
  
    const fetchReviews = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/reviews/court?courtId=${courtId}`;
        if (ratingFilter !== "all") {
          url += `&rating=${ratingFilter}`;
        }
  
        const response = await axios.get(url);
        const data = response.data?.data || [];
  
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchReviews();
    }, [ratingFilter]);
  
    return (
      <View style={defaultStyles.container}>
        <Text style={styles.filterLabel}>Filter by Rating:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={ratingFilter}
            onValueChange={(value) => setRatingFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="5 stars" value="5" />
            <Picker.Item label="4 stars" value="4" />
            <Picker.Item label="3 stars" value="3" />
            <Picker.Item label="2 stars" value="2" />
            <Picker.Item label="1 star" value="1" />
          </Picker>
        </View>
  
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : reviews.length > 0 ? (
          <FlatList
            data={reviews}
            renderItem={({ item }) => <ReviewCard review={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            No reviews found.
          </Text>
        )}
      </View>
    );
  };
  
  export default Page;
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    userSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
      backgroundColor: "#eee",
    },
    userName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#007AFF",
    },
    rating: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: "#444",
    },
    pickerContainer: {
      marginHorizontal: 12,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: "#ccc",
      overflow: "hidden",
      marginBottom: 10,
    },
    picker: {
      height: 42,
      width: "100%",
    },
    filterLabel: {
      marginLeft: 14,
      marginTop: 8,
      fontWeight: "500",
    },
  });
  