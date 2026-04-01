import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import ScreenShell from "../../components/ScreenShell";
import EmptyState from "../../components/EmptyState";
import { apiGet, apiPost } from "../../api/client";
import { theme } from "../../styles/theme";

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentMap, setCommentMap] = useState({});

  const loadFeed = useCallback(async () => {
    const data = await apiGet("/posts/feed?limit=40");
    setPosts(data.posts || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFeed()
        .catch((error) => console.log(error.message))
        .finally(() => setLoading(false));
    }, [loadFeed])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadFeed();
    } finally {
      setRefreshing(false);
    }
  }, [loadFeed]);

  const runAction = async (fn) => {
    try {
      await fn();
      await loadFeed();
    } catch (error) {
      console.log(error.message);
    }
  };

  const submitComment = async (postId) => {
    const content = (commentMap[postId] || "").trim();
    if (!content) {
      return;
    }

    await runAction(() => apiPost(`/posts/${postId}/comments`, { content }));
    setCommentMap((prev) => ({ ...prev, [postId]: "" }));
  };

  const headerActions = useMemo(
    () => (
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Ionicons name="add-circle" size={16} color={theme.colors.textOnDark} />
          <Text style={styles.headerButtonText}>Post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Reviews")}
        >
          <Ionicons name="star" size={16} color={theme.colors.textOnDark} />
          <Text style={styles.headerButtonText}>Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Ionicons name="notifications" size={16} color={theme.colors.textOnDark} />
          <Text style={styles.headerButtonText}>Alerts</Text>
        </TouchableOpacity>
      </View>
    ),
    [navigation]
  );

  const renderPost = ({ item }) => {
    const firstPhoto = item.photos?.[0]?.imageUrl;
    const tags = Array.isArray(item.travel_tags) ? item.travel_tags : [];

    return (
      <View style={styles.card}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.author?.displayName?.[0] || "T"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName}>{item.author?.displayName || "Traveler"}</Text>
            <Text style={styles.metaText}>
              {[item.city, item.country].filter(Boolean).join(", ") || item.location_name || "Unknown"}
            </Text>
          </View>
        </View>

        {firstPhoto ? <Image source={{ uri: firstPhoto }} style={styles.image} /> : null}

        <Text style={styles.caption}>{item.caption}</Text>

        {tags.length ? (
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <Text key={tag} style={styles.tagPill}>#{tag}</Text>
            ))}
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => runAction(() => apiPost(`/posts/${item.id}/like`))}
          >
            <Ionicons
              name={item.liked_by_me ? "heart" : "heart-outline"}
              color={item.liked_by_me ? "#FF6B4A" : "#D5EEF9"}
              size={18}
            />
            <Text style={styles.actionText}>{item.like_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => runAction(() => apiPost(`/posts/${item.id}/save`))}
          >
            <Ionicons
              name={item.saved_by_me ? "bookmark" : "bookmark-outline"}
              color="#D5EEF9"
              size={18}
            />
            <Text style={styles.actionText}>{item.save_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => runAction(() => apiPost(`/posts/${item.id}/share`))}
          >
            <Ionicons name="paper-plane-outline" color="#D5EEF9" size={18} />
            <Text style={styles.actionText}>{item.share_count}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentRow}>
          <TextInput
            value={commentMap[item.id] || ""}
            onChangeText={(value) =>
              setCommentMap((prev) => ({
                ...prev,
                [item.id]: value,
              }))
            }
            placeholder="Write a comment"
            placeholderTextColor="#7FA7B8"
            style={styles.commentInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => submitComment(item.id)}>
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenShell>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          ListHeaderComponent={headerActions}
          ListEmptyComponent={
            <EmptyState
              title="No travel stories yet"
              subtitle="Create the first post and start your global feed."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.accent}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  headerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#2A6279",
    borderRadius: 14,
    paddingVertical: 10,
    backgroundColor: "#133646",
  },
  headerButtonText: {
    color: theme.colors.textOnDark,
    fontWeight: "700",
    fontSize: 12,
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#2A596F",
    backgroundColor: "rgba(18, 56, 72, 0.95)",
    padding: 12,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FF6B4A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  authorName: {
    color: "#F0FBFF",
    fontWeight: "700",
    fontSize: 14,
  },
  metaText: {
    color: "#8FB8CB",
    fontSize: 12,
  },
  image: {
    width: "100%",
    height: 210,
    borderRadius: 14,
    marginBottom: 10,
  },
  caption: {
    color: "#E5F6FD",
    lineHeight: 20,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  tagPill: {
    color: "#58D7B5",
    backgroundColor: "#1A4053",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#D5EEF9",
    fontWeight: "600",
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderColor: "#2A6078",
    borderWidth: 1,
    color: "#F0FBFF",
    paddingHorizontal: 12,
    backgroundColor: "#153B4D",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FeedScreen;
