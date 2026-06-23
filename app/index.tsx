import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [name, setName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("player_name").then((name) => {
      if (name) router.replace("/home");
    });
  }, []);
  const join = async () => {
    if (!name.trim()) return;
    if (name.trim().length > 20) {
      alert("Naam thoda chota rakho! (max 20 chars)");
      return;
    }
    await AsyncStorage.setItem("player_name", name.trim());
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏐 The Boys</Text>
      <Text style={styles.subtitle}>Enter your name to join</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        autoFocus
        maxLength={20}
      />
      <TouchableOpacity style={styles.btn} onPress={join}>
        <Text style={styles.btnText}>Let's Go</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 32 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  btn: {
    width: "100%",
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
