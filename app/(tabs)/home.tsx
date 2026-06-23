import AsyncStorage from "@react-native-async-storage/async-storage";
import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

export default function Home() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("");
  const neededPlayers = 6;

  useEffect(() => {
    AsyncStorage.getItem("player_name").then((n) => {
      if (n) setName(n);
    });

    const today = new Date().toISOString().split("T")[0];
    const sessionRef = ref(db, `sessions/${today}`);
    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([name, val]: any) => ({
        name,
        coming: val.coming,
        time: val.time,
      }));
      setPlayers(list);
    });
  }, []);

  const markAttendance = async (coming: boolean, time?: string) => {
    const today = new Date().toISOString().split("T")[0];
    await set(ref(db, `sessions/${today}/${name}`), {
      coming,
      time: coming ? time || "6pm" : null,
    });
  };

  const handleConfirmTime = () => {
    markAttendance(true, arrivalTime || "6pm");
    setShowTimeModal(false);
    setArrivalTime("");
  };

  const coming = players.filter((p) => p.coming);
  const notComing = players.filter((p) => !p.coming);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏐 The Boys</Text>
      <Text style={styles.date}>{new Date().toDateString()}</Text>

      {coming.length > 0 && (
        <View style={styles.countBox}>
          <Text style={styles.count}>{coming.length}</Text>
          <Text style={styles.countLabel}>players aarhe hai</Text>
        </View>
      )}

      {coming.length >= neededPlayers ? (
        <View style={[styles.neededBox, { backgroundColor: "#22c55e" }]}>
          <Text style={styles.countLabel}>✅ Game on! Enough players!</Text>
        </View>
      ) : (
        <View style={styles.neededBox}>
          {coming.length > 0 && (
            <Text style={styles.count}>{neededPlayers - coming.length}</Text>
          )}
          <Text style={styles.countLabel}>
            {coming.length === 0 ? "Koi nahi arha aaj!" : "players aur ajaye bas"}
          </Text>
        </View>
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.yesBtn} onPress={() => setShowTimeModal(true)}>
          <Text style={styles.btnText}>✅ I'm Coming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noBtn} onPress={() => markAttendance(false)}>
          <Text style={styles.btnText}>❌ Not Today</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Coming ({coming.length})</Text>
      {coming.map((item) => (
        <View key={item.name} style={styles.playerRow}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerTime}>{item.time}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Not Coming ({notComing.length})</Text>
      {notComing.map((item) => (
        <View key={item.name} style={styles.playerRow}>
          <Text style={[styles.playerName, { color: "#999" }]}>{item.name}</Text>
        </View>
      ))}

      {/* Time Modal */}
      <Modal visible={showTimeModal} transparent animationType="slide">
        <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.modalOverlay}
  >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Kitne baje aa raha hai? ⏰</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 6 baje, 6:30, after dinner..."
              value={arrivalTime}
              onChangeText={setArrivalTime}
              autoFocus
              maxLength={30}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmTime}>
              <Text style={styles.btnText}>✅ Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimeModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold" },
  date: { color: "#666", marginBottom: 24 },
  countBox: { backgroundColor: "#22c55e", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 12 },
  neededBox: { backgroundColor: "#ef4444", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 24 },
  count: { fontSize: 64, fontWeight: "bold", color: "#fff" },
  countLabel: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  btnRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  yesBtn: { flex: 1, backgroundColor: "#22c55e", padding: 16, borderRadius: 12, alignItems: "center" },
  noBtn: { flex: 1, backgroundColor: "#ef4444", padding: 16, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 8 },
  playerRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  playerName: { fontSize: 16 },
  playerTime: { color: "#666" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 16, fontSize: 16 },
  confirmBtn: { backgroundColor: "#22c55e", padding: 16, borderRadius: 12, alignItems: "center" },
  cancelText: { textAlign: "center", color: "black", padding: 8 },
});