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
import PrimaryButton from "../../components/PrimaryButton";
import EmptyState from "../../components/EmptyState";
import { apiGet, apiPost } from "../../api/client";
import { theme } from "../../styles/theme";

const GroupsScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const loadGroups = useCallback(async () => {
    const data = await apiGet("/groups?limit=60");
    setGroups(data.groups || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadGroups()
        .catch((error) => console.log(error.message))
        .finally(() => setLoading(false));
    }, [loadGroups])
  );

  const createGroup = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setCreating(true);
      await apiPost("/groups", {
        name: name.trim(),
        description: description.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
      });

      setName("");
      setDescription("");
      setCity("");
      setCountry("");
      setShowCreate(false);
      await loadGroups();
    } catch (error) {
      console.log(error.message);
    } finally {
      setCreating(false);
    }
  };

  const joinGroup = async (id) => {
    try {
      await apiPost(`/groups/${id}/join`);
      await loadGroups();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScreenShell>
      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowCreate((v) => !v)}>
        <Text style={styles.toggleText}>{showCreate ? "Close creator" : "Create travel group"}</Text>
      </TouchableOpacity>

      {showCreate ? (
        <View style={styles.formCard}>
          <TextField label="Group name" value={name} onChangeText={setName} />
          <TextField
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="What is this group about?"
          />
          <View style={styles.row}>
            <View style={styles.half}>
              <TextField label="City" value={city} onChangeText={setCity} />
            </View>
            <View style={styles.half}>
              <TextField label="Country" value={country} onChangeText={setCountry} />
            </View>
          </View>
          <PrimaryButton title="Create group" loading={creating} onPress={createGroup} />
        </View>
      ) : null}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <EmptyState title="No groups yet" subtitle="Create the first group in your destination." />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupCard}
              onPress={() => navigation.navigate("GroupDetails", { groupId: item.id })}
            >
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupDesc}>{item.description || "Travel community"}</Text>
              <Text style={styles.groupMeta}>
                {[item.city, item.country].filter(Boolean).join(", ") || "Global"} • {item.member_count} members
              </Text>

              {item.joined_by_me ? (
                <Text style={styles.joinedText}>Joined</Text>
              ) : (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => joinGroup(item.id)}
                >
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    backgroundColor: "#123648",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2C6076",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  toggleText: {
    color: "#D9EEF8",
    fontWeight: "700",
  },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2E6078",
    backgroundColor: "rgba(20, 59, 76, 0.9)",
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  half: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  groupCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2E6078",
    backgroundColor: "rgba(20, 59, 76, 0.9)",
    padding: 12,
    marginBottom: 10,
  },
  groupName: {
    color: "#EFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  groupDesc: {
    color: "#BEDAE8",
    lineHeight: 20,
    marginBottom: 6,
  },
  groupMeta: {
    color: "#83AFBF",
    fontSize: 12,
  },
  joinButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  joinedText: {
    marginTop: 10,
    color: "#56CDAA",
    fontWeight: "700",
  },
});

export default GroupsScreen;
