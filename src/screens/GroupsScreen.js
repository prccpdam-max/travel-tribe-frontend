import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from "react-native";

const initGroups = [
  { id: 1, name: "Bangkok Explorers", desc: "Exploring hidden gems in BKK", members: 234, category: "City", joined: false },
  { id: 2, name: "Bali Travel Gang", desc: "Everything Bali - tips, meetups, photos", members: 512, category: "Beach", joined: true },
  { id: 3, name: "Japan Trip 2026", desc: "Planning the ultimate Japan adventure", members: 89, category: "Asia", joined: false },
  { id: 4, name: "Solo Travelers Asia", desc: "Connect with solo travelers across Asia", members: 1204, category: "Solo", joined: false },
  { id: 5, name: "Food Travel Thailand", desc: "Best street food spots across Thailand", members: 678, category: "Food", joined: true },
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
    setGroups(gs => [...gs, { id: Date.now(), name: newName, desc: newDesc, members: 1, category: "New", joined: true }]);
    setNewName(""); setNewDesc(""); setShowCreate(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Groups</Text>
        <TouchableOpacity style={s.createBtn} onPress={() => setShowCreate(true)}>
          <Text style={s.createBtnText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <View style={s.searchBox}>
        <TextInput style={s.search} placeholder="Search groups..." placeholderTextColor="#888" value={search} onChangeText={setSearch} />
      </View>

      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, tab === "all" && s.activeTab]} onPress={() => setTab("all")}>
          <Text style={[s.tabText, tab === "all" && s.activeTabText]}>All Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab === "joined" && s.activeTab]} onPress={() => setTab("joined")}>
          <Text style={[s.tabText, tab === "joined" && s.activeTabText]}>My Groups</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.list}>
        {filtered.map(g => (
          <TouchableOpacity key={g.id} style={s.card} onPress={() => navigation.navigate("GroupChat", { group: g })}>
            <View style={s.cardLeft}>
              <View style={s.groupAvatar}><Text style={s.groupAvatarText}>{g.name[0]}</Text></View>
            </View>
            <View style={s.cardInfo}>
              <Text style={s.groupName}>{g.name}</Text>
              <Text style={s.groupDesc} numberOfLines={1}>{g.desc}</Text>
              <View style={s.metaRow}>
                <Text style={s.members}>{g.members} members</Text>
                <View style={[s.catBadge]}><Text style={s.catText}>{g.category}</Text></View>
              </View>
            </View>
            <TouchableOpacity style={[s.joinBtn, g.joined && s.joinedBtn]} onPress={() => toggleJoin(g.id)}>
              <Text style={[s.joinBtnText, g.joined && s.joinedBtnText]}>{g.joined ? "Joined" : "Join"}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showCreate} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Create Group</Text>
            <TextInput style={s.modalInput} placeholder="Group name" placeholderTextColor="#888" value={newName} onChangeText={setNewName} />
            <TextInput style={[s.modalInput, { height: 80 }]} placeholder="Description" placeholderTextColor="#888" value={newDesc} onChangeText={setNewDesc} multiline />
            <TouchableOpacity style={s.modalBtn} onPress={createGroup}>
              <Text style={s.modalBtnText}>Create Group</Text>
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
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  createBtn: { backgroundColor: "#7B9FFF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  createBtnText: { color: "#fff", fontWeight: "700" },
  searchBox: { paddingHorizontal: 16, marginBottom: 8 },
  search: { backgroundColor: "#1A1735", color: "#fff", padding: 12, borderRadius: 12 },
  tabs: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#1A1735" },
  activeTab: { backgroundColor: "#7B9FFF" },
  tabText: { color: "#A0A0B0", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  list: { paddingHorizontal: 16 },
  card: { flexDirection: "row", backgroundColor: "#1A1735", borderRadius: 14, marginBottom: 12, padding: 12, alignItems: "center" },
  cardLeft: { marginRight: 12 },
  groupAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#C084FC", justifyContent: "center", alignItems: "center" },
  groupAvatarText: { color: "#fff", fontSize: 22, fontWeight: "800" },
  cardInfo: { flex: 1 },
  groupName: { color: "#fff", fontWeight: "700", fontSize: 15, marginBottom: 2 },
  groupDesc: { color: "#A0A0B0", fontSize: 12, marginBottom: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  members: { color: "#A0A0B0", fontSize: 11 },
  catBadge: { backgroundColor: "#0D0B1E", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  catText: { color: "#7B9FFF", fontSize: 11 },
  joinBtn: { backgroundColor: "#7B9FFF", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  joinedBtn: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#7B9FFF" },
  joinBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  joinedBtnText: { color: "#7B9FFF" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#1A1735", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 16 },
  modalInput: { backgroundColor: "#0D0B1E", color: "#fff", padding: 14, borderRadius: 12, marginBottom: 12 },
  modalBtn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  modalBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancelText: { color: "#A0A0B0", textAlign: "center", padding: 8 },
});
