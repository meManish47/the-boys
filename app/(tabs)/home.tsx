import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "../../components/Avatar";
import { C, F } from "../../constants/theme";
import { db } from "../../firebase";

const NEEDED = 6;

export default function Home() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("player_name").then((n) => { if (n) setName(n); });
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    onValue(ref(db, `sessions/${today}`), (snap) => {
      const data = snap.val() || {};
      setPlayers(Object.entries(data).map(([n, v]: any) => ({ name: n, coming: v.coming, time: v.time })));
    });
  }, []);

  const markAttendance = async (coming: boolean, time?: string) => {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    await set(ref(db, `sessions/${today}/${name}`), { coming, time: coming ? time || "6PM" : null });
  };

  const handleConfirm = () => {
    markAttendance(true, arrivalTime || "6PM");
    setShowTimeModal(false);
    setArrivalTime("");
  };

  const coming = players.filter((p) => p.coming);
  const notComing = players.filter((p) => !p.coming);
  const needed = NEEDED - coming.length;
  const gameOn = coming.length >= NEEDED;
  const myStatus = players.find((p) => p.name === name);

  useEffect(() => {
    if (coming.length === NEEDED) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Game On! 🔥",
          body: "6 players confirmed — aaj match pakka!",
          sound: true,
        },
        trigger: null,
      });
    }
  }, [coming.length]);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ─────────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.appName}>THE BOYS 2.0</Text>
            <Text style={s.headerDate}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" }).toUpperCase()}
            </Text>
          </View>
          {myStatus && (
            <Text style={[s.myStatusChip, { color: myStatus.coming ? C.green : C.red }]}>
              {myStatus.coming ? `● IN · ${myStatus.time || "6PM"}` : "● OUT"}
            </Text>
          )}
        </View>

        <View style={s.divider} />

        {/* ── SCOREBOARD STATS ────────────────────────────────── */}
        <View style={s.statsRow}>
          <View style={[s.statBlock, { borderRightWidth: 1, borderRightColor: C.line }]}>
            <Text style={[s.statNum, { color: C.green }]}>{coming.length}</Text>
            <Text style={s.statLabel}>CONFIRMED</Text>
          </View>

          <View style={[s.statBlock, { borderRightWidth: 1, borderRightColor: C.line }]}>
            {gameOn
              ? <Text style={[s.statNum, { color: C.amber, fontSize: 18 }]}>GAME{"\n"}ON</Text>
              : <Text style={[s.statNum, { color: C.red }]}>{needed}</Text>
            }
            <Text style={s.statLabel}>{gameOn ? "READY" : "NEEDED"}</Text>
          </View>

          <View style={s.statBlock}>
            <Text style={[s.statNum, { color: C.gray }]}>{notComing.length}</Text>
            <Text style={s.statLabel}>OUT</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── CTA BUTTONS ─────────────────────────────────────── */}
        <View style={s.btnRow}>
          <TouchableOpacity style={s.yesBtn} onPress={() => setShowTimeModal(true)} activeOpacity={0.75}>
            <Text style={s.yesBtnText}>✓  I'M COMING</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.noBtn} onPress={() => markAttendance(false)} activeOpacity={0.75}>
            <Text style={s.noBtnText}>✕  NOT TODAY</Text>
          </TouchableOpacity>
        </View>

        <View style={s.divider} />

        {/* ── COMING LIST ─────────────────────────────────────── */}
        {coming.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>COMING</Text>
              <Text style={[s.sectionTitle, { color: C.amber }]}>{coming.length}</Text>
            </View>
            {coming.map((p, i) => (
              <View key={p.name}>
                <View style={s.playerRow}>
                  <View style={s.playerLeft}>
                    <Avatar name={p.name} size={32} />
                    <Text style={s.playerName}>{p.name.toUpperCase()}</Text>
                  </View>
                  <Text style={s.playerTime}>{p.time || "6PM"}</Text>
                </View>
                <View style={s.divider} />
              </View>
            ))}
          </>
        )}

        {/* ── NOT COMING ──────────────────────────────────────── */}
        {notComing.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={[s.sectionTitle, { color: C.gray }]}>NOT COMING</Text>
              <Text style={[s.sectionTitle, { color: C.gray }]}>{notComing.length}</Text>
            </View>
            {notComing.map((p) => (
              <View key={p.name}>
                <View style={s.playerRow}>
                  <View style={s.playerLeft}>
                    <Avatar name={p.name} size={32} />
                    <Text style={[s.playerName, { color: C.gray }]}>{p.name.toUpperCase()}</Text>
                  </View>
                  <Text style={[s.playerTime, { color: C.red }]}>✕</Text>
                </View>
                <View style={s.divider} />
              </View>
            ))}
          </>
        )}

      </ScrollView>

      {/* ── TIME MODAL ──────────────────────────────────────────── */}
      <Modal visible={showTimeModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.modalWrap}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>ARRIVAL TIME</Text>
            <Text style={s.modalSub}>When are you coming? (leave blank for 6PM)</Text>
            <View style={s.divider} />
            <TextInput
              style={s.input}
              placeholder="e.g.  6:30,  after dinner..."
              placeholderTextColor={C.gray}
              value={arrivalTime}
              onChangeText={setArrivalTime}
              autoFocus
              maxLength={30}
            />
            <View style={s.divider} />
            <TouchableOpacity style={s.sheetBtn} onPress={handleConfirm} activeOpacity={0.8}>
              <Text style={s.sheetBtnText}>CONFIRM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setShowTimeModal(false)}>
              <Text style={s.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content:{ paddingBottom: 100 },

  // Header
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
  appName:     { fontSize: 28, fontWeight: F.black, color: C.white, letterSpacing: 4 },
  headerDate:  { fontSize: 11, fontWeight: F.semi, color: C.gray, letterSpacing: 1.5, marginTop: 4 },
  myStatusChip:{ fontSize: 12, fontWeight: F.bold, letterSpacing: 1 },

  divider: { height: 1, backgroundColor: C.line },

  // Stats
  statsRow:  { flexDirection: "row" },
  statBlock: { flex: 1, alignItems: "center", paddingVertical: 24 },
  statNum:   { fontSize: 44, fontWeight: F.black, letterSpacing: -1, lineHeight: 50 },
  statLabel: { fontSize: 10, fontWeight: F.bold, color: C.gray, letterSpacing: 2, marginTop: 4 },

  // Buttons
  btnRow:    { flexDirection: "row" },
  yesBtn:    { flex: 1, backgroundColor: C.amber, paddingVertical: 18, alignItems: "center", borderRightWidth: 1, borderRightColor: C.bg },
  yesBtnText:{ fontSize: 14, fontWeight: F.black, color: "#000", letterSpacing: 2 },
  noBtn:     { flex: 1, backgroundColor: C.surface, paddingVertical: 18, alignItems: "center" },
  noBtnText: { fontSize: 14, fontWeight: F.bold, color: C.gray, letterSpacing: 2 },

  // Section
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle:  { fontSize: 11, fontWeight: F.black, color: C.white, letterSpacing: 2 },

  // Player rows
  playerRow:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 },
  playerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  playerName: { fontSize: 14, fontWeight: F.bold, color: C.white, letterSpacing: 1 },
  playerTime: { fontSize: 12, fontWeight: F.semi, color: C.amber, letterSpacing: 1 },

  // Modal
  modalWrap: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  modal:     { backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line },
  modalTitle:{ fontSize: 16, fontWeight: F.black, color: C.white, letterSpacing: 3, padding: 20, paddingBottom: 4 },
  modalSub:  { fontSize: 12, color: C.gray, letterSpacing: 0.5, paddingHorizontal: 20, paddingBottom: 16 },
  input:     { fontSize: 16, color: C.white, letterSpacing: 0.5, padding: 20, backgroundColor: C.surface },
  sheetBtn:  { backgroundColor: C.amber, paddingVertical: 18, alignItems: "center" },
  sheetBtnText: { fontSize: 14, fontWeight: F.black, color: "#000", letterSpacing: 3 },
  cancelBtn: { paddingVertical: 18, alignItems: "center", backgroundColor: C.bg },
  cancelText:{ fontSize: 13, fontWeight: F.bold, color: C.gray, letterSpacing: 2 },
});