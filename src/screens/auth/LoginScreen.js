import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";

import ScreenShell from "../../components/ScreenShell";
import TextField from "../../components/TextField";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const { signInEmail, signInGoogle, signInApple, firebaseReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    const loginGoogle = async () => {
      if (response?.type === "success") {
        const token = response.params?.id_token;
        if (!token) {
          Alert.alert("Google Sign-In", "Missing Google id_token.");
          return;
        }

        try {
          setLoading(true);
          await signInGoogle(token);
        } catch (error) {
          Alert.alert("Google Sign-In", error.message || "Sign-in failed.");
        } finally {
          setLoading(false);
        }
      }
    };

    loginGoogle();
  }, [response]);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInEmail({ email: email.trim(), password });
    } catch (error) {
      Alert.alert("Login failed", error.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const onAppleSignIn = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("Apple Sign-In did not return identity token.");
      }

      await signInApple({
        idToken: credential.identityToken,
        rawNonce: credential.nonce,
      });
    } catch (error) {
      if (error.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Apple Sign-In", error.message || "Unable to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>Travel Tribe</Text>
        <Text style={styles.title}>Find your people, anywhere.</Text>
        <Text style={styles.subtitle}>
          Connect with global travelers, join groups, and discover hidden gems.
        </Text>

        <View style={styles.formCard}>
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
            placeholder="Your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton title="Login" onPress={onLogin} loading={loading} />

          <PrimaryButton
            title="Continue with Google"
            mode="outline"
            disabled={!request || loading || !firebaseReady}
            onPress={() => promptAsync()}
          />

          {Platform.OS === "ios" ? (
            <PrimaryButton
              title="Continue with Apple"
              mode="outline"
              onPress={onAppleSignIn}
              disabled={loading || !firebaseReady}
            />
          ) : null}

          {!firebaseReady ? (
            <Text style={styles.devHint}>
              Firebase is not configured. Set keys in `.env` to enable auth providers.
            </Text>
          ) : null}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}> 
          <Text style={styles.linkText}>New traveler? Create account</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 40,
  },
  kicker: {
    color: "#8DC0D3",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1.6,
    marginTop: 12,
  },
  title: {
    color: theme.colors.textOnDark,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    marginTop: 6,
  },
  subtitle: {
    color: "#B7D9E8",
    marginTop: 12,
    marginBottom: 18,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "rgba(16, 52, 67, 0.9)",
    borderColor: "#2E6076",
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 18,
  },
  linkText: {
    color: theme.colors.accent,
    textAlign: "center",
    fontWeight: "700",
  },
  devHint: {
    color: "#9FC2D3",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});

export default LoginScreen;
