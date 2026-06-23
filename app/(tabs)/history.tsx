import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { db } from "../../firebase";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MatchRecord {
  captainA: string;
  captainB: string;
  teamA: string[] | Record<string, string>;
  teamB: string[] | Record<string, string>;
  status: string;
  result: string;
  amountWon: number;
  amountPaid: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return Object.values(val);
  return [];
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
    .toUpperCase();
}

function formatLongDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    .toUpperCase();
}

type Status = "winA" | "winB" | "draw" | "live" | "pending";

function getStatus(r: MatchRecord): Status {
  if (!r) return "pending";
  if (r.status === "finished") {
    if (r.result === "teamA") return "winA";
    if (r.result === "teamB") return "winB";
    return "draw";
  }
  if (r.status === "playing" || r.status === "start_pending") return "live";
  return "pending";
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
  visible,
  record,
  date,
  onClose,
}: {
  visible: boolean;
  record: MatchRecord | null;
  date: string;
  onClose: () => void;
}) {
  // useState for Animated.Value — compatible with React Compiler
  const [slideAnim] = useState(() => new Animated.Value(600));

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(600);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible]);

  if (!record) return null;

  const status = getStatus(record);
  const teamA = toArray(record.teamA);
  const teamB = toArray(record.teamB);
  const won = record.amountWon ?? 0;
  const paid = record.amountPaid ?? 0;
  const left = Math.max(won - paid, 0);
  const isWin = status === "winA" || status === "winB";
  const isDraw = status === "draw";
  const isLive = status === "live";

  const resultLabel =
    status === "winA"
      ? `TEAM A (${record.captainA?.toUpperCase()}) WON`
      : status === "winB"
      ? `TEAM B (${record.captainB?.toUpperCase()}) WON`
      : status === "draw"
      ? "DRAW"
      : isLive
      ? "● LIVE"
      : "IN PROGRESS";

  const resultColor =
    isWin ? "#F59E0B" : isLive ? "#F59E0B" : "#888888";

  const owesLine =
    status === "winA"
      ? `TEAM B OWES TEAM A`
      : status === "winB"
      ? `TEAM A OWES TEAM B`
      : null;

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 700,
      duration: 180,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={d.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View style={[d.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={d.handleArea}>
          <View style={d.handle} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* Date + Status row */}
          <View style={d.topRow}>
            <Text style={d.dateText}>{formatLongDate(date)}</Text>
            <Text style={[d.statusLabel, { color: isLive ? "#F59E0B" : "#555" }]}>
              {isLive ? "● LIVE" : "FINAL"}
            </Text>
          </View>

          <View style={d.divider} />

          {/* Teams */}
          <View style={d.teamsRow}>
            {/* Team A */}
            <View style={[d.teamCol, status === "winA" && d.winnerCol]}>
              <Text style={d.teamLbl}>TEAM A {status === "winA" ? "🏆" : ""}</Text>
              <View style={d.captainRow}>
                <Text style={d.crown}>👑</Text>
                <Text style={d.captainName}>{record.captainA?.toUpperCase()}</Text>
              </View>
              {teamA
                .filter((p) => p !== record.captainA)
                .map((p) => (
                  <Text key={p} style={d.member}>{"  "}{p.toUpperCase()}</Text>
                ))}
            </View>

            <View style={d.vsSep} />

            {/* Team B */}
            <View style={[d.teamCol, d.teamColB, status === "winB" && d.winnerCol]}>
              <Text style={d.teamLbl}>TEAM B {status === "winB" ? "🏆" : ""}</Text>
              <View style={d.captainRow}>
                <Text style={d.crown}>👑</Text>
                <Text style={d.captainName}>{record.captainB?.toUpperCase()}</Text>
              </View>
              {teamB
                .filter((p) => p !== record.captainB)
                .map((p) => (
                  <Text key={p} style={d.member}>{"  "}{p.toUpperCase()}</Text>
                ))}
            </View>
          </View>

          <View style={d.divider} />

          {/* Result */}
          <View style={d.resultRow}>
            <Text style={[d.resultText, { color: resultColor }]}>{resultLabel}</Text>
          </View>

          {/* Money — only if finished + not draw + amount set */}
          {isWin && won > 0 && (
            <>
              <View style={d.divider} />
              <View style={d.moneyRow}>
                <View style={d.moneyCell}>
                  <Text style={[d.moneyNum, { color: "#F59E0B" }]}>₹{won}</Text>
                  <Text style={d.moneyLbl}>WON</Text>
                </View>
                <View style={d.moneySep} />
                <View style={d.moneyCell}>
                  <Text style={[d.moneyNum, { color: "#22C55E" }]}>₹{paid}</Text>
                  <Text style={d.moneyLbl}>PAID</Text>
                </View>
                <View style={d.moneySep} />
                <View style={d.moneyCell}>
                  <Text style={[d.moneyNum, { color: left > 0 ? "#EF4444" : "#22C55E" }]}>
                    {left > 0 ? `₹${left}` : "✓"}
                  </Text>
                  <Text style={d.moneyLbl}>{left > 0 ? "LEFT" : "SETTLED"}</Text>
                </View>
              </View>

              {left > 0 && owesLine && (
                <>
                  <View style={d.divider} />
                  <View style={d.owesRow}>
                    <Text style={d.owesText}>
                      {owesLine}{" "}
                      <Text style={{ color: "#EF4444" }}>₹{left}</Text>
                    </Text>
                  </View>
                </>
              )}
            </>
          )}

          <View style={{ height: 48 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────
function MatchCard({
  date,
  record,
  onPress,
}: {
  date: string;
  record: MatchRecord;
  onPress: () => void;
}) {
  if (!record) return null;
  const status = getStatus(record);
  const isWin = status === "winA" || status === "winB";
  const isLive = status === "live";
  const won = record.amountWon ?? 0;
  const paid = record.amountPaid ?? 0;
  const left = Math.max(won - paid, 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={c.card}>
      {/* Amber win bar */}
      {isWin && <View style={c.winBar} />}

      <View style={c.inner}>
        {/* Top: date + status */}
        <View style={c.topRow}>
          <Text style={c.dateText}>{formatShortDate(date)}</Text>
          {isLive ? (
            <Text style={c.liveChip}>● LIVE</Text>
          ) : (
            <Text style={c.finalChip}>FINAL</Text>
          )}
        </View>

        {/* Captains row */}
        <View style={c.captainsRow}>
          <Text style={c.captainA} numberOfLines={1}>
            {record.captainA?.toUpperCase()}
          </Text>
          <Text style={c.vs}>VS</Text>
          <Text style={c.captainB} numberOfLines={1}>
            {record.captainB?.toUpperCase()}
          </Text>
        </View>

        {/* Money strip */}
        {isWin && won > 0 && (
          <>
            <View style={c.innerLine} />
            <View style={c.moneyStrip}>
              <Text style={c.moneyWon}>₹{won} WON</Text>
              {left > 0 ? (
                <Text style={c.moneyLeft}>₹{left} REMAINING</Text>
              ) : (
                <Text style={c.moneyClear}>SETTLED ✓</Text>
              )}
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function History() {
  const [history, setHistory] = useState<Record<string, MatchRecord>>({});
  const [selected, setSelected] = useState<{ date: string; record: MatchRecord } | null>(null);

  useEffect(() => {
    const unsub = onValue(ref(db, "matches"), (snap) => {
      setHistory(snap.val() || {});
    });
    return () => unsub();
  }, []);

  const dates = Object.keys(history).sort((a, b) => b.localeCompare(a));

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>HISTORY</Text>
          <Text style={s.sub}>{dates.length} MATCHES PLAYED</Text>
        </View>
        <View style={s.divider} />

        {dates.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyNum}>00</Text>
            <Text style={s.emptyLbl}>NO MATCHES YET</Text>
          </View>
        )}

        {dates.map((date) => (
          <View key={date}>
            <MatchCard
              date={date}
              record={history[date]}
              onPress={() => setSelected({ date, record: history[date] })}
            />
            <View style={s.divider} />
          </View>
        ))}
      </ScrollView>

      <DetailModal
        visible={!!selected}
        record={selected?.record ?? null}
        date={selected?.date ?? ""}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#000" },
  scroll:  { flex: 1 },
  content: { paddingBottom: 100 },
  divider: { height: 1, backgroundColor: "#1A1A1A" },
  header:  { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
  title:   { fontSize: 28, fontWeight: "900", color: "#FFF", letterSpacing: 4 },
  sub:     { fontSize: 11, color: "#888", letterSpacing: 2, marginTop: 4 },
  empty:    { alignItems: "center", paddingTop: 100 },
  emptyNum: { fontSize: 72, fontWeight: "900", color: "#1A1A1A" },
  emptyLbl: { fontSize: 11, color: "#444", letterSpacing: 3, marginTop: 8 },
});

const c = StyleSheet.create({
  card:        { flexDirection: "row", backgroundColor: "#000" },
  winBar:      { width: 4, backgroundColor: "#F59E0B" },
  inner:       { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  topRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  dateText:    { fontSize: 10, fontWeight: "700", color: "#888", letterSpacing: 1.5 },
  liveChip:    { fontSize: 10, fontWeight: "900", color: "#F59E0B", letterSpacing: 1.5 },
  finalChip:   { fontSize: 10, fontWeight: "700", color: "#444", letterSpacing: 1.5 },
  captainsRow: { flexDirection: "row", alignItems: "center" },
  captainA:    { flex: 1, fontSize: 16, fontWeight: "900", color: "#FFF", letterSpacing: 0.5 },
  vs:          { fontSize: 10, fontWeight: "900", color: "#444", letterSpacing: 2, paddingHorizontal: 10 },
  captainB:    { flex: 1, fontSize: 16, fontWeight: "900", color: "#FFF", letterSpacing: 0.5, textAlign: "right" },
  innerLine:   { height: 1, backgroundColor: "#1A1A1A", marginTop: 12, marginBottom: 10 },
  moneyStrip:  { flexDirection: "row", justifyContent: "space-between" },
  moneyWon:    { fontSize: 11, fontWeight: "700", color: "#F59E0B", letterSpacing: 1 },
  moneyLeft:   { fontSize: 11, fontWeight: "700", color: "#EF4444", letterSpacing: 1 },
  moneyClear:  { fontSize: 11, fontWeight: "700", color: "#22C55E", letterSpacing: 1 },
});

const d = StyleSheet.create({
  backdrop:   { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.8)" },
  sheet:      { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#0E0E0E", borderTopWidth: 1, borderTopColor: "#1A1A1A", maxHeight: "88%" },
  handleArea: { alignItems: "center", paddingTop: 12, paddingBottom: 8 },
  handle:     { width: 36, height: 3, backgroundColor: "#333" },
  divider:    { height: 1, backgroundColor: "#1A1A1A" },

  topRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 },
  dateText:    { fontSize: 12, fontWeight: "700", color: "#888", letterSpacing: 1.5 },
  statusLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 2 },

  teamsRow:    { flexDirection: "row" },
  teamCol:     { flex: 1, paddingHorizontal: 20, paddingVertical: 20, gap: 6 },
  teamColB:    {},
  winnerCol:   { borderLeftWidth: 3, borderLeftColor: "#F59E0B", paddingLeft: 17 },
  teamLbl:     { fontSize: 10, fontWeight: "900", color: "#888", letterSpacing: 2, marginBottom: 4 },
  captainRow:  { flexDirection: "row", alignItems: "center", gap: 4 },
  crown:       { fontSize: 13 },
  captainName: { fontSize: 14, fontWeight: "900", color: "#FFF", letterSpacing: 0.5 },
  member:      { fontSize: 12, color: "#666", letterSpacing: 0.5 },
  vsSep:       { width: 1, backgroundColor: "#1A1A1A" },

  resultRow:   { paddingHorizontal: 20, paddingVertical: 16 },
  resultText:  { fontSize: 14, fontWeight: "900", letterSpacing: 1.5 },

  moneyRow:    { flexDirection: "row" },
  moneyCell:   { flex: 1, alignItems: "center", paddingVertical: 20 },
  moneySep:    { width: 1, backgroundColor: "#1A1A1A" },
  moneyNum:    { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  moneyLbl:    { fontSize: 9, fontWeight: "900", color: "#888", letterSpacing: 2, marginTop: 4 },

  owesRow:     { paddingHorizontal: 20, paddingVertical: 14 },
  owesText:    { fontSize: 12, color: "#888", fontWeight: "700", letterSpacing: 0.5 },
});
