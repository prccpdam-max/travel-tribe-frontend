import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";

const initMessages = [
  { id: 1, user: "Sarah K.", text: "Hey everyone! Who is going to Bali next month?", time: "10:00", me: false },
  { id: 2, user: "Mike T.", text: "I am! Already booked flights", time: "10:02", me: false },
  { id: 3, user: "You", text: "Same here! Let us plan a meetup", time: "10:05", me: true },
  { id: 4, user: "Ana R.", text: "Count me in! Which area?", time: "10:06", me: false },
  { id: 5, user: "Mike T.", text: "Seminyak or Ubud?", time: "10:08", me: false },
];

export default function GroupChatScreen({ route, navigation }) {
  const group = route?.params?.group || { name: "Travel Group", members: 5 };
  const [messages, setMessages] = useState(initMessages);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => [...m, { id: Date.now(), user: "You", text, me: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setText("");
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerInfo}>
          <View style={s.avatar}><Text style={s.avatarText}>{group.name[0]}</Text></View>
          <View>
            <Text style={s.groupName}>{group.name}</Text>
            <Text style={s.members}>{group.members} members</Text>
          </View>
        </View>
      </View>

      <ScrollView style={s.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map(m => (
          <View key={m.id} style={[s.bubbleWrap, m.me && s.meWrap]}>
            {!m.me && <View style={s.userAvatar}><Text style={s.userAvatarText}>{m.user[0]}</Text></View>}
            <View style={[s.bubble, m.me ? s.meBubble : s.themBubble]}>
              {!m.me && <Text style={s.userName}>{m.user}</Text>}
              <Text style={s.msgText}>{m.text}</Text>
              <Text style={s.time}>{m.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={s.inputRow}>
        <TextInput style={s.input} placeholder="Message group..." placeholderTextColor="#888" value={text} onChangeText={setText} onSubmitEditing={send} />
        <TouchableOpacity style={s.sendBtn} onPress={send}>
          <Text style={s.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#1A1735", gap: 12 },
  back: { marginRight: 4 },
  backText: { color: "#7B9FFF", fontSize: 15 },
  headerInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#C084FC", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  groupName: { color: "#fff", fontWeight: "800", fontSize: 16 },
  members: { color: "#A0A0B0", fontSize: 12 },
  messages: { flex: 1 },
  bubbleWrap: { flexDirection: "row", marginBottom: 12, alignItems: "flex-end", gap: 8 },
  meWrap: { flexDirection: "row-reverse" },
  userAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  userAvatarText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  bubble: { maxWidth: "72%", padding: 12, borderRadius: 16 },
  meBubble: { backgroundColor: "#7B9FFF", borderBottomRightRadius: 4 },
  themBubble: { backgroundColor: "#1A1735", borderBottomLeftRadius: 4 },
  userName: { color: "#C084FC", fontSize: 11, fontWeight: "700", marginBottom: 4 },
  msgText: { color: "#fff", fontSize: 14, lineHeight: 20 },
  time: { color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4, textAlign: "right" },
  inputRow: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "#1A1735" },
  input: { flex: 1, backgroundColor: "#0D0B1E", color: "#fff", padding: 12, borderRadius: 12 },
  sendBtn: { backgroundColor: "#7B9FFF", padding: 12, borderRadius: 12, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "800" },
});
