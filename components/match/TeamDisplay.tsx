import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "../Avatar";
import { C, F } from "../../constants/theme";
import { M } from "./matchStyles";

interface TeamDisplayProps {
  match: any;
  isCaptainA?: boolean;
  isCaptainB?: boolean;
  onRemovePlayer?: (player: string, team: "teamA" | "teamB") => void;
  onMakeCaptain?: (player: string, team: "teamA" | "teamB") => void;
}

export function TeamDisplay({ match, isCaptainA, isCaptainB, onRemovePlayer, onMakeCaptain }: TeamDisplayProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  if (!match) return null;
  const winner = match.status === "finished" ? match.result : null;
  const canEdit = match.status === "selecting";

  const teamA = match.teamA || [];
  const teamB = match.teamB || [];

  return (
    <>
      <View style={M.teamsRow}>
        {/* Team A */}
        <View style={[M.teamCol, winner === "teamA" && { borderLeftWidth: 3, borderLeftColor: C.amber }]}>
          <Text style={M.teamLabel}>TEAM A{winner === "teamA" ? "  🏆" : ""}</Text>
          <View style={M.captainRow}>
            <Avatar name={match.captainA} size={28} />
            <View>
              <Text style={M.captainTag}>CAPTAIN</Text>
              <Text style={M.captainName}>{match.captainA.toUpperCase()}</Text>
            </View>
          </View>
          {teamA.filter((p: string) => p !== match.captainA).map((p: string) => (
            <View key={p}>
              <TouchableOpacity
                style={M.memberRow}
                onPress={() => (canEdit && isCaptainA) ? setSelectedPlayer(selectedPlayer === p ? null : p) : null}
                activeOpacity={canEdit && isCaptainA ? 0.6 : 1}
              >
                <Avatar name={p} size={20} />
                <Text style={M.memberName}>{p.toUpperCase()}</Text>
              </TouchableOpacity>
              {selectedPlayer === p && canEdit && isCaptainA && (
                <View style={M.actionRow}>
                  <TouchableOpacity
                    style={[M.actionBtn, M.removeBtn]}
                    onPress={() => { onRemovePlayer?.(p, "teamA"); setSelectedPlayer(null); }}
                  >
                    <Text style={[M.actionBtnText, M.removeText]}>REMOVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[M.actionBtn, M.captainBtn]}
                    onPress={() => { onMakeCaptain?.(p, "teamA"); setSelectedPlayer(null); }}
                  >
                    <Text style={[M.actionBtnText, M.captainText]}>MAKE CAPTAIN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* VS divider */}
        <View style={M.vsBox}>
          <Text style={M.vsText}>VS</Text>
        </View>

        {/* Team B */}
        <View style={[M.teamColLast, winner === "teamB" && { borderRightWidth: 3, borderRightColor: C.amber }]}>
          <Text style={M.teamLabel}>TEAM B{winner === "teamB" ? "  🏆" : ""}</Text>
          <View style={M.captainRow}>
            <Avatar name={match.captainB} size={28} />
            <View>
              <Text style={M.captainTag}>CAPTAIN</Text>
              <Text style={M.captainName}>{match.captainB.toUpperCase()}</Text>
            </View>
          </View>
          {teamB.filter((p: string) => p !== match.captainB).map((p: string) => (
            <View key={p}>
              <TouchableOpacity
                style={M.memberRow}
                onPress={() => (canEdit && isCaptainB) ? setSelectedPlayer(selectedPlayer === p ? null : p) : null}
                activeOpacity={canEdit && isCaptainB ? 0.6 : 1}
              >
                <Avatar name={p} size={20} />
                <Text style={M.memberName}>{p.toUpperCase()}</Text>
              </TouchableOpacity>
              {selectedPlayer === p && canEdit && isCaptainB && (
                <View style={M.actionRow}>
                  <TouchableOpacity
                    style={[M.actionBtn, M.removeBtn]}
                    onPress={() => { onRemovePlayer?.(p, "teamB"); setSelectedPlayer(null); }}
                  >
                    <Text style={[M.actionBtnText, M.removeText]}>REMOVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[M.actionBtn, M.captainBtn]}
                    onPress={() => { onMakeCaptain?.(p, "teamB"); setSelectedPlayer(null); }}
                  >
                    <Text style={[M.actionBtnText, M.captainText]}>MAKE CAPTAIN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
      <View style={M.divider} />
    </>
  );
}
