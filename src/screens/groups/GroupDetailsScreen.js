import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenShell from "../../components/ScreenShell";
import TextField from "../../components/TextField";
import PrimaryButton from "../../components/PrimaryButton";
import { apiGet, apiPost } from "../../api/client";

const GroupDetailsScreen = ({ route, navigation }) => {
  const { groupId } = route.params;

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [postText, setPostText] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const loadGroup = useCallback(async () => {
    const [groupData, postData, eventData] = await Promise.all([
      apiGet(`/groups/${groupId}`),
      apiGet(`/groups/${groupId}/posts`),
      apiGet(`/groups/${groupId}/events`),
    ]);

    setGroup(groupData);
    setPosts(postData.posts || []);
    setEvents(eventData.events || []);
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadGroup()
        .catch((error) => console.log(error.message))
        .finally(() => setLoading(false));
    }, [loadGroup])
  );

  const sendPost = async () => {
    if (!postText.trim()) {
      return;
    }

    await apiPost(`/groups/${groupId}/posts`, { content: postText.trim() });
    setPostText("");
    await loadGroup();
  };

  const createEvent = async () => {
    if (!eventTitle.trim() || !eventDate.trim()) {
      return;
    }

    await apiPost(`/groups/${groupId}/events`, {
      title: eventTitle.trim(),
      eventAt: eventDate,
      locationName: eventLocation.trim() || null,
    });

    setEventTitle("");
    setEventDate("");
    setEventLocation("");
    await loadGroup();
  };

  if (loading) {
    return (
      <ScreenShell>
        <View style={styles.centered}>
          <ActivityIndicator color="#FF6B4A" />
        </View>
      </ScreenShell>
    );
  }

  if (!group?.group) {
    return (
      <ScreenShell>
        <Text style={styles.errorText}>Group not found.</Text>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.topCard}>
          <Text style={styles.groupTitle}>{group.group.name}</Text>
          <Text style={styles.groupDescription}>{group.group.description}</Text>
          <Text style={styles.meta}>
            {[group.group.city, group.group.country].filter(Boolean).join(", ") || "Global"} • {group.group.member_count} members
          </Text>

          {group.groupConversationId ? (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() =>
                navigation.getParent()?.navigate("Messages", {
                  screen: "Chat",
                  params: {
                    conversationId: group.groupConversationId,
                    title: group.group.name,
                  },
                })
              }
            >
              <Text style={styles.chatButtonText}>Open Group Chat</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>New group post</Text>
          <View style={styles.row}>
            <TextInput
              value={postText}
              onChangeText={setPostText}
              placeholder="Share updates with your group"
              placeholderTextColor="#7FA7B8"
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendPost}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Group posts</Text>
          {posts.length ? (
            posts.map((post) => (
              <View key={post.id} style={styles.itemCard}>
                <Text style={styles.itemAuthor}>{post.author?.displayName}</Text>
                <Text style={styles.itemContent}>{post.content || "Photo post"}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No posts yet.</Text>
          )}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Create meetup event</Text>
          <TextField label="Title" value={eventTitle} onChangeText={setEventTitle} />
          <TextField
            label="Date & time (ISO)"
            value={eventDate}
            onChangeText={setEventDate}
            placeholder="2026-06-10T18:30:00Z"
          />
          <TextField
            label="Location"
            value={eventLocation}
            onChangeText={setEventLocation}
            placeholder="Riverside cafe"
          />
          <PrimaryButton title="Create event" onPress={createEvent} />

          <Text style={styles.panelTitle}>Upcoming events</Text>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <Text style={styles.itemAuthor}>{item.title}</Text>
                <Text style={styles.itemContent}>{item.location_name || "TBA"}</Text>
                <Text style={styles.itemMeta}>{item.event_at}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No events yet.</Text>}
          />
        </View>
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#F6FAFC",
  },
  topCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2E6078",
    backgroundColor: "rgba(20, 59, 76, 0.9)",
    padding: 12,
    marginBottom: 10,
  },
  groupTitle: {
    color: "#EFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  groupDescription: {
    color: "#BDD9E8",
    lineHeight: 20,
    marginBottom: 8,
  },
  meta: {
    color: "#87B0C2",
    fontSize: 12,
  },
  chatButton: {
    marginTop: 10,
    backgroundColor: "#45C4A1",
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chatButtonText: {
    color: "#042222",
    fontWeight: "700",
  },
  panel: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2E6078",
    backgroundColor: "rgba(20, 59, 76, 0.9)",
    padding: 12,
    marginBottom: 10,
  },
  panelTitle: {
    color: "#E8F9FF",
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2A6078",
    backgroundColor: "#163D4F",
    borderRadius: 10,
    color: "#ECFAFF",
    paddingHorizontal: 12,
    height: 42,
  },
  sendButton: {
    width: 72,
    borderRadius: 10,
    backgroundColor: "#FF6B4A",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#2E6078",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#163C4D",
  },
  itemAuthor: {
    color: "#EAFBFF",
    fontWeight: "700",
    marginBottom: 4,
  },
  itemContent: {
    color: "#C4E1EF",
  },
  itemMeta: {
    marginTop: 4,
    color: "#7EA8BA",
    fontSize: 12,
  },
  emptyText: {
    color: "#8FB5C7",
    fontSize: 12,
  },
});

export default GroupDetailsScreen;
