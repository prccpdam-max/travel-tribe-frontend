import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from "react-native";

const FREE_LIMIT = 5;

const suggestions = [
  "Plan a 7-day Japan trip",
  "Best street food in Bangkok",
  "Budget hotels in Bali",
  "How to say thank you in Japanese",
];

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hi! I am your AI Travel Assistant. I can help you plan trips, find hotels, restaurants, translate languages, and answer any travel questions. What would you like to explore today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    if (!isPremium && usageCount >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    setInput("");
    setMessages(m => [...m, { id: Date.now(), role: "user", text: userText }]);
    setLoading(true);
    setUsageCount(c => c + 1);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an expert AI Travel Assistant for Travel Tribe app. You help users plan trips, recommend hotels, restaurants, attractions, translate languages, and answer travel questions. Be friendly, concise, and helpful. Format responses clearly with bullet points when listing items.",
          messages: [
            ...messages.filter(m => m.role !== "assistant" || m.id === 1).map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: userText }
          ]
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I could not process that request.";
      setMessages(m => [...m, { id: Date.now() + 1, role: "assistant", text: reply }]);
    } catch (e) {
      setMessages(m => [...m, { id: Date.now() + 1, role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const remainingFree = Math.max(0, FREE_LIMIT - usageCount);

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.title}>AI Travel Assistant</Text>
          <Text style={s.subtitle}>Powered by Claude AI</Text>
        </View>
        {!isPremium && (
          <TouchableOpacity style={s.premiumBadge} onPress={() => setShowUpgrade(true)}>
            <Text style={s.premiumBadgeText}>FREE {remainingFree}/{FREE_LIMIT}</Text>
          </TouchableOpacity>
        )}
        {isPremium && (
          <View style={s.premiumActiveBadge}>
            <Text style={s.premiumActiveText}>PREMIUM</Text>
          </View>
        )}
      </View>

      {messages.length === 1 && (
        <View style={s.suggestions}>
          <Text style={s.suggestTitle}>Try asking:</Text>
          <View style={s.suggestRow}>
            {suggestions.map((s2, i) => (
              <TouchableOpacity key={i} style={s.suggestBtn} onPress={() => sendMessage(s2)}>
                <Text style={s.suggestText}>{s2}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView ref={scrollRef} style={s.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map(m => (
          <View key={m.id} style={[s.bubbleWrap, m.role === "user" && s.userWrap]}>
            {m.role === "assistant" && (
              <View style={s.aiAvatar}><Text style={s.aiAvatarText}>AI</Text></View>
            )}
            <View style={[s.bubble, m.role === "user" ? s.userBubble : s.aiBubble]}>
              <Text style={s.msgText}>{m.text}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={s.bubbleWrap}>
            <View style={s.aiAvatar}><Text style={s.aiAvatarText}>AI</Text></View>
            <View style={s.aiBubble}>
              <ActivityIndicator color="#7B9FFF" size="small" />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          placeholder={!isPremium && usageCount >= FREE_LIMIT ? "Upgrade to continue..." : "Ask anything about travel..."}
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage()}
          editable={isPremium || usageCount < FREE_LIMIT}
        />
        <TouchableOpacity style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnDisabled]} onPress={() => sendMessage()} disabled={!input.trim() || loading}>
          <Text style={s.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showUpgrade} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalEmoji}>?</Text>
            <Text style={s.modalTitle}>Upgrade to Premium</Text>
            <Text style={s.modalDesc}>You have used all 5 free AI messages today. Upgrade to get unlimited AI assistance!</Text>
            <View style={s.features}>
              {["Unlimited AI conversations", "AI Trip planner", "Language translation", "Priority support", "No ads"].map((f, i) => (
                <View key={i} style={s.featureRow}>
                  <Text style={s.featureCheck}>?</Text>
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={s.priceBox}>
              <Text style={s.price}>199 THB</Text>
              <Text style={s.pricePer}>/month</Text>
            </View>
            <TouchableOpacity style={s.upgradeBtn} onPress={() => { setIsPremium(true); setShowUpgrade(false); }}>
              <Text style={s.upgradeBtnText}>Upgrade Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowUpgrade(false)}>
              <Text style={s.cancelText}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#1A1735" },
  headerLeft: {},
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },
  subtitle: { color: "#A0A0B0", fontSize: 12 },
  premiumBadge: { backgroundColor: "#1A1735", borderWidth: 1, borderColor: "#7B9FFF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  premiumBadgeText: { color: "#7B9FFF", fontSize: 12, fontWeight: "700" },
  premiumActiveBadge: { backgroundColor: "#C084FC", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  premiumActiveText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  suggestions: { padding: 16 },
  suggestTitle: { color: "#A0A0B0", fontSize: 13, marginBottom: 8 },
  suggestRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestBtn: { backgroundColor: "#1A1735", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#2A2450" },
  suggestText: { color: "#7B9FFF", fontSize: 13 },
  messages: { flex: 1 },
  bubbleWrap: { flexDirection: "row", marginBottom: 16, alignItems: "flex-start", gap: 8 },
  userWrap: { flexDirection: "row-reverse" },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#7B9FFF", justifyContent: "center", alignItems: "center", marginTop: 4 },
  aiAvatarText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  bubble: { maxWidth: "78%", padding: 14, borderRadius: 16 },
  aiBubble: { backgroundColor: "#1A1735", borderBottomLeftRadius: 4, padding: 14, borderRadius: 16, maxWidth: "78%" },
  userBubble: { backgroundColor: "#7B9FFF", borderBottomRightRadius: 4 },
  msgText: { color: "#fff", fontSize: 14, lineHeight: 22 },
  inputRow: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "#1A1735" },
  input: { flex: 1, backgroundColor: "#0D0B1E", color: "#fff", padding: 12, borderRadius: 12, fontSize: 14 },
  sendBtn: { backgroundColor: "#7B9FFF", paddingHorizontal: 16, borderRadius: 12, justifyContent: "center" },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: "#fff", fontWeight: "800" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#1A1735", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalEmoji: { fontSize: 48, textAlign: "center", marginBottom: 8 },
  modalTitle: { color: "#fff", fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  modalDesc: { color: "#A0A0B0", textAlign: "center", marginBottom: 20, lineHeight: 20 },
  features: { marginBottom: 20 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  featureCheck: { color: "#7B9FFF", fontSize: 16, fontWeight: "800" },
  featureText: { color: "#fff", fontSize: 14 },
  priceBox: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 16 },
  price: { color: "#7B9FFF", fontSize: 36, fontWeight: "800" },
  pricePer: { color: "#A0A0B0", fontSize: 16 },
  upgradeBtn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 12 },
  upgradeBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancelText: { color: "#A0A0B0", textAlign: "center", padding: 8 },
});
