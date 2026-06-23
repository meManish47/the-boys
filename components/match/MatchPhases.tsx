import { Text, TouchableOpacity, View } from "react-native";
import { C, F } from "../../constants/theme";
import { M } from "./matchStyles";

// ─── StartPending ─────────────────────────────────────────────────────────────
function StartPending({ match, startRequestedByMe, isCaptain, otherCaptainName, onConfirm, onReject }: any) {
  if (!match) return null;
  return (
    <>
      <View style={[M.liveBox, { borderTopWidth: 1, borderTopColor: C.amber }]}>
        <Text style={M.liveLabel}>MATCH START REQUESTED</Text>
        {startRequestedByMe ? (
          <Text style={M.waitText}>WAITING FOR {otherCaptainName?.toUpperCase()}...</Text>
        ) : isCaptain ? (
          <>
            <Text style={[M.liveText, { fontSize: 13, color: C.gray, marginBottom: 8 }]}>
              {match.startRequestBy?.toUpperCase()} WANTS TO START
            </Text>
            <TouchableOpacity style={[M.amberBtn, { width: "100%" }]} onPress={onConfirm} activeOpacity={0.75}>
              <Text style={M.amberBtnText}>LET'S GO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={M.ghostBtn} onPress={onReject}>
              <Text style={M.dangerText}>NOT YET</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={M.waitText}>CAPTAINS CONFIRMING START...</Text>
        )}
      </View>
      <View style={M.divider} />
    </>
  );
}

// ─── PlayingPhase ─────────────────────────────────────────────────────────────
function PlayingPhase({ isCaptain, onSubmitResult }: any) {
  return (
    <>
      <View style={[M.liveBox, { borderTopWidth: 3, borderTopColor: C.amber }]}>
        <Text style={M.liveLabel}>● LIVE</Text>
        <Text style={M.liveText}>MATCH IN PROGRESS</Text>
      </View>
      <View style={M.divider} />
      {isCaptain && (
        <>
          <View style={M.sectionRow}>
            <Text style={M.sectionLbl}>REPORT RESULT</Text>
          </View>
          <View style={M.divider} />
          {["teamA", "teamB", "draw"].map((r) => (
            <View key={r}>
              <TouchableOpacity
                style={[M.pickRow, r === "draw" && { opacity: 0.7 }]}
                onPress={() => onSubmitResult(r as any)}
                activeOpacity={0.7}
              >
                <Text style={[M.pickName, r === "draw" && { color: C.gray }]}>
                  {r === "teamA" ? "TEAM A WON" : r === "teamB" ? "TEAM B WON" : "DRAW"}
                </Text>
                <Text style={[M.pickIcon, r === "draw" && { color: C.gray }]}>→</Text>
              </TouchableOpacity>
              <View style={M.divider} />
            </View>
          ))}
        </>
      )}
    </>
  );
}

// ─── ResultPending ────────────────────────────────────────────────────────────
function ResultPending({ match, resultSubmittedByMe, isCaptain, resultLabel, onConfirm, onReject }: any) {
  if (!match) return null;
  const label = resultLabel(match?.pendingResult);
  return (
    <>
      <View style={M.sectionRow}>
        <Text style={M.sectionLbl}>RESULT PENDING CONFIRMATION</Text>
      </View>
      <View style={M.divider} />
      <View style={M.liveBox}>
        <Text style={M.liveLabel}>REPORTED BY {match?.pendingResultBy?.toUpperCase()}</Text>
        <Text style={M.liveText}>{label.toUpperCase()}</Text>
      </View>
      <View style={M.divider} />
      {resultSubmittedByMe ? (
        <Text style={M.waitText}>WAITING FOR OTHER CAPTAIN TO CONFIRM...</Text>
      ) : isCaptain ? (
        <>
          <TouchableOpacity style={M.amberBtn} onPress={onConfirm} activeOpacity={0.75}>
            <Text style={M.amberBtnText}>CONFIRM RESULT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={M.ghostBtn} onPress={onReject}>
            <Text style={M.dangerText}>DISAGREE</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={M.waitText}>CAPTAINS CONFIRMING...</Text>
      )}
      <View style={M.divider} />
    </>
  );
}

