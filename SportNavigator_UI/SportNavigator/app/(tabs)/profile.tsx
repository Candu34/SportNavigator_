import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { API_URL } from "@/constants/api_url";
import AppLoader from "@/components/AppLoader";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";

type EncodedImage = {
  mime: string;
  data: string;
};

type UserDTO = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  science: string;
  image?: EncodedImage;
};

export default function ProfilePage() {
  const router = useRouter();
  const { onLogout } = useAuth();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [originalImage, setOriginalImage] = useState<EncodedImage | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editing, setEditing] = useState(false);

  const [newImage, setNewImage] = useState<EncodedImage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("user");
        if (!stored) throw new Error("User not found");
        const u: UserDTO = JSON.parse(stored);
        setUser(u);
        setOriginalImage(u.image ?? null);
        setFirstName(u.firstName);
        setLastName(u.lastName);
      } catch (err: any) {
        console.error(err);
        Alert.alert("Error", err.message);
      }
    })();
  }, []);

  const handleLogOut = async () => {
    await onLogout();
    router.replace("/screens/start_page");
  };

  const onCancelEdit = () => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
    setEditing(false);
  };

  const onCancelImage = () => {
    setNewImage(null);
    setUser((u) =>
      u
        ? {
            ...u,
            image: originalImage ?? undefined,
          }
        : u
    );
  };

  // Pick a new avatar, preview immediately
  const onPickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Error", "Media library permission denied");
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop() || "jpg";
    const enc: EncodedImage = { mime: `image/${ext}`, data: asset.base64! };
    setNewImage(enc);
    setUser((u) => (u ? { ...u, image: enc } : u));
  };

  const onSaveChanges = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const payload = {
        id: user.id,
        firstName,
        lastName,
        image: newImage, // may be null
      };
      const resp = await axios.patch<UserDTO>(
        `${API_URL}/users/update/${user.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      const updated = resp.data;
      setUser(updated);
      await SecureStore.setItemAsync("user", JSON.stringify(updated));
      setOriginalImage(updated.image ?? null);
      setNewImage(null);
      setEditing(false);
      Alert.alert("Success", "Profile updated");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const isNameDirty =
    !!user && (firstName !== user.firstName || lastName !== user.lastName);
  const isImageDirty = newImage !== null;
  const isDirty = isNameDirty || isImageDirty;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
        <TouchableOpacity onPress={handleLogOut}>
          <MaterialIcons
            name="logout"
            size={24}
            color="black"
            style={defaultStyles.btnIcon}
          />
        </TouchableOpacity>
      </View>

      {user && (
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={onPickImage}>
              <Image
                source={
                  user.image
                    ? {
                        uri: `data:${user.image.mime};base64,${user.image.data}`,
                      }
                    : require("../../assets/images/athlete_primary.png")
                }
                style={styles.avatar}
              />
              <MaterialIcons
                name="camera-alt"
                size={24}
                color="white"
                style={styles.cameraIcon}
              />
            </TouchableOpacity>

            {newImage && (
              <TouchableOpacity
                style={styles.imageCancelIcon}
                onPress={onCancelImage}
              >
                <Ionicons name="close-outline" size={28} color="red" />
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <View style={styles.editColumn}>
              <TextInput
                style={[defaultStyles.inputField, styles.nameInput]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
              />
              <TextInput
                style={[defaultStyles.inputField, styles.nameInput]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
              />
              <TouchableOpacity onPress={onCancelEdit}>
                <Ionicons name="close-outline" size={30} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editRow}>
              <Text style={styles.nameText}>
                {user.firstName} {user.lastName}
              </Text>
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color="black"
                  style={defaultStyles.btnIcon}
                />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.infoText}>Email: {user.email}</Text>
          <Text style={styles.infoText}>Science: {user.science}</Text>

          {isDirty && (
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={defaultStyles.btn}
                onPress={onSaveChanges}
              >
                <Text style={defaultStyles.btnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {loading && <AppLoader />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  header: { fontFamily: "pop-b", fontSize: 40, color: Colors.primary },

  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 2 },
    alignItems: "center",
    gap: 14,
  },

  avatarContainer: {
    position: "relative",
  },
  avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: Colors.grey },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 4,
  },
  imageCancelIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 2,
  },

  editRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  editColumn: { alignItems: "center", gap: 20 },
  nameInput: { width: 200, fontSize: 20 },
  nameText: { fontFamily: "pop-b", fontSize: 20 },
  infoText: { fontFamily: "pop-sb", fontSize: 16, marginTop: 8 },

  buttonView: { width: "50%", alignSelf: "center", marginTop: 20 },
});
