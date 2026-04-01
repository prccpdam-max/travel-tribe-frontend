import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";

const conversations = [
  { id: 1, name: "Sarah Kim", last: "See you in Bali!", time: "2m", unread: 2 },
  { id: 2, name: "Mike T.", last: "Great photo!", time: "1h", unread: 0 },
  { id: 3, name: "Ana R.", last: "Which hotel?", time: "3h", unread: 1 },
  { id: 4, name: "Travel Tribe BKK", last: "Anyone free this weekend?", time: "5h", unread: 5 },
];

export default function MessagesScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const filtered = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={s.container}>
      <View style={s.header}><Text style={s.title}>Messages</Text></View>
      <View style={s.searchBox}>
        <TextInput style={s.search} placeholder="Search..." placeholderTextColor="#888" value={search} onChangeText={setSearch} />
      </View>
      <ScrollView>
        {filtered.map(c => (
          <TouchableOpacity key={c.id} style={s.row} onPress={() => navigation && navigation.navigate("Chat", { conv: c })}>
            <View style={s.avatar}><Text style={s.avatarText}>{c.name[0]}</Text></View>
            <View style={s.info}>
              <View style={s.topRow}>
                <Text style={s.name}>{c.name}</Text>
                <Text style={s.time}>{c.time}</Text>
              </View>
              <View style={s.bottomRow}>
                <Text style={s.last} numberOfLines={1}>{c.last}</Text>
                {c.unread > 0 && <View style={s.badge}><Text style={s.badgeText}>{c.unread}</Text></View>}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { padding: 16, paddingTop: 50 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  searchBox: { paddingHorizontal: 16, marginBottom: 8 },
  search: { backgroundColor: "#1A1735", color: "#fff", padding: 12, borderRadius: 12 },
  row: { flexDirection: "row", padding: 16, borderBottomWidth: 1, borderColor: "#1A1735", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  info: { flex: 1 },
  topRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  name: { color: "#fff", fontWeight: "700", fontSize: 15 },
  time: { color: "#A0A0B0", fontSize: 12 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  last: { color: "#A0A0B0", fontSize: 13, flex: 1 },
  badge: { backgroundColor: "#7B9FFF", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
