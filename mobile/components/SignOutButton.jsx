// components/SignOutButton.jsx
import { useClerk } from "@clerk/clerk-expo";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Linking from "expo-linking";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={styles.text}>Sign Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