// ─── AmountPhase ──────────────────────────────────────────────────────────────
function AmountPhase({ match, iAmWinner, iAmLoser, winningCaptain, onEnterAmount, onConfirmAmount, onRejectAmount, resultLabel }: any) {
  if (!match) return null;

  if (match.status === "amount_pending") {
    return (
      <>
        <View style={M.sectionRow}>
          <Text style={M.sectionLbl}>SETTLEMENT</Text>
          <Text style={M.sectionVal}>{resultLabel(match?.result).toUpperCase()}</Text>
        </View>
        <View style={M.divider} />
        {iAmWinner ? (
          <>
            <View style={M.infoBlock}>
              <Text style={M.infoSub}>Enter total innings amount your team won</Text>
            </View>
            <View style={M.divider} />
            <TouchableOpacity style={M.amberBtn} onPress={onEnterAmount} activeOpacity={0.75}>
              <Text style={M.amberBtnText}>ENTER AMOUNT WON</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={M.waitText}>WAITING FOR WINNING CAPTAIN TO ENTER AMOUNT...</Text>
        )}
        <View style={M.divider} />
      </>
    );
  }

  if (match.status === "amount_confirm_pending") {
    return (
      <>
        <View style={M.sectionRow}>
          <Text style={M.sectionLbl}>CONFIRM AMOUNT</Text>
        </View>
        <View style={M.divider} />
        <View style={M.bigAmountWrap}>
          <Text style={M.bigAmount}>₹{match?.pendingAmount}</Text>
          <Text style={M.bigAmountLbl}>CLAIMED BY {winningCaptain?.toUpperCase()}'S TEAM</Text>
        </View>
        <View style={M.divider} />
        {iAmLoser ? (
          <>
            <TouchableOpacity style={M.amberBtn} onPress={onConfirmAmount} activeOpacity={0.75}>
              <Text style={M.amberBtnText}>AGREE · I'LL PAY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={M.ghostBtn} onPress={onRejectAmount}>
              <Text style={M.dangerText}>DISPUTE AMOUNT</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={M.waitText}>WAITING FOR LOSING CAPTAIN TO CONFIRM...</Text>
        )}
        <View style={M.divider} />
      </>
    );
  }
  return null;
}

// ─── PaymentPhase ─────────────────────────────────────────────────────────────
function PaymentPhase({ match, iAmWinner, iAmLoser, winningCaptain, losingCaptain, onEnterPaid, onConfirmPaid, onRejectPaid }: any) {
  if (!match) return null;

  if (match.status === "paid_pending") {
    return (
      <>
        <View style={M.sectionRow}>
          <Text style={M.sectionLbl}>PAYMENT</Text>
          <Text style={M.sectionVal}>DUE ₹{match?.amountWon}</Text>
        </View>
        <View style={M.divider} />
        {iAmLoser ? (
          <>
            <View style={M.infoBlock}>
              <Text style={M.infoSub}>How much have you paid so far?</Text>
            </View>
            <View style={M.divider} />
            <TouchableOpacity style={M.amberBtn} onPress={onEnterPaid} activeOpacity={0.75}>
              <Text style={M.amberBtnText}>ENTER AMOUNT PAID</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={M.waitText}>WAITING FOR {losingCaptain?.toUpperCase()} TO ENTER PAYMENT...</Text>
        )}
        <View style={M.divider} />
      </>
    );
  }

  if (match.status === "paid_confirm_pending") {
    return (
      <>
        <View style={M.sectionRow}>
          <Text style={M.sectionLbl}>PAYMENT RECEIVED?</Text>
        </View>
        <View style={M.divider} />
        <View style={M.bigAmountWrap}>
          <Text style={[M.bigAmount, { color: C.green }]}>₹{match?.amountPaid}</Text>
          <Text style={M.bigAmountLbl}>PAID BY {losingCaptain?.toUpperCase()}</Text>
        </View>
        <View style={M.divider} />
        {iAmWinner ? (
          <>
            <TouchableOpacity style={M.amberBtn} onPress={onConfirmPaid} activeOpacity={0.75}>
              <Text style={M.amberBtnText}>YES · RECEIVED</Text>
            </TouchableOpacity>
            <TouchableOpacity style={M.ghostBtn} onPress={onRejectPaid}>
              <Text style={M.dangerText}>NOT YET</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={M.waitText}>WAITING FOR {winningCaptain?.toUpperCase()} TO CONFIRM...</Text>
        )}
        <View style={M.divider} />
      </>
    );
  }
  return null;
}

