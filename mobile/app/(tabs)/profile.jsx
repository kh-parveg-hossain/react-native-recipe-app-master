import { useUser, SignedIn } from "@clerk/clerk-expo";
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SignOutButton } from "../../components/SignOutButton";

export default function Profile() {
  const { user, isLoaded } = useUser();

  const handleChangePhoto = async () => {
    try {
      // Ask for permission
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission denied", "We need access to your photo library.");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        // Convert to blob for Clerk
        const response = await fetch(imageUri);
        const blob = await response.blob();

        await user.setProfileImage({ file: blob });
        Alert.alert("Success", "Profile photo updated!");
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f49b33" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SignedIn>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleChangePhoto}>
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{user.fullName || "No name set"}</Text>
        <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress || "No email"}</Text>

        <View style={styles.infoContainer}>
          <InfoRow label="Username" value={user.username || "Not set"} />
          <InfoRow label="User ID" value={user.id} />
          <InfoRow label="Created At" value={new Date(user.createdAt).toLocaleDateString()} />
          <InfoRow
            label="Last Sign-in"
            value={user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "N/A"}
          />
        </View>

        <View style={styles.signOutContainer}>
          <SignOutButton />
        </View>
      </ScrollView>
    </SignedIn>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  container: {
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#f49b33",
    marginBottom: 8,
  },
  changePhotoText: {
    color: "#f49b33",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    marginTop: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#111",
    textAlign: "right",
    flexShrink: 1,
  },
  signOutContainer: {
    marginTop: 30,
    alignItems: "center",
  },
});
