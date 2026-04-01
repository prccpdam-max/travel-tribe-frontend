import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
const posts = [
  { id: 1, user: "Sarah K.", location: "Santorini, Greece", img: "https://picsum.photos/400/300?random=1", likes: 234, caption: "Golden hour never hits different" },
  { id: 2, user: "Mike T.", location: "Tokyo, Japan", img: "https://picsum.photos/400/300?random=2", likes: 189, caption: "Street food paradise" },
  { id: 3, user: "Ana R.", location: "Bali, Indonesia", img: "https://picsum.photos/400/300?random=3", likes: 312, caption: "Found my happy place" },
];
export default function FeedScreen() {
  const [liked, setLiked] = useState({});
  return (
    <View style={s.container}>
      <View style={s.header}><Text style={s.logo}>Travel Tribe</Text></View>
      <ScrollView>
        {posts.map(p => (
          <View key={p.id} style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.avatar}><Text style={s.avatarText}>{p.user[0]}</Text></View>
              <View><Text style={s.username}>{p.user}</Text><Text style={s.location}>{p.location}</Text></View>
            </View>
            <Image source={{ uri: p.img }} style={s.postImg} />
            <View style={s.actions}>
              <TouchableOpacity onPress={() => setLiked(l => ({ ...l, [p.id]: !l[p.id] }))}>
                <Text style={s.actionBtn}>{liked[p.id] ? "Like" : "Like"} {p.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity><Text style={s.actionBtn}>Comment</Text></TouchableOpacity>
            </View>
            <Text style={s.caption}>{p.caption}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { padding: 16, paddingTop: 50 },
  logo: { color: "#7B9FFF", fontSize: 22, fontWeight: "800" },
  card: { backgroundColor: "#1A1735", marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 12, gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "700" },
  username: { color: "#fff", fontWeight: "700" },
  location: { color: "#A0A0B0", fontSize: 12 },
  postImg: { width: "100%", height: 220 },
  actions: { flexDirection: "row", gap: 16, padding: 12 },
  actionBtn: { color: "#7B9FFF", fontSize: 14 },
  caption: { color: "#A0A0B0", paddingHorizontal: 12, paddingBottom: 12, fontSize: 13 },
});
