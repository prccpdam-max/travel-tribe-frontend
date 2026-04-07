import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, Modal, ActivityIndicator, Platform } from "react-native";
import { auth } from "../services/firebase";

const DEMO_POSTS = [
  { id: "1", username: "Sarah K.", location: "Santorini, Greece", img: "https://picsum.photos/400/300?random=1", likes_count: 234, comments_count: 12, caption: "Golden hour never hits different ✨", liked: false, saved: false },
  { id: "2", username: "Mike T.", location: "Tokyo, Japan", img: "https://picsum.photos/400/300?random=2", likes_count: 189, comments_count: 8, caption: "Street food paradise 🍜", liked: false, saved: false },
  { id: "3", username: "Ana R.", location: "Bali, Indonesia", img: "https://picsum.photos/400/300?random=3", likes_count: 312, comments_count: 24, caption: "Found my happy place 🌴", liked: false, saved: false },
  { id: "4", username: "Tom W.", location: "Paris, France", img: "https://picsum.photos/400/300?random=4", likes_count: 421, comments_count: 31, caption: "City of lights never disappoints 🗼", liked: false, saved: false },
];

const STORIES = ["You", "Sarah", "Mike", "Ana", "Tom", "Lisa", "John"];
const STORY_IMGS = ["➕","🌅","🍜","🌴","🏔","🏖","🎭"];

