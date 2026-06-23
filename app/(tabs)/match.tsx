import AsyncStorage from "@react-native-async-storage/async-storage";
import { onValue, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { AmountModal } from "../../components/match/AmountModal";
import { CaptainSelection } from "../../components/match/CaptainSelection";
import { MatchPhases } from "../../components/match/MatchPhases";
import { M } from "../../components/match/matchStyles";
import { PlayerPicker } from "../../components/match/PlayerPicker";
import { TeamDisplay } from "../../components/match/TeamDisplay";
import { C } from "../../constants/theme";
import { db } from "../../firebase";

export default function Match() {
  const [myName, setMyName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [match, setMatch] = useState<any>(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [amountWon, setAmountWon] = useState("");
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");

  const _d = new Date();
  const today = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, "0")}-${String(_d.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    AsyncStorage.getItem("player_name").then((n) => { if (n) setMyName(n); });
    onValue(ref(db, `sessions/${today}`), (snap) => {
      const data = snap.val() || {};
      setPlayers(Object.entries(data).filter(([_, v]: any) => v.coming).map(([n]: any) => n));
    });
    onValue(ref(db, `matches/${today}`), (snap) => setMatch(snap.val()));
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const isCaptainA = match?.captainA === myName;
  const isCaptainB = match?.captainB === myName;
  const isCaptain = isCaptainA || isCaptainB;
  const captainsSelected = !!(match?.captainA && match?.captainB);
  const unassignedPlayers = players.filter(
    (p) => ![...(match?.teamA || []), ...(match?.teamB || [])].includes(p)
  );
  const resultSubmittedByMe = match?.pendingResultBy === myName;
  const startRequestedByMe = match?.startRequestBy === myName;
  const otherCaptainName: string = isCaptainA ? match?.captainB : match?.captainA;
  const winningTeam = match?.result || match?.pendingResult;
  const winningCaptain: string | null = winningTeam === "teamA" ? match?.captainA : winningTeam === "teamB" ? match?.captainB : null;
  const losingCaptain: string | null = winningTeam === "teamA" ? match?.captainB : winningTeam === "teamB" ? match?.captainA : null;
  const iAmWinner = myName === winningCaptain;
  const iAmLoser = myName === losingCaptain;

  const resultLabel = (r: string) => {
    if (r === "teamA") return `Team A (${match?.captainA}) Won`;
    if (r === "teamB") return `Team B (${match?.captainB}) Won`;
    return "Draw";
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const becomeCaptain = async () => {
    if (!players.includes(myName)) { alert("Pehle attendance toh laga! 😄"); return; }
    if (!match) {
      await set(ref(db, `matches/${today}`), {
        captainA: myName, captainB: null,
        teamA: [myName], teamB: [],
        status: "selecting", readyA: false, readyB: false,
      });
    } else if (!match.captainB && match.captainA !== myName) {
      await set(ref(db, `matches/${today}/captainB`), myName);
      await set(ref(db, `matches/${today}/teamB`), [myName]);
    }
  };
  const leaveCaptain   = async () => set(ref(db, `matches/${today}`), null);
  const addToTeam      = async (player: string) => {
    if (!match) return;
    const team = isCaptainA ? "teamA" : "teamB";
    await set(ref(db, `matches/${today}/${team}`), [...(match[team] || []), player]);
  };
  const removePlayer   = async (player: string, team: "teamA" | "teamB") => {
    if (!match) return;
    const newTeam = (match[team] || []).filter((p: string) => p !== player);
    await set(ref(db, `matches/${today}/${team}`), newTeam);
  };
  const requestCaptain = async (player: string, team: "teamA" | "teamB") => {
    await set(ref(db, `matches/${today}/captainTransfer`), { to: player, team });
  };
  const acceptCaptain  = async () => {
    if (!match?.captainTransfer) return;
    const { team, to } = match.captainTransfer;
    await set(ref(db, `matches/${today}/captain${team === "teamA" ? "A" : "B"}`), to);
    await set(ref(db, `matches/${today}/captainTransfer`), null);
  };
  const rejectCaptain  = async () => {
    await set(ref(db, `matches/${today}/captainTransfer`), null);
  };
  const confirmStart   = async () => {
    await set(ref(db, `matches/${today}/status`), "playing");
    await set(ref(db, `matches/${today}/startRequestBy`), null);
  };
  const rejectStart    = async () => {
    await set(ref(db, `matches/${today}/status`), "selecting");
    await set(ref(db, `matches/${today}/startRequestBy`), null);
  };
  const submitResult   = async (result: "teamA" | "teamB" | "draw") => {
    await set(ref(db, `matches/${today}/status`), "result_pending");
    await set(ref(db, `matches/${today}/pendingResult`), result);
    await set(ref(db, `matches/${today}/pendingResultBy`), myName);
  };
  const confirmResult  = async () => {
    const res = match?.pendingResult;
    await set(ref(db, `matches/${today}/result`), res);
    await set(ref(db, `matches/${today}/status`), res === "draw" ? "finished" : "amount_pending");
  };
  const rejectResult   = async () => {
    await set(ref(db, `matches/${today}/status`), "playing");
    await set(ref(db, `matches/${today}/pendingResult`), null);
    await set(ref(db, `matches/${today}/pendingResultBy`), null);
  };
  const submitAmount   = async () => {
    await set(ref(db, `matches/${today}/pendingAmount`), Number(amountWon) || 0);
    await set(ref(db, `matches/${today}/status`), "amount_confirm_pending");
    setShowAmountModal(false); setAmountWon("");
  };
  const confirmAmount  = async () => {
    await set(ref(db, `matches/${today}/amountWon`), match?.pendingAmount);
    await set(ref(db, `matches/${today}/status`), "paid_pending");
  };
  const rejectAmount   = async () => {
    await set(ref(db, `matches/${today}/pendingAmount`), null);
    await set(ref(db, `matches/${today}/status`), "amount_pending");
  };
  const submitPaid     = async () => {
    await set(ref(db, `matches/${today}/amountPaid`), Number(amountPaid) || 0);
    await set(ref(db, `matches/${today}/status`), "paid_confirm_pending");
    setShowPaidModal(false); setAmountPaid("");
  };
  const confirmPaid    = async () => set(ref(db, `matches/${today}/status`), "finished");
  const rejectPaid     = async () => {
    await set(ref(db, `matches/${today}/amountPaid`), null);
    await set(ref(db, `matches/${today}/status`), "paid_pending");
  };

  return (
    <View style={M.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView style={M.scroll} contentContainerStyle={M.content} showsVerticalScrollIndicator={false}>

        <View style={M.header}>
          <Text style={M.title}>MATCH</Text>
          <Text style={M.dateText}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" }).toUpperCase()}
          </Text>
        </View>
        <View style={M.divider} />

        {!match && players.length === 0 && (
          <>
            <View style={M.infoBlock}>
              <Text style={M.infoTitle}>NO PLAYERS YET</Text>
              <Text style={M.infoSub}>Players need to mark attendance first</Text>
            </View>
            <View style={M.divider} />
          </>
        )}

        {/* Transfer Captaincy Banner */}
        {match?.captainTransfer?.to === myName && (
          <>
            <View style={[M.liveBox, { borderTopWidth: 3, borderTopColor: C.amber }]}>
              <Text style={M.liveLabel}>CAPTAINCY REQUEST</Text>
              <Text style={[M.liveText, { fontSize: 13, marginBottom: 8 }]}>
                YOU HAVE BEEN ASKED TO BE CAPTAIN OF {match.captainTransfer.team === "teamA" ? "TEAM A" : "TEAM B"}
              </Text>
              <TouchableOpacity style={[M.amberBtn, { width: "100%", marginBottom: 8 }]} onPress={acceptCaptain} activeOpacity={0.75}>
                <Text style={M.amberBtnText}>ACCEPT ROLE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={M.ghostBtn} onPress={rejectCaptain}>
                <Text style={M.dangerText}>DECLINE</Text>
              </TouchableOpacity>
            </View>
            <View style={M.divider} />
          </>
        )}

        {!captainsSelected && (
          <CaptainSelection
            match={match}
            isCaptain={isCaptain}
            isCaptainA={isCaptainA}
            onBecomeCaptain={becomeCaptain}
            onLeaveCaptain={leaveCaptain}
          />
        )}

        {captainsSelected && (
          <>
            <TeamDisplay 
              match={match} 
              isCaptainA={isCaptainA} 
              isCaptainB={isCaptainB}
              onRemovePlayer={removePlayer}
              onMakeCaptain={requestCaptain}
            />

            {/* Start Match Prompt */}
            {match?.status === "selecting" && (
              <>
                <View style={[M.liveBox, { borderTopWidth: 1, borderTopColor: C.amber }]}>
                  <Text style={M.liveLabel}>MATCH READY</Text>
                  {isCaptain ? (
                    <TouchableOpacity
                      style={[M.amberBtn, { width: "100%", marginTop: 8 }]}
                      onPress={() => update(ref(db, `matches/${today}`), { status: "start_pending", startRequestBy: myName })}
                      activeOpacity={0.75}
                    >
                      <Text style={M.amberBtnText}>REQUEST START MATCH</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={M.waitText}>CAPTAINS ARE PREPARING TO START...</Text>
                  )}
                </View>
                <View style={M.divider} />
              </>
            )}

            {isCaptain && match.status === "selecting" && (
              <PlayerPicker
                isCaptainA={isCaptainA}
                unassignedPlayers={unassignedPlayers}
                match={match}
                otherCaptainName={otherCaptainName}
                onPickPlayer={addToTeam}
              />
            )}
            {!isCaptain && match.status === "selecting" && (
              <>
                <View style={M.infoBlock}>
                  <Text style={M.infoTitle}>TEAM SELECTION</Text>
                  <Text style={M.infoSub}>Captains are picking their players...</Text>
                </View>
                <View style={M.divider} />
              </>
            )}

            <MatchPhases
              match={match} isCaptain={isCaptain}
              iAmWinner={iAmWinner} iAmLoser={iAmLoser}
              winningCaptain={winningCaptain} losingCaptain={losingCaptain}
              startRequestedByMe={startRequestedByMe} resultSubmittedByMe={resultSubmittedByMe}
              otherCaptainName={otherCaptainName} resultLabel={resultLabel}
              onConfirmStart={confirmStart} onRejectStart={rejectStart}
              onSubmitResult={submitResult} onConfirmResult={confirmResult} onRejectResult={rejectResult}
              onEnterAmount={() => setShowAmountModal(true)} onConfirmAmount={confirmAmount} onRejectAmount={rejectAmount}
              onEnterPaid={() => setShowPaidModal(true)} onConfirmPaid={confirmPaid} onRejectPaid={rejectPaid}
            />
          </>
        )}

      </ScrollView>

      <AmountModal visible={showAmountModal} title="AMOUNT WON" placeholder="0" value={amountWon} onChange={setAmountWon} onSubmit={submitAmount} onCancel={() => setShowAmountModal(false)} />
      <AmountModal visible={showPaidModal} title="AMOUNT PAID" placeholder="0" value={amountPaid} onChange={setAmountPaid} onSubmit={submitPaid} onCancel={() => setShowPaidModal(false)} />
    </View>
  );
}