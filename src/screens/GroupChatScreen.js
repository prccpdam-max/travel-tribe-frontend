import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Image, Modal } from "react-native";
import { auth } from "../services/firebase";

const initMessages = [
  { id: 1, user: "Sarah K.", text: "Hey everyone! Who is going to Bali next month? 🌴", time: "10:00", me: false, type: "text" },
  { id: 2, user: "Mike T.", text: "I am! Already booked flights ✈", time: "10:02", me: false, type: "text" },
  { id: 3, user: "You", text: "Same here! Let us plan a meetup", time: "10:05", me: true, type: "text" },
  { id: 4, user: "Ana R.", img: "https://picsum.photos/300/200?random=50", time: "10:06", me: false, type: "image" },
  { id: 5, user: "Mike T.", text: "Amazing photo Ana! Which area?", time: "10:08", me: false, type: "text" },
];

export default function GroupChatScreen({ route, navigation }) {
  const group = route?.params?.group || { name: "Travel Group", members: 5, emoji: "✈" };
  const [messages, setMessages] = useState(initMessages);
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [showImgModal, setShowImgModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const send = (type = "text", content = null) => {
    const msgText = content || text;
    if (!msgText?.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: auth.currentUser?.email?.split("@")[0] || "You",
      text: type === "text" ? msgText : null,
      img: type === "image" ? msgText : null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      me: true,
      type
    };
    setMessages(m => [...m, newMsg]);
    setText("");
  };

  const sendImage = () => {
    if (!imgUrl.trim()) return;
    send("image", imgUrl);
    setImgUrl("");
    setShowImgModal(false);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={s.groupInfo}>
          <Text style={s.groupEmoji}>{group.emoji || "✈"}</Text>
          <View>
            <Text style={s.groupName}>{group.name}</Text>
            <Text style={s.groupMembers}>👥 {group.members} members</Text>
          </View>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={s.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map(m => (
          <View key={m.id} style={[s.msgWrap, m.me && s.meWrap]}>
            {!m.me && <View style={s.userAvatar}><Text style={s.userAvatarText}>{m.user[0]}</Text></View>}
            <View style={[s.bubble, m.me ? s.meBubble : s.themBubble]}>
              {!m.me && <Text style={s.msgUser}>{m.user}</Text>}
              {m.type === "image" ? (
                <Image source={{ uri: m.img }} style={s.msgImg} resizeMode="cover" />
              ) : (
                <Text style={s.msgText}>{m.text}</Text>
              )}
              <Text style={s.msgTime}>{m.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={s.inputArea}>
        <TouchableOpacity style={s.attachBtn} onPress={() => setShowOptions(!showOptions)}>
          <Text style={s.attachIcon}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={s.input}
          placeholder="Message..."
          placeholderTextColor="#555"
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => send()}
          multiline
        />
        <TouchableOpacity style={[s.sendBtn, !text.trim() && s.sendBtnDisabled]} onPress={() => send()} disabled={!text.trim()}>
          <Text style={s.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>

      {showOptions && (
        <View style={s.options}>
          <TouchableOpacity style={s.optionBtn} onPress={() => { setShowOptions(false); setShowImgModal(true); }}>
            <Text style={s.optionIcon}>🖼</Text>
            <Text style={s.optionText}>Photo URL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.optionBtn} onPress={() => { setShowOptions(false); Alert?.alert("Coming soon", "Voice messages coming soon!"); }}>
            <Text style={s.optionIcon}>🎤</Text>
            <Text style={s.optionText}>Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.optionBtn} onPress={() => { setShowOptions(false); Alert?.alert("Coming soon", "File sharing coming soon!"); }}>
            <Text style={s.optionIcon}>📎</Text>
            <Text style={s.optionText}>File</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.optionBtn} onPress={() => setShowOptions(false)}>
            <Text style={s.optionIcon}>📍</Text>
            <Text style={s.optionText}>Location</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showImgModal} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Share Photo 🖼</Text>
            <TextInput style={s.modalInput} placeholder="Paste image URL here..." placeholderTextColor="#555" value={imgUrl} onChangeText={setImgUrl} autoFocus />
            {imgUrl ? <Image source={{ uri: imgUrl }} style={s.preview} resizeMode="cover" /> : null}
            <TouchableOpacity style={s.modalBtn} onPress={sendImage}>
              <Text style={s.modalBtnText}>Send Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowImgModal(false); setImgUrl(""); }}>
              <Text style={s.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, backgroundColor: "#1A1735", borderBottomWidth: 1, borderColor: "#2A2450", gap: 12 },
  back: { marginRight: 4 },
  backText: { color: "#7B9FFF", fontSize: 15, fontWeight: "600" },
  groupInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  groupEmoji: { fontSize: 28 },
  groupName: { color: "#fff", fontWeight: "800", fontSize: 15 },
  groupMembers: { color: "#A0A0B0", fontSize: 11 },
  messages: { flex: 1 },
  msgWrap: { flexDirection: "row", marginBottom: 14, alignItems: "flex-end", gap: 8 },
  meWrap: { flexDirection: "row-reverse" },
  userAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  userAvatarText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  bubble: { maxWidth: "75%", borderRadius: 18, overflow: "hidden" },
  meBubble: { backgroundColor: "#7B9FFF", borderBottomRightRadius: 4, padding: 12 },
  themBubble: { backgroundColor: "#1A1735", borderBottomLeftRadius: 4, padding: 12, borderWidth: 1, borderColor: "#2A2450" },
  msgUser: { color: "#C084FC", fontSize: 11, fontWeight: "700", marginBottom: 4 },
  msgText: { color: "#fff", fontSize: 14, lineHeight: 20 },
  msgImg: { width: 200, height: 150, borderRadius: 12 },
  msgTime: { color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4, textAlign: "right" },
  inputArea: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "#1A1735", borderTopWidth: 1, borderColor: "#2A2450", alignItems: "flex-end" },
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#2A2450", justifyContent: "center", alignItems: "center" },
  attachIcon: { color: "#7B9FFF", fontSize: 22, fontWeight: "700" },
  input: { flex: 1, backgroundColor: "#0D0B1E", color: "#fff", padding: 12, borderRadius: 20, fontSize: 14, maxHeight: 100, borderWidth: 1, borderColor: "#2A2450" },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: { color: "#fff", fontSize: 16 },
  options: { flexDirection: "row", backgroundColor: "#1A1735", padding: 12, gap: 8, borderTopWidth: 1, borderColor: "#2A2450" },
  optionBtn: { flex: 1, alignItems: "center", backgroundColor: "#0D0B1E", padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "#2A2450" },
  optionIcon: { fontSize: 24, marginBottom: 4 },
  optionText: { color: "#A0A0B0", fontSize: 11 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#13112A", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, backgroundColor: "#2A2450", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 16 },
  modalInput: { backgroundColor: "#1A1735", color: "#fff", padding: 14, borderRadius: 14, marginBottom: 12, fontSize: 14, borderWidth: 1, borderColor: "#2A2450" },
  preview: { width: "100%", height: 160, borderRadius: 14, marginBottom: 12 },
  modalBtn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 10 },
  modalBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancel: { color: "#A0A0B0", textAlign: "center", padding: 8 },
});