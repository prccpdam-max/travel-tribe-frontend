import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, Modal, ActivityIndicator } from "react-native";
import { auth } from "../services/firebase";

const API = process.env.EXPO_PUBLIC_API_URL || "https://travel-tribe-backend-production.up.railway.app/api";

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [caption, setCaption] = useState("");
  const [location

$base = "C:\Users\HP\Downloads\travel-tribe\travel-tribe\frontend\src\screens"

Set-Content "$base\FeedScreen.js" @'
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, Modal, ActivityIndicator } from "react-native";
import { auth } from "../services/firebase";

const API = process.env.EXPO_PUBLIC_API_URL || "https://travel-tribe-backend-production.up.railway.app/api";

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [posting, setPosting] = useState(false);

  const getToken = async () => {
    try { return await auth.currentUser?.getIdToken(); } catch { return null; }
  };

  const fetchPosts = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/posts`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch (e) {
      console.log("fetch error", e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleLike = async (postId) => {
    setLiked(l => ({ ...l, [postId]: !l[postId] }));
    try {
      const token = await getToken();
      await fetch(`${API}/posts/${postId}/like`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {}
  };

  const handlePost = async () => {
    if (!caption.trim()) return;
    setPosting(true);
    try {
      const token = await getToken();
      await fetch(`${API}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ caption, location })
      });
      setCaption(""); setLocation(""); setShowCreate(false);
      fetchPosts();
    } catch (e) {}
    setPosting(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.logo}>Travel Tribe</Text>
        <TouchableOpacity style={s.postBtn} onPress={() => setShowCreate(true)}>
          <Text style={s.postBtnText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={s.center}><ActivityIndicator color="#7B9FFF" size="large" /></View>
      ) : posts.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyText}>No posts yet</Text>
          <Text style={s.emptySubText}>Be the first to share your travel story!</Text>
          <TouchableOpacity style={s.postBtn} onPress={() => setShowCreate(true)}>
            <Text style={s.postBtnText}>Create First Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {posts.map(p => (
            <View key={p.id} style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.avatar}><Text style={s.avatarText}>{(p.username || "U")[0].toUpperCase()}</Text></View>
                <View>
                  <Text style={s.username}>{p.username || "Traveler"}</Text>
                  <Text style={s.location}>{p.location || "Unknown location"}</Text>
                </View>
              </View>
              {p.photo_url && <Image source={{ uri: p.photo_url }} style={s.postImg} />}
              <View style={s.actions}>
                <TouchableOpacity onPress={() => handleLike(p.id)}>
                  <Text style={s.actionBtn}>{liked[p.id] ? "??" : "??"} {(p.likes_count || 0) + (liked[p.id] ? 1 : 0)}</Text>
                </TouchableOpacity>
                <TouchableOpacity><Text style={s.actionBtn}>?? {p.comments_count || 0}</Text></TouchableOpacity>
                <TouchableOpacity><Text style={s.actionBtn}>?? Save</Text></TouchableOpacity>
              </View>
              <Text style={s.caption}>{p.caption}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={showCreate} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Share Your Journey</Text>
            <TextInput style={s.modalInput} placeholder="What is on your mind?" placeholderTextColor="#888" value={caption} onChangeText={setCaption} multiline />
            <TextInput style={s.modalInput} placeholder="Location (optional)" placeholderTextColor="#888" value={location} onChangeText={setLocation} />
            <TouchableOpacity style={s.modalBtn} onPress={handlePost} disabled={posting}>
              {posting ? <ActivityIndicator color="#fff" /> : <Text style={s.modalBtnText}>Share Post</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCreate(false)}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingTop: 50 },
  logo: { color: "#7B9FFF", fontSize: 22, fontWeight: "800" },
  postBtn: { backgroundColor: "#7B9FFF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  postBtnText: { color: "#fff", fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  emptySubText: { color: "#A0A0B0", fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
  card: { backgroundColor: "#1A1735", marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 12, gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "700" },
  username: { color: "#fff", fontWeight: "700" },
  location: { color: "#A0A0B0", fontSize: 12 },
  postImg: { width: "100%", height: 220 },
  actions: { flexDirection: "row", gap: 16, padding: 12 },
  actionBtn: { color: "#A0A0B0", fontSize: 14 },
  caption: { color: "#A0A0B0", paddingHorizontal: 12, paddingBottom: 12, fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#1A1735", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 16 },
  modalInput: { backgroundColor: "#0D0B1E", color: "#fff", padding: 14, borderRadius: 12, marginBottom: 12 },
  modalBtn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  modalBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancelText: { color: "#A0A0B0", textAlign: "center", padding: 8 },
});
