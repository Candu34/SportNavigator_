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

// Utility to show relative time
function getRelativeTime(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const reviewDate = new Date(dateStr);

  const diffMs = now - reviewDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  if (diffDays < 365) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

const ReviewCard = ({ review }) => {
  const userInfo = review.userInfoDTO || {};
  const fullName =
    (userInfo.firstName || "") + " " + (userInfo.lastName || "");

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

  const dateStr = review.createdAt;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={avatarPlaceholder}
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.userName}>
              {fullName.trim() || "Unknown User"}
            </Text>
            {dateStr ? (
              <Text style={styles.dateText}>
                {getRelativeTime(dateStr)}
              </Text>
            ) : null}
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
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, courtId]);

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
    marginLeft: 2,
    fontWeight: "400",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
    marginLeft: 2,
  },
});
