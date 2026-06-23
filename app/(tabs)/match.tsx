import AsyncStorage from "@react-native-async-storage/async-storage";
import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase";

export default function Match() {
  const [myName, setMyName] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [match, setMatch] = useState<any>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    AsyncStorage.getItem("player_name").then((n) => {
      if (n) setMyName(n);
    });

    onValue(ref(db, `sessions/${today}`), (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .filter(([_, val]: any) => val.coming)
        .map(([name]: any) => name);
      setPlayers(list);
    });

    onValue(ref(db, `matches/${today}`), (snapshot) => {
      setMatch(snapshot.val());
    });
  }, []);

  const becomeCaptain = async () => {
    if (!players.includes(myName)) {
      alert("Pehle attendance toh laga! 😄");
      return;
    }
    if (!match) {
      await set(ref(db, `matches/${today}`), {
        captainA: myName,
        captainB: null,
        teamA: [myName],
        teamB: [],
        status: "selecting",
      });
    } else if (!match.captainB && match.captainA !== myName) {
      await set(ref(db, `matches/${today}/captainB`), myName);
      await set(ref(db, `matches/${today}/teamB`), [myName]);
    }
  };

  const leaveCaptain = async () => {
    await set(ref(db, `matches/${today}`), null);
  };

  const isCaptainA = match?.captainA === myName;
  const isCaptainB = match?.captainB === myName;
  const isCaptain = isCaptainA || isCaptainB;
  const captainsSelected = match?.captainA && match?.captainB;

  const addToTeam = async (player: string) => {
    const team = isCaptainA ? "teamA" : "teamB";
    const current = match[team] || [];
    await set(ref(db, `matches/${today}/${team}`), [...current, player]);
  };

  const unassignedPlayers = players.filter(
    (p) => ![...(match?.teamA || []), ...(match?.teamB || [])].includes(p)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏐 Match</Text>
      <Text style={styles.date}>{new Date().toDateString()}</Text>

      {!captainsSelected && (
        <>
          <Text style={styles.subtitle}>
            {!match
              ? "No captains yet — first two to tap become captains!"
              : `Captain A: ${match.captainA} — waiting for Captain B...`}
          </Text>

          {!isCaptain && (
            <TouchableOpacity style={styles.captainBtn} onPress={becomeCaptain}>
              <Text style={styles.btnText}>👑 Be Captain</Text>
            </TouchableOpacity>
          )}

          {isCaptain && !captainsSelected && (
            <>
              <Text style={styles.waitingText}>
                You are Captain {isCaptainA ? "A" : "B"}! Waiting for second captain...
              </Text>
              <TouchableOpacity style={styles.leaveBtn} onPress={leaveCaptain}>
                <Text style={styles.leaveBtnText}>❌ Leave Captain</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      {captainsSelected && (
        <>
          <View style={styles.teamsRow}>
            <View style={styles.teamBox}>
              <Text style={styles.teamTitle}>Team A</Text>
              <Text style={styles.captainName}>👑 {match.captainA}</Text>
              {(match.teamA || [])
                .filter((p: string) => p !== match.captainA)
                .map((p: string) => (
                  <Text key={p} style={styles.playerName}>{p}</Text>
                ))}
            </View>
            <View style={styles.teamBox}>
              <Text style={styles.teamTitle}>Team B</Text>
              <Text style={styles.captainName}>👑 {match.captainB}</Text>
              {(match.teamB || [])
                .filter((p: string) => p !== match.captainB)
                .map((p: string) => (
                  <Text key={p} style={styles.playerName}>{p}</Text>
                ))}
            </View>
          </View>

          {isCaptain && match.status === "selecting" && (
            <>
              <Text style={styles.subtitle}>
                Pick your players {isCaptainA ? "(Team A)" : "(Team B)"}:
              </Text>
              {unassignedPlayers.map((p: string) => (
                <TouchableOpacity key={p} style={styles.pickBtn} onPress={() => addToTeam(p)}>
                  <Text style={styles.btnText}>➕ {p}</Text>
                </TouchableOpacity>
              ))}
              {unassignedPlayers.length === 0 && (
                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={async () => {
                    await set(ref(db, `matches/${today}/status`), "playing");
                  }}
                >
                  <Text style={styles.btnText}>🏐 Start Match!</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {match.status === "playing" && (
            <View style={styles.playingBox}>
              <Text style={styles.playingText}>🏐 Match is live!</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold" },
  date: { color: "#666", marginBottom: 16 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 16 },
  captainBtn: { backgroundColor: "#f59e0b", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  waitingText: { color: "#22c55e", fontWeight: "bold", textAlign: "center", marginTop: 16 },
  leaveBtn: { alignItems: "center", marginTop: 12 },
  leaveBtnText: { color: "#ef4444", fontWeight: "bold" },
  teamsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  teamBox: { flex: 1, backgroundColor: "#f5f5f5", borderRadius: 12, padding: 12 },
  teamTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  captainName: { fontSize: 14, color: "#f59e0b", fontWeight: "bold", marginBottom: 4 },
  playerName: { fontSize: 14, marginBottom: 4 },
  pickBtn: { backgroundColor: "#6200ee", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 8 },
  startBtn: { backgroundColor: "#22c55e", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 12 },
  playingBox: { backgroundColor: "#22c55e", padding: 20, borderRadius: 16, alignItems: "center", marginTop: 16 },
  playingText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});