export default function FeedScreen() {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [showCreate, setShowCreate] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({ "1": ["Amazing! 😍", "Goals!"], "2": ["Want to visit!"], "3": ["So beautiful! 🌿"], "4": ["Magnifique!"] });

  const handleLike = (id) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, liked: !post.liked, likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1 } : post));
  };

  const handleSave = (id) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, saved: !post.saved } : post));
  };

  const handleComment = (id) => {
    if (!comment.trim()) return;
    setComments(c => ({ ...c, [id]: [...(c[id] || []), comment] }));
    setPosts(p => p.map(post => post.id === id ? { ...post, comments_count: post.comments_count + 1 } : post));
    setComment("");
  };

  const handlePost = () => {
    if (!caption.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      username: auth.currentUser?.email?.split("@")[0] || "You",
      location: location || "Unknown location",
      img: imgUrl || `https://picsum.photos/400/300?random=${Math.floor(Math.random()*100)+10}`,
      likes_count: 0, comments_count: 0, caption, liked: false, saved: false,
    };
    setPosts(p => [newPost, ...p]);
    setCaption(""); setLocation(""); setImgUrl(""); setShowCreate(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.logo}>✈ Travel Tribe</Text>
        <TouchableOpacity style={s.postBtn} onPress={() => setShowCreate(true)}>
          <Text style={s.postBtnText}>+ Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.storiesRow}>
          {STORIES.map((name, i) => (
            <View key={i} style={s.storyWrap}>
              <View style={[s.storyRing, i === 0 && s.addStory]}>
                <Text style={s.storyEmoji}>{STORY_IMGS[i]}</Text>
              </View>
              <Text style={s.storyName}>{name}</Text>
            </View>
          ))}
        </ScrollView>

        {posts.map(p => (
          <View key={p.id} style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.avatar}><Text style={s.avatarText}>{p.username[0].toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.username}>{p.username}</Text>
                <Text style={s.location}>📍 {p.location}</Text>
              </View>
              <Text style={s.more}>•••</Text>
            </View>

            <Image source={{ uri: p.img }} style={s.postImg} />

            <View style={s.actions}>
              <TouchableOpacity style={s.actionItem} onPress={() => handleLike(p.id)}>
                <Text style={[s.actionIcon, p.liked && s.likedIcon]}>{p.liked ? "❤️" : "🤍"}</Text>
                <Text style={[s.actionCount, p.liked && s.likedCount]}>{p.likes_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionItem} onPress={() => setShowComments(p.id)}>
                <Text style={s.actionIcon}>💬</Text>
                <Text style={s.actionCount}>{p.comments_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionItem} onPress={() => handleSave(p.id)}>
                <Text style={[s.actionIcon, p.saved && s.savedIcon]}>{p.saved ? "🔖" : "🏷️"}</Text>
                <Text style={[s.actionCount, p.saved && s.savedCount]}>{p.saved ? "Saved" : "Save"}</Text>
              </TouchableOpacity>
            </View>

            <View style={s.captionWrap}>
              <Text style={s.captionUsername}>{p.username} </Text>
              <Text style={s.captionText}>{p.caption}</Text>
            </View>
            {(comments[p.id]?.length > 0) && (
              <TouchableOpacity onPress={() => setShowComments(p.id)}>
                <Text style={s.viewComments}>View all {comments[p.id].length} comments</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={showCreate} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Share Your Journey ✈</Text>
            <TextInput style={s.modalInput} placeholder="What are you exploring?" placeholderTextColor="#555" value={caption} onChangeText={setCaption} multiline />
            <TextInput style={s.modalInput} placeholder="📍 Location" placeholderTextColor="#555" value={location} onChangeText={setLocation} />
            <TextInput style={s.modalInput} placeholder="🖼 Image URL (optional)" placeholderTextColor="#555" value={imgUrl} onChangeText={setImgUrl} />
            {imgUrl ? <Image source={{ uri: imgUrl }} style={s.preview} /> : null}
            <TouchableOpacity style={s.shareBtn} onPress={handlePost}>
              <Text style={s.shareBtnText}>Share Post 🚀</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCreate(false)}>
              <Text style={s.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={!!showComments} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Comments</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              {(comments[showComments] || []).length === 0 ? (
                <Text style={s.noComments}>No comments yet. Be first!</Text>
              ) : (
                (comments[showComments] || []).map((c, i) => (
                  <View key={i} style={s.commentRow}>
                    <View style={s.commentAvatar}><Text style={s.commentAvatarText}>U</Text></View>
                    <Text style={s.commentText}>{c}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <View style={s.commentInput}>
              <TextInput style={s.commentBox} placeholder="Add a comment..." placeholderTextColor="#555" value={comment} onChangeText={setComment} onSubmitEditing={() => handleComment(showComments)} />
              <TouchableOpacity style={s.sendBtn} onPress={() => handleComment(showComments)}>
                <Text style={s.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { setShowComments(null); setComment(""); }}>
              <Text style={s.cancel}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12 },
  logo: { color: "#7B9FFF", fontSize: 20, fontWeight: "900" },
  postBtn: { background: "linear-gradient(135deg, #7B9FFF, #C084FC)", backgroundColor: "#7B9FFF", paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  postBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  storiesRow: { paddingLeft: 16, paddingVertical: 12, marginBottom: 4 },
  storyWrap: { alignItems: "center", marginRight: 16 },
  storyRing: { width: 64, height: 64, borderRadius: 32, borderWidth: 2.5, borderColor: "#C084FC", justifyContent: "center", alignItems: "center", backgroundColor: "#1A1735", marginBottom: 4 },
  addStory: { borderColor: "#7B9FFF", borderStyle: "dashed" },
  storyEmoji: { fontSize: 26 },
  storyName: { color: "#A0A0B0", fontSize: 11 },
  card: { backgroundColor: "#1A1735", marginHorizontal: 16, marginBottom: 20, borderRadius: 20, overflow: "hidden", shadowColor: "#7B9FFF", shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  username: { color: "#fff", fontWeight: "700", fontSize: 14 },
  location: { color: "#A0A0B0", fontSize: 12, marginTop: 1 },
  more: { color: "#A0A0B0", fontSize: 18 },
  postImg: { width: "100%", height: 260 },
  actions: { flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10, gap: 20 },
  actionItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionIcon: { fontSize: 22 },
  likedIcon: { transform: [{ scale: 1.1 }] },
  savedIcon: {},
  actionCount: { color: "#A0A0B0", fontSize: 13, fontWeight: "600" },
  likedCount: { color: "#FF6B8A" },
  savedCount: { color: "#7B9FFF" },
  captionWrap: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 14, paddingBottom: 4 },
  captionUsername: { color: "#fff", fontWeight: "700", fontSize: 13 },
  captionText: { color: "#C0C0D0", fontSize: 13, lineHeight: 20 },
  viewComments: { color: "#A0A0B0", fontSize: 12, paddingHorizontal: 14, paddingBottom: 12 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#13112A", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, backgroundColor: "#2A2450", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 16 },
  modalInput: { backgroundColor: "#1A1735", color: "#fff", padding: 14, borderRadius: 14, marginBottom: 10, fontSize: 14, borderWidth: 1, borderColor: "#2A2450" },
  preview: { width: "100%", height: 160, borderRadius: 14, marginBottom: 12 },
  shareBtn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 10 },
  shareBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancel: { color: "#A0A0B0", textAlign: "center", padding: 8, fontSize: 14 },
  noComments: { color: "#A0A0B0", textAlign: "center", padding: 20 },
  commentRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  commentAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  commentAvatarText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  commentText: { color: "#fff", fontSize: 13, flex: 1 },
  commentInput: { flexDirection: "row", gap: 8, marginBottom: 8 },
  commentBox: { flex: 1, backgroundColor: "#1A1735", color: "#fff", padding: 12, borderRadius: 14, fontSize: 13, borderWidth: 1, borderColor: "#2A2450" },
  sendBtn: { backgroundColor: "#7B9FFF", paddingHorizontal: 18, borderRadius: 14, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "800" },
});