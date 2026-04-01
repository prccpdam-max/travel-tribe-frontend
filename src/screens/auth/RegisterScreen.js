import { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";

import ScreenShell from "../../components/ScreenShell";
import TextField from "../../components/TextField";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";

const RegisterScreen = ({ navigation }) => {
  const { signUpEmail } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!displayName || !email || !password) {
      Alert.alert("Missing info", "Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Use at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await signUpEmail({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });
    } catch (error) {
      Alert.alert("Sign-up failed", error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Create your traveler profile</Text>
        <Text style={styles.subtitle}>
          Share trips, write reviews, and find travel buddies in every city.
        </Text>

        <View style={styles.formCard}>
          <TextField
            label="Display name"
            placeholder="Maya Tan"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextField
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            placeholder="At least 6 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton title="Create account" onPress={onRegister} loading={loading} />
          <PrimaryButton
            title="Back to login"
            mode="outline"
            onPress={() => navigation.goBack()}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 30,
  },
  title: {
    color: theme.colors.textOnDark,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginTop: 8,
  },
  subtitle: {
    color: "#BEDBE8",
    marginTop: 10,
    marginBottom: 18,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "rgba(16, 52, 67, 0.9)",
    borderColor: "#2E6076",
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: 16,
  },
});

export default RegisterScreen;
