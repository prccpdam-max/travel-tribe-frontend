import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import ScreenShell from "../../components/ScreenShell";
import TextField from "../../components/TextField";
import PrimaryButton from "../../components/PrimaryButton";
import { apiPost } from "../../api/client";
import { theme } from "../../styles/theme";

const uploadToS3 = async (uri) => {
  const ext = uri.split(".").pop() || "jpg";
  const fileName = `travel-post-${Date.now()}.${ext}`;

  const presigned = await apiPost("/uploads/presign", {
    fileName,
    contentType: "image/jpeg",
    folder: "posts",
  });

  const fileResponse = await fetch(uri);
  const blob = await fileResponse.blob();

  await fetch(presigned.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: blob,
  });

  return presigned.publicUrl;
};

const CreatePostScreen = ({ navigation }) => {
  const [caption, setCaption] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageUris, setImageUris] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 4,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImageUris((prev) => [...prev, ...uris].slice(0, 4));
    }
  };

  const onSubmit = async () => {
    if (!caption.trim()) {
      Alert.alert("Caption required", "Please write a caption.");
      return;
    }

    try {
      setLoading(true);

      let uploadedUrls = [];
      if (imageUris.length > 0) {
        try {
          uploadedUrls = await Promise.all(imageUris.map(uploadToS3));
        } catch (error) {
          console.log(error.message);
          uploadedUrls = imageUris;
        }
      }

      await apiPost("/posts", {
        caption: caption.trim(),
        photos: uploadedUrls,
        locationName: locationName.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        travelTags: tagsInput
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Failed to post", error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextField
          label="Caption"
          placeholder="Share your travel moment"
          multiline
          value={caption}
          onChangeText={setCaption}
        />

        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>Add photos (up to 4)</Text>
        </TouchableOpacity>

        <View style={styles.previewRow}>
          {imageUris.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.previewImage} />
          ))}
        </View>

        <TextField
          label="Location tag"
          placeholder="Sunset Viewpoint"
          value={locationName}
          onChangeText={setLocationName}
        />

        <View style={styles.row}>
          <View style={styles.flexHalf}>
            <TextField label="City" placeholder="Bangkok" value={city} onChangeText={setCity} />
          </View>
          <View style={styles.flexHalf}>
            <TextField
              label="Country"
              placeholder="Thailand"
              value={country}
              onChangeText={setCountry}
            />
          </View>
        </View>

        <TextField
          label="Travel tags"
          placeholder="surf, beach, sunset"
          value={tagsInput}
          onChangeText={setTagsInput}
        />

        <View style={styles.row}>
          <View style={styles.flexHalf}>
            <TextField
              label="Latitude"
              keyboardType="decimal-pad"
              placeholder="13.7563"
              value={latitude}
              onChangeText={setLatitude}
            />
          </View>
          <View style={styles.flexHalf}>
            <TextField
              label="Longitude"
              keyboardType="decimal-pad"
              placeholder="100.5018"
              value={longitude}
              onChangeText={setLongitude}
            />
          </View>
        </View>

        <PrimaryButton title="Publish" onPress={onSubmit} loading={loading} />
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  flexHalf: {
    flex: 1,
  },
  photoButton: {
    borderWidth: 1,
    borderColor: "#2C6076",
    borderStyle: "dashed",
    borderRadius: theme.radius.md,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#133546",
  },
  photoButtonText: {
    color: "#D7EDF7",
    fontWeight: "600",
  },
  previewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  previewImage: {
    width: 88,
    height: 88,
    borderRadius: 10,
  },
});

export default CreatePostScreen;
