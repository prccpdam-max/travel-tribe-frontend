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

import ScreenShell from "../../components/ScreenShell";
import TextField from "../../components/TextField";
import EmptyState from "../../components/EmptyState";
import { apiGet, apiPost } from "../../api/client";

const BuddyFinderScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [city, setCity] = useState("");
  const [activity, setActivity] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    const params = new URLSearchParams();
    if (city.trim()) {
      params.append("city", city.trim());
    }
    if (activity.trim()) {
      params.append("activity", activity.trim());
    }
    if (language.trim()) {
      params.append("language", language.trim());
    }

    const suffix = params.toString() ? `?${params.toString()}` : "";
    const data = await apiGet(`/buddies/posts${suffix}`);
    setPosts(data.posts || []);
  }, [city, activity, language]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadPosts()
        .catch((error) => console.log(error.message))
        .finally(() => setLoading(false));
    }, [loadPosts])
  );

  const applyToPost = async (postId) => {
    try {
      await apiPost(`/buddies/posts/${postId}/apply`, {
        message: "Hi! I would love to join this trip.",
      });
      await loadPosts();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScreenShell>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate("CreateBuddyPost")}
        >
          <Text style={styles.newButtonText}>New Buddy Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterCard}>
        <TextField label="City" value={city} onChangeText={setCity} placeholder="Tokyo" />
        <TextField
          label="Activity"
          value={activity}
          onChangeText={setActivity}
          placeholder="cafe, hiking, nightlife"
        />
        <TextField
          label="Language"
          value={language}
          onChangeText={setLanguage}
          placeholder="English"
        />
        <TouchableOpacity style={styles.filterButton} onPress={loadPosts}>
          <Text style={styles.filterButtonText}>Apply filters</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#FF6B4A" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <EmptyState
              title="No buddy posts yet"
              subtitle="Create one to find travel partners in your city."
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.author?.displayName}</Text>
              <Text style={styles.meta}>
                {item.city}, {item.country || "-"} • {item.start_date} to {item.end_date}
              </Text>
              <Text style={styles.message}>{item.message}</Text>

              <View style={styles.tagRow}>
                {(item.activity_types || []).map((tag) => (
                  <Text key={tag} style={styles.tag}>{tag}</Text>
                ))}
              </View>

              <Text style={styles.langText}>Languages: {(item.languages || []).join(", ") || "Any"}</Text>

              <TouchableOpacity
                style={[styles.applyButton, item.applied_by_me && styles.appliedButton]}
                onPress={() => applyToPost(item.id)}
                disabled={item.applied_by_me}
              >
                <Text style={styles.applyText}>{item.applied_by_me ? "Applied" : "Apply"}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  topActions: {
    marginBottom: 8,
  },
  newButton: {
    backgroundColor: "#45C4A1",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 10,
  },
  newButtonText: {
    color: "#05231E",
    fontWeight: "700",
  },
  filterCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2E6078",
    backgroundColor: "rgba(20, 59, 76, 0.9)",
    padding: 12,
    marginBottom: 12,
  },
  filterButton: {
    height: 42,
    borderRadius: 10,
    backgroundColor: "#FF6B4A",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2E6078",
    backgroundColor: "rgba(20, 59, 76, 0.9)",
    padding: 12,
    marginBottom: 10,
  },
  title: {
    color: "#F0FBFF",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {
    color: "#8BB3C5",
    fontSize: 12,
    marginBottom: 6,
  },
  message: {
    color: "#CDE5F1",
    lineHeight: 20,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  tag: {
    color: "#65D8B6",
    borderWidth: 1,
    borderColor: "#2E6078",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
  },
  langText: {
    color: "#9BC0CF",
    marginBottom: 8,
    fontSize: 12,
  },
  applyButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B4A",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  appliedButton: {
    backgroundColor: "#52747F",
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default BuddyFinderScreen;
