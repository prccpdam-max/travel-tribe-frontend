import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, TextInput, Modal } from "react-native";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

const photos = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/150/150?random=${i + 10}`);

export default function ProfileScreen() {
  const [tab, setTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("Sarah Kim");
  const [bio, setBio] = useState("42 countries visited - World explorer");
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut(auth) }
    ]);
  };

  const saveProfile = () => {
    setName(tempName);
    setBio(tempBio);
    setShowEdit(false);
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.profileSection}>
        <View style={s.topRow}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={s.avatar}><Text style={s.avatarText}>{name[0]}</Text></View>
        <Text style={s.name}>{name}</Text>
        <Text style={s.bio}>{bio}</Text>
        <View style={s.stats}>
          {[["Posts","48"],["Followers","2.4k"],["Countries","42"]].map(([l,v]) => (
            <View key={l} style={s.stat}>
              <Text style={s.statVal}>{v}</Text>
              <Text style={s.statLabel}>{l}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={s.editBtn} onPress={() => { setTempName(name); setTempBio(bio); setShowEdit(true); }}>
          <Text style={s.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={s.tabs}>
        {[["posts","Posts"],["saved","Saved"],["visited","Visited"]].map(([t,l]) => (
          <TouchableOpacity key={t} style={[s.tab, tab===t && s.activeTab]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab===t && s.activeTabText]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.grid}>
        {photos.map((uri, i) => (
          <Image key={i} source={{ uri }} style={s.gridImg} />
        ))}
      </View>

      <Modal visible={showEdit} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Edit Profile</Text>
            <Text style={s.label}>Name</Text>
            <TextInput style={s.input} value={tempName} onChangeText={setTempName} placeholderTextColor="#888" />
            <Text style={s.label}>Bio</Text>
            <TextInput style={[s.input, { height: 80 }]} value={tempBio} onChangeText={setTempBio} multiline placeholderTextColor="#888" />
            <TouchableOpacity style={s.saveBtn} onPress={saveProfile}>
              <Text style={s.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEdit(false)}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  profileSection: { padding: 24, alignItems: "center", paddingTop: 50 },
  topRow: { width: "100%", alignItems: "flex-end", marginBottom: 8 },
  logoutBtn: { backgroundColor: "#1A1735", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#F87171" },
  logoutText: { color: "#F87171", fontWeight: "700", fontSize: 13 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "800" },
  name: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 4 },
  bio: { color: "#A0A0B0", textAlign: "center", marginBottom: 16 },
  stats: { flexDirection: "row", gap: 32, marginBottom: 16 },
  stat: { alignItems: "center" },
  statVal: { color: "#7B9FFF", fontSize: 18, fontWeight: "800" },
  statLabel: { color: "#A0A0B0", fontSize: 12 },
  editBtn: { backgroundColor: "#1A1735", padding: 12, borderRadius: 10, paddingHorizontal: 32, borderWidth: 1, borderColor: "#7B9FFF" },
  editBtnText: { color: "#7B9FFF", fontWeight: "700" },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#1A1735" },
  tab: { flex: 1, padding: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderColor: "#7B9FFF" },
  tabText: { color: "#A0A0B0" },
  activeTabText: { color: "#7B9FFF", fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridImg: { width: "33.33%", height: 120 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#1A1735", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 16 },
  label: { color: "#A0A0B0", fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: "#0D0B1E", color: "#fff", padding: 14, borderRadius: 12, marginBottom: 12 },
  saveBtn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  saveBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancelText: { color: "#A0A0B0", textAlign: "center", padding: 8 },
});