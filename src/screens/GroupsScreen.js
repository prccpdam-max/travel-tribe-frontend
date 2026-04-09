import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Image } from "react-native";

const initGroups = [
  { id: 1, name: "Bangkok Explorers", desc: "Exploring hidden gems in BKK", members: 234, category: "City", joined: false, emoji: "🏙" },
  { id: 2, name: "Bali Travel Gang", desc: "Everything Bali - tips, meetups, photos", members: 512, category: "Beach", joined: true, emoji: "🌴" },
  { id: 3, name: "Japan Trip 2026", desc: "Planning the ultimate Japan adventure", members: 89, category: "Asia", joined: false, emoji: "🗾" },
  { id: 4, name: "Solo Travelers Asia", desc: "Connect with solo travelers across Asia", members: 1204, category: "Solo", joined: false, emoji: "🎒" },
  { id: 5, name: "Food Travel Thailand", desc: "Best street food spots across Thailand", members: 678, category: "Food", joined: true, emoji: "🍜" },
];

export default function GroupsScreen({ navigation }) {
  const [groups, setGroups] = useState(initGroups);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = groups.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || (tab === "joined" && g.joined);
    return matchSearch && matchTab;
  });

  const toggleJoin = (id) => {
    setGroups(gs => gs.map(g => g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g));
  };

  const createGroup = () => {
    if (!newName.trim()) return;
    setGroups(gs => [...gs, { id: Date.now(), name: newName, desc: newDesc, members: 1, category: "New", joined: true, emoji: "✈" }]);
    setNewName(""); setNewDesc(""); setShowCreate(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Communities</Text>
        <TouchableOpacity style={s.createBtn} onPress={() => setShowCreate(true)}>
          <Text style={s.createBtnText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <View style={s.searchBox}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput style={s.search} placeholder="Search communities..." placeholderTextColor="#555" value={search} onChangeText={setSearch} />
      </View>

      <View style={s.tabs}>
        {[["all","All Groups"],["joined","My Groups"]].map(([t,l]) => (
          <TouchableOpacity key={t} style={[s.tab, tab===t && s.activeTab]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab===t && s.activeTabText]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {filtered.map(g => (
          <TouchableOpacity key={g.id} style={s.card} onPress={() => navigation.navigate("GroupChat", { group: g })}>
            <View style={s.groupIcon}><Text style={s.groupEmoji}>{g.emoji}</Text></View>
            <View style={s.cardInfo}>
              <View style={s.cardTop}>
                <Text style={s.groupName}>{g.name}</Text>
                <View style={s.catBadge}><Text style={s.catText}>{g.category}</Text></View>
              </View>
              <Text style={s.groupDesc} numberOfLines={1}>{g.desc}</Text>
              <Text style={s.members}>👥 {g.members.toLocaleString()} members</Text>
            </View>
            <TouchableOpacity style={[s.joinBtn, g.joined && s.joinedBtn]} onPress={() => toggleJoin(g.id)}>
              <Text style={[s.joinBtnText, g.joined && s.joinedBtnText]}>{g.joined ? "✓ Joined" : "Join"}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showCreate} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Create Community</Text>
            <TextInput style={s.modalInput} placeholder="Community name" placeholderTextColor="#555" value={newName} onChangeText={setNewName} />
            <TextInput style={[s.modalInput, { height: 80 }]} placeholder="Description" placeholderTextColor="#555" value={newDesc} onChangeText={setNewDesc} multiline />
            <TouchableOpacity style={s.modalBtn} onPress={createGroup}>
              <Text style={s.modalBtnText}>Create Community 🚀</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCreate(false)}>
              <Text style={s.cancel}>Cancel</Text>
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
  title: { color: "#fff", fontSize: 24, fontWeight: "900" },
  createBtn: { backgroundColor: "#7B9FFF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  createBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#1A1735", marginHorizontal: 16, borderRadius: 14, paddingHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: "#2A2450" },
  searchIcon: { fontSize: 16, marginRight: 8 },
  search: { flex: 1, color: "#fff", padding: 12, fontSize: 14 },
  tabs: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: "#1A1735", borderWidth: 1, borderColor: "#2A2450" },
  activeTab: { backgroundColor: "#7B9FFF", borderColor: "#7B9FFF" },
  tabText: { color: "#A0A0B0", fontWeight: "600", fontSize: 13 },
  activeTabText: { color: "#fff" },
  list: { paddingHorizontal: 16 },
  card: { flexDirection: "row", backgroundColor: "#1A1735", borderRadius: 16, marginBottom: 12, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#2A2450" },
  groupIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: "#0D0B1E", justifyContent: "center", alignItems: "center", marginRight: 12 },
  groupEmoji: { fontSize: 26 },
  cardInfo: { flex: 1 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  groupName: { color: "#fff", fontWeight: "700", fontSize: 14, flex: 1 },
  groupDesc: { color: "#A0A0B0", fontSize: 12, marginBottom: 4 },
  members: { color: "#7B9FFF", fontSize: 11, fontWeight: "600" },
  catBadge: { backgroundColor: "#0D0B1E", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  catText: { color: "#C084FC", fontSize: 10, fontWeight: "700" },
  joinBtn: { backgroundColor: "#7B9FFF", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginLeft: 8 },
  joinedBtn: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#7B9FFF" },
  joinBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  joinedBtnText: { color: "#7B9FFF" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#13112A", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, backgroundColor: "#2A2450", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 16 },
  modalInput: { backgroundColor: "#1A1735", color: "#fff", padding: 14, borderRadius: 14, marginBottom: 12, fontSize: 14, borderWidth: 1, borderColor: "#2A2450" },
  modalBtn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 10 },
  modalBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancel: { color: "#A0A0B0", textAlign: "center", padding: 8 },
});