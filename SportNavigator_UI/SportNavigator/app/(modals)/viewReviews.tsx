import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { API_URL } from "@/constants/api_url";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import avatarPlaceholder from "../../assets/images/avatar-people-person-svgrepo-com.png";
import Colors from "@/constants/Colors";



function formatReviewDate(dateStr: string) {
  if (!dateStr) return "";
  const reviewDate = new Date(dateStr);
  const now = new Date();
  if (
    reviewDate.getDate() === now.getDate() &&
    reviewDate.getMonth() === now.getMonth() &&
    reviewDate.getFullYear() === now.getFullYear()
  ) {
    return "Today";
  }
  return reviewDate.toLocaleDateString();
}

const ReviewCard = ({ review }) => {
  const user = review.user || {};
  const hasImage = user.image && user.image.data && user.image.mime;
  const imageUri = hasImage
    ? `data:${user.image.mime};base64,${user.image.data}`
    : null;

  const fullName =
    (user.firstName || "") + " " + (user.lastName || "");

  const renderStars = (rating) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Ionicons
          key={idx}
          name={idx < rating ? "star" : "star-outline"}
          size={17}
          color="#FFB800"
          style={{ marginRight: 0.5 }}
        />
      ))}
    </View>
  );

  const description =
    review.description?.length > 70
      ? review.description.slice(0, 70) + "..."
      : review.description;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={hasImage ? { uri: imageUri } : avatarPlaceholder}
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.userName}>
              {fullName.trim() || "Unknown User"}
            </Text>
            <Text style={styles.dateText}>
              {formatReviewDate(review.creationDate)}
            </Text>
          </View>
          {renderStars(review.rating)}
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

const Page = () => {
  const { id: courtId } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");

  const fetchReviewsWithUsers = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/reviews/court?courtId=${courtId}`;
      if (ratingFilter !== "all") {
        url += `&rating=${ratingFilter}`;
      }
      // 1. Fetch reviews
      const response = await axios.get(url);
      const data = response.data?.data || [];

      // 2. Collect unique userIDs
      const userIds = [...new Set(data.map(r => r.userID))];

      // 3. Fetch user info for each userID (in parallel)
      const userFetches = userIds.map(id =>
        axios.get(`${API_URL}/users/info/${id}`).then(res => ({ id, ...res.data }))
      );
      const userInfos = await Promise.all(userFetches);

      // 4. Map user info by userID
      const userMap = {};
      userInfos.forEach(user => {
        userMap[user.id] = user;
      });

      // 5. Attach user to each review
      const reviewsWithUsers = data.map(review => ({
        ...review,
        user: userMap[review.userID] || {}, // fallback to empty object
      }));

      setReviews(reviewsWithUsers);
    } catch (error) {
      console.error("Error fetching reviews or users:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsWithUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingFilter, courtId]);

  // Modern horizontal filter bar
  const FilterBar = () => (
    <View style={styles.filterBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[
              styles.filterButton,
              ratingFilter === f.value && styles.filterButtonActive,
            ]}
            onPress={() => setRatingFilter(f.value)}
          >
            {f.value === "all" ? (
              <Text
                style={[
                  styles.filterText,
                  ratingFilter === f.value && styles.filterTextActive,
                ]}
              >
                All
              </Text>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="star"
                  size={16}
                  color="#FFB800"
                  style={{ marginRight: 2 }}
                />
                <Text
                  style={[
                    styles.filterText,
                    ratingFilter === f.value && styles.filterTextActive,
                  ]}
                >
                  {f.value}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={defaultStyles.container}>
      <Text style={styles.headerTitle}>Reviews</Text>
      <FilterBar />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 6,
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 12,
    marginTop: 2,
  },
  filterButton: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "bold",
  },
  filterTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 80,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userName: {
    fontSize: 15.5,
    fontWeight: "600",
    color: "#1976D2",
    marginRight: 10,
  },
  dateText: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
    fontWeight: "400",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
    marginLeft: 2,
  },
});