// ─── FinishedBanner ───────────────────────────────────────────────────────────
function FinishedBanner({ match, resultLabel }: any) {
  if (!match) return null;
  const won = match?.amountWon ?? 0;
  const paid = match?.amountPaid ?? 0;
  const left = won - paid;
  const label = resultLabel(match?.result);

  return (
    <>
      <View style={[M.liveBox, { borderTopWidth: 3, borderTopColor: C.amber }]}>
        <Text style={M.liveLabel}>FULL TIME</Text>
        <Text style={M.liveText}>{label.toUpperCase()}</Text>
      </View>
      <View style={M.divider} />
      {won > 0 && (
        <>
          <View style={M.finishRow}>
            <View style={M.finishCell}>
              <Text style={[M.finishNum, { color: C.amber }]}>₹{won}</Text>
              <Text style={M.finishLbl}>WON</Text>
            </View>
            <View style={M.finishCell}>
              <Text style={[M.finishNum, { color: C.green }]}>₹{paid}</Text>
              <Text style={M.finishLbl}>PAID</Text>
            </View>
            <View style={[M.finishCell, { borderRightWidth: 0 }]}>
              <Text style={[M.finishNum, { color: left > 0 ? C.red : C.green }]}>
                {left > 0 ? `₹${left}` : "✓"}
              </Text>
              <Text style={M.finishLbl}>{left > 0 ? "LEFT" : "SETTLED"}</Text>
            </View>
          </View>
          <View style={M.divider} />
        </>
      )}
    </>
  );
}

// ─── MatchPhases (main export) ────────────────────────────────────────────────
interface MatchPhasesProps {
  match: any; isCaptain: boolean; iAmWinner: boolean; iAmLoser: boolean;
  winningCaptain: string | null; losingCaptain: string | null;
  startRequestedByMe: boolean; resultSubmittedByMe: boolean;
  otherCaptainName: string; resultLabel: (r: string) => string;
  onConfirmStart: () => void; onRejectStart: () => void;
  onSubmitResult: (r: "teamA" | "teamB" | "draw") => void;
  onConfirmResult: () => void; onRejectResult: () => void;
  onEnterAmount: () => void; onConfirmAmount: () => void; onRejectAmount: () => void;
  onEnterPaid: () => void; onConfirmPaid: () => void; onRejectPaid: () => void;
}

export function MatchPhases(p: MatchPhasesProps) {
  const { match, resultLabel } = p;
  if (!match) return null;
  const st = match.status;

  if (st === "start_pending")
    return <StartPending match={match} startRequestedByMe={p.startRequestedByMe} isCaptain={p.isCaptain} otherCaptainName={p.otherCaptainName} onConfirm={p.onConfirmStart} onReject={p.onRejectStart} />;
  if (st === "playing")
    return <PlayingPhase isCaptain={p.isCaptain} onSubmitResult={p.onSubmitResult} />;
  if (st === "result_pending")
    return <ResultPending match={match} resultSubmittedByMe={p.resultSubmittedByMe} isCaptain={p.isCaptain} resultLabel={resultLabel} onConfirm={p.onConfirmResult} onReject={p.onRejectResult} />;
  if (st === "amount_pending" || st === "amount_confirm_pending")
    return <AmountPhase match={match} iAmWinner={p.iAmWinner} iAmLoser={p.iAmLoser} winningCaptain={p.winningCaptain} onEnterAmount={p.onEnterAmount} onConfirmAmount={p.onConfirmAmount} onRejectAmount={p.onRejectAmount} resultLabel={resultLabel} />;
  if (st === "paid_pending" || st === "paid_confirm_pending")
    return <PaymentPhase match={match} iAmWinner={p.iAmWinner} iAmLoser={p.iAmLoser} winningCaptain={p.winningCaptain} losingCaptain={p.losingCaptain} onEnterPaid={p.onEnterPaid} onConfirmPaid={p.onConfirmPaid} onRejectPaid={p.onRejectPaid} />;
  if (st === "finished")
    return <FinishedBanner match={match} resultLabel={resultLabel} />;
  return null;
}
