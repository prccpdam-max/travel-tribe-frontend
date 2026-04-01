import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";

const initMessages = [
  { id: 1, text: "Hey! Are you going to Bali next month?", me: false, time: "10:00" },
  { id: 2, text: "Yes! Already booked my flights", me: true, time: "10:01" },
  { id: 3, text: "Amazing! We should meet up there", me: false, time: "10:02" },
  { id: 4, text: "Definitely! Which area are you staying?", me: true, time: "10:03" },
  { id: 5, text: "Seminyak, you?", me: false, time: "10:04" },
  { id: 6, text: "Ubud! But we can definitely meet in the middle", me: true, time: "10:05" },
];

export default function ChatScreen({ route, navigation }) {
  const conv = route?.params?.conv || { name: "Sarah Kim" };
  const [messages, setMessages] = useState(initMessages);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => [...m, { id: Date.now(), text, me: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setText("");
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={s.back}><Text style={s.backText}>Back</Text></TouchableOpacity>
        <View style={s.avatar}><Text style={s.avatarText}>{conv.name[0]}</Text></View>
        <Text style={s.name}>{conv.name}</Text>
      </View>
      <ScrollView style={s.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map(m => (
          <View key={m.id} style={[s.bubble, m.me ? s.me : s.them]}>
            <Text style={s.msgText}>{m.text}</Text>
            <Text style={s.time}>{m.time}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={s.inputRow}>
        <TextInput style={s.input} placeholder="Type a message..." placeholderTextColor="#888" value={text} onChangeText={setText} onSubmitEditing={send} />
        <TouchableOpacity style={s.sendBtn} onPress={send}>
          <Text style={s.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#1A1735", gap: 10 },
  back: { marginRight: 4 },
  backText: { color: "#7B9FFF", fontSize: 15 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "800" },
  name: { color: "#fff", fontWeight: "800", fontSize: 16 },
  messages: { flex: 1 },
  bubble: { maxWidth: "75%", padding: 12, borderRadius: 16, marginBottom: 8 },
  me: { backgroundColor: "#7B9FFF", alignSelf: "flex-end", borderBottomRightRadius: 4 },
  them: { backgroundColor: "#1A1735", alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  msgText: { color: "#fff", fontSize: 14, lineHeight: 20 },
  time: { color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 4, textAlign: "right" },
  inputRow: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "#1A1735" },
  input: { flex: 1, backgroundColor: "#0D0B1E", color: "#fff", padding: 12, borderRadius: 12 },
  sendBtn: { backgroundColor: "#7B9FFF", padding: 12, borderRadius: 12, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "800" },
});
