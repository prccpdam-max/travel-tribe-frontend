import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenShell from "../components/ScreenShell";
import EmptyState from "../components/EmptyState";
import { apiGet } from "../../api/client";
import { theme } from "../styles/theme";

const categories = [
  "all",
  "restaurant",
  "cafe",
  "bar",
  "hotel",
  "attraction",
  "hidden_gem",
];

const ReviewsScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    const query = selectedCategory === "all" ? "" : `?category=${selectedCategory}`;
    const data = await apiGet(`/reviews${query}`);
    setReviews(data.reviews || []);
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadReviews()
        .catch((error) => console.log(error.message))
        .finally(() => setLoading(false));
    }, [loadReviews])
  );

  return (
    <ScreenShell>
      <View style={styles.topRow}>
        <Text style={styles.title}>Real traveler reviews</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate("CreateReview")}
        >
          <Text style={styles.newButtonText}>Write</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryRow}>
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                {category.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No reviews yet"
              subtitle="Be the first to review this category."
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.ratingRow}>
                <Text style={styles.placeName}>{item.place?.name}</Text>
                <Text style={styles.rating}>{"?".repeat(Number(item.rating || 0))}</Text>
              </View>
              <Text style={styles.category}>{item.place?.category}</Text>
              <Text style={styles.reviewTitle}>{item.title}</Text>
              <Text style={styles.reviewDesc}>{item.description}</Text>
              {item.tips ? <Text style={styles.tip}>Tip: {item.tips}</Text> : null}
              <Text style={styles.meta}>
                {item.author?.displayName} • {[item.place?.city, item.place?.country].filter(Boolean).join(", ")}
              </Text>
            </View>
          )}
        />
      )}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: theme.colors.textOnDark,
    fontSize: 20,
    fontWeight: "800",
  },
  newButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#2E6078",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#14384A",
  },
  categoryChipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  categoryText: {
    color: "#D4EDF8",
    fontSize: 12,
    textTransform: "capitalize",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2E6078",
    backgroundColor: "rgba(20, 59, 76, 0.9)",
    padding: 12,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  placeName: {
    color: "#F0FBFF",
    fontWeight: "800",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  rating: {
    color: "#F9C65E",
    fontWeight: "700",
  },
  category: {
    color: "#68D2B3",
    textTransform: "capitalize",
    fontSize: 12,
    marginBottom: 6,
  },
  reviewTitle: {
    color: "#E8FAFF",
    fontWeight: "700",
    marginBottom: 4,
  },
  reviewDesc: {
    color: "#CBE4F0",
    lineHeight: 19,
  },
  tip: {
    color: "#FFD5AB",
    marginTop: 8,
  },
  meta: {
    marginTop: 8,
    color: "#8DB5C8",
    fontSize: 12,
  },
});

export default ReviewsScreen;

