import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import ScreenShell from "../components/ScreenShell";
import TextField from "../components/TextField";
import PrimaryButton from "../components/PrimaryButton";
import { apiPost } from "../../api/client";

const CreateBuddyPostScreen = ({ navigation }) => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activityTypes, setActivityTypes] = useState("");
  const [languages, setLanguages] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!city.trim() || !startDate.trim() || !endDate.trim() || !message.trim()) {
      Alert.alert("Missing info", "City, date range, and message are required.");
      return;
    }

    try {
      setLoading(true);
      await apiPost("/buddies/posts", {
        city: city.trim(),
        country: country.trim() || null,
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        activityTypes: activityTypes
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean),
        languages: languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        message: message.trim(),
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Could not create post", error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View>
          <TextField label="City" value={city} onChangeText={setCity} placeholder="Tokyo" />
          <TextField label="Country" value={country} onChangeText={setCountry} placeholder="Japan" />
          <TextField
            label="Start date (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="2026-06-10"
          />
          <TextField
            label="End date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
            placeholder="2026-06-15"
          />
          <TextField
            label="Activities"
            value={activityTypes}
            onChangeText={setActivityTypes}
            placeholder="cafe, nightlife, hiking"
          />
          <TextField
            label="Languages"
            value={languages}
            onChangeText={setLanguages}
            placeholder="English, Japanese"
          />
          <TextField
            label="Post message"
            value={message}
            onChangeText={setMessage}
            placeholder="Looking for travel buddies..."
            multiline
          />

          <PrimaryButton title="Publish buddy post" onPress={onSubmit} loading={loading} />
        </View>
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
});

export default CreateBuddyPostScreen;

