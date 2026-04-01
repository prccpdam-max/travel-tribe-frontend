import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
const places = [
  { id: 1, name: "Santorini Sunset Point", type: "Viewpoint", rating: 4.9, img: "https://picsum.photos/300/200?random=20" },
  { id: 2, name: "Tokyo Ramen Street", type: "Food", rating: 4.8, img: "https://picsum.photos/300/200?random=21" },
  { id: 3, name: "Bali Hidden Waterfall", type: "Hidden Gem", rating: 4.7, img: "https://picsum.photos/300/200?random=22" },
];
export default function MapScreen() {
  return (
    <View style={s.container}>
      <View style={s.header}><Text style={s.title}>Explore</Text></View>
      <View style={s.mapBox}><Text style={s.mapText}>Map View - Bangkok, Thailand</Text></View>
      <ScrollView style={s.list}>
        {places.map(p => (
          <View key={p.id} style={s.card}>
            <Image source={{ uri: p.img }} style={s.img} />
            <View style={s.info}>
              <Text style={s.placeName}>{p.name}</Text>
              <Text style={s.placeType}>{p.type}</Text>
              <Text style={s.rating}>Rating: {p.rating}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { padding: 16, paddingTop: 50 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  mapBox: { height: 160, backgroundColor: "#1A1735", margin: 16, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  mapText: { color: "#7B9FFF", fontWeight: "700" },
  list: { paddingHorizontal: 16 },
  card: { flexDirection: "row", backgroundColor: "#1A1735", borderRadius: 12, marginBottom: 12, overflow: "hidden" },
  img: { width: 90, height: 90 },
  info: { flex: 1, padding: 10 },
  placeName: { color: "#fff", fontWeight: "700", marginBottom: 2 },
  placeType: { color: "#A0A0B0", fontSize: 12, marginBottom: 4 },
  rating: { color: "#7B9FFF", fontSize: 13 },
});
