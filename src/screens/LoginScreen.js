import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { loginWithEmail, registerWithEmail } from "../services/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) { Alert.alert("?????????????????????????"); return; }
    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
        Alert.alert("?????????????????!");
      } else {
        await loginWithEmail(email, password);
      }
    } catch (e) {
      Alert.alert("??????????????", e.message);
    }
    setLoading(false);
  };

  return (
    <View style={s.container}>
      <Text style={s.logo}>?</Text>
      <Text style={s.title}>Travel Tribe</Text>
      <Text style={s.subtitle}>{isRegister ? "???????????" : "???????????"}</Text>
      <TextInput style={s.input} placeholder="?????" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={s.input} placeholder="????????" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={s.btn} onPress={handleAuth} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{isRegister ? "???????????" : "???????????"}</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={s.switchText}>{isRegister ? "???????????? ???????????" : "?????????????? ???????????"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0B1E", padding: 24, justifyContent: "center" },
  logo: { fontSize: 48, textAlign: "center", marginBottom: 8 },
  title: { color: "#7B9FFF", fontSize: 36, fontWeight: "800", textAlign: "center", marginBottom: 4 },
  subtitle: { color: "#A0A0B0", fontSize: 16, textAlign: "center", marginBottom: 32 },
  input: { backgroundColor: "#1A1735", color: "#fff", padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: "#7B9FFF", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 16 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  switchText: { color: "#C084FC", textAlign: "center", fontSize: 14 },
});


