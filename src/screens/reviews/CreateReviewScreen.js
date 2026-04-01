import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import ScreenShell from "../../components/ScreenShell";
import TextField from "../../components/TextField";
import PrimaryButton from "../../components/PrimaryButton";
import { apiPost } from "../../api/client";

const categories = ["restaurant", "cafe", "bar", "hotel", "attraction", "hidden_gem"];

const uploadToS3 = async (uri) => {
  const ext = uri.split(".").pop() || "jpg";
  const fileName = `review-${Date.now()}.${ext}`;

  const presigned = await apiPost("/uploads/presign", {
    fileName,
    contentType: "image/jpeg",
    folder: "reviews",
  });

  const response = await fetch(uri);
  const blob = await response.blob();

  await fetch(presigned.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: blob,
  });

  return presigned.publicUrl;
};

const CreateReviewScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tips, setTips] = useState("");
  const [rating, setRating] = useState("5");

  const [placeName, setPlaceName] = useState("");
  const [placeCategory, setPlaceCategory] = useState("cafe");
  const [placeCity, setPlaceCity] = useState("");
  const [placeCountry, setPlaceCountry] = useState("");
  const [placeAddress, setPlaceAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [imageUris, setImageUris] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.85,
    });

    if (!result.canceled) {
      setImageUris((prev) => [...prev, ...result.assets.map((item) => item.uri)].slice(0, 4));
    }
  };

  const onSubmit = async () => {
    if (!title.trim() || !description.trim() || !placeName.trim()) {
      Alert.alert("Missing info", "Title, description and place name are required.");
      return;
    }

    const ratingNumber = Number(rating);
    if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      Alert.alert("Invalid rating", "Rating must be an integer 1 to 5.");
      return;
    }

    try {
      setLoading(true);

      let uploadedUrls = [];
      if (imageUris.length) {
        try {
          uploadedUrls = await Promise.all(imageUris.map(uploadToS3));
        } catch (error) {
          console.log(error.message);
          uploadedUrls = imageUris;
        }
      }

      await apiPost("/reviews", {
        title: title.trim(),
        description: description.trim(),
        rating: ratingNumber,
        tips: tips.trim() || null,
        photos: uploadedUrls,
        place: {
          name: placeName.trim(),
          category: placeCategory,
          city: placeCity.trim() || null,
          country: placeCountry.trim() || null,
          address: placeAddress.trim() || null,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          isHiddenGem: placeCategory === "hidden_gem",
        },
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Failed to submit", error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TextField label="Review title" value={title} onChangeText={setTitle} placeholder="Great sunset cafe" />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What made this place special?"
          multiline
        />
        <TextField
          label="Tips for travelers"
          value={tips}
          onChangeText={setTips}
          placeholder="Best time, what to bring, etc."
        />
        <TextField
          label="Rating (1-5)"
          keyboardType="number-pad"
          value={rating}
          onChangeText={setRating}
        />

        <Text style={styles.sectionTitle}>Place details</Text>
        <TextField label="Place name" value={placeName} onChangeText={setPlaceName} />

        <View style={styles.categoryRow}>
          {categories.map((category) => {
            const active = category === placeCategory;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setPlaceCategory(category)}
                style={[styles.categoryChip, active && styles.categoryActive]}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {category.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <TextField label="City" value={placeCity} onChangeText={setPlaceCity} />
          </View>
          <View style={styles.half}>
            <TextField label="Country" value={placeCountry} onChangeText={setPlaceCountry} />
          </View>
        </View>

        <TextField label="Address" value={placeAddress} onChangeText={setPlaceAddress} />

        <View style={styles.row}>
          <View style={styles.half}>
            <TextField
              label="Latitude"
              keyboardType="decimal-pad"
              value={latitude}
              onChangeText={setLatitude}
            />
          </View>
          <View style={styles.half}>
            <TextField
              label="Longitude"
              keyboardType="decimal-pad"
              value={longitude}
              onChangeText={setLongitude}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>Add review photos</Text>
        </TouchableOpacity>

        <View style={styles.previewRow}>
          {imageUris.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.previewImage} />
          ))}
        </View>

        <PrimaryButton title="Publish review" onPress={onSubmit} loading={loading} />
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
  sectionTitle: {
    color: "#DDF4FC",
    fontWeight: "700",
    marginVertical: 6,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#2E6078",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#14384A",
  },
  categoryActive: {
    backgroundColor: "#FF6B4A",
    borderColor: "#FF6B4A",
  },
  categoryText: {
    color: "#D7EDF7",
    textTransform: "capitalize",
    fontSize: 12,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  half: {
    flex: 1,
  },
  photoButton: {
    borderWidth: 1,
    borderColor: "#2C6076",
    borderStyle: "dashed",
    borderRadius: 12,
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
    marginBottom: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});

export default CreateReviewScreen;
