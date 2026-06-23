import { Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "../Avatar";
import { C } from "../../constants/theme";
import { M } from "./matchStyles";

interface PlayerPickerProps {
  isCaptainA: boolean;
  unassignedPlayers: string[];
  match: any;
  otherCaptainName: string;
  onPickPlayer: (player: string) => void;
}

export function PlayerPicker({
  isCaptainA, unassignedPlayers,
  match, otherCaptainName, onPickPlayer,
}: PlayerPickerProps) {
  if (!match) return null;

  if (unassignedPlayers.length > 0) {
    return (
      <>
        <View style={M.sectionRow}>
          <Text style={M.sectionLbl}>PICK FOR {isCaptainA ? "TEAM A" : "TEAM B"}</Text>
        </View>
        <View style={M.divider} />
        {unassignedPlayers.map((p, i) => (
          <View key={p}>
            <TouchableOpacity style={M.pickRow} onPress={() => onPickPlayer(p)} activeOpacity={0.7}>
              <Avatar name={p} size={28} />
              <Text style={M.pickName}>{p.toUpperCase()}</Text>
              <Text style={M.pickIcon}>+</Text>
            </TouchableOpacity>
            <View style={M.divider} />
          </View>
        ))}
      </>
    );
  }

  return null;
}
