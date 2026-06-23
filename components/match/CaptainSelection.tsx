import { Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "../Avatar";
import { C } from "../../constants/theme";
import { M } from "./matchStyles";

interface CaptainSelectionProps {
  match: any;
  isCaptain: boolean;
  isCaptainA: boolean;
  onBecomeCaptain: () => void;
  onLeaveCaptain: () => void;
}

export function CaptainSelection({ match, isCaptain, isCaptainA, onBecomeCaptain, onLeaveCaptain }: CaptainSelectionProps) {
  if (isCaptain && !match) return null;

  return (
    <>
      <View style={M.infoBlock}>
        <Text style={M.infoTitle}>
          {!match ? "NO CAPTAINS YET" : `CAPTAIN A · ${match.captainA.toUpperCase()}`}
        </Text>
        <Text style={M.infoSub}>
          {!match
            ? "First two players to tap become captains"
            : "Waiting for Captain B to step up..."}
        </Text>
      </View>
      <View style={M.divider} />

      {!isCaptain && (
        <TouchableOpacity style={M.amberBtn} onPress={onBecomeCaptain} activeOpacity={0.75}>
          <Text style={M.amberBtnText}>BECOME CAPTAIN</Text>
        </TouchableOpacity>
      )}

      {isCaptain && (
        <>
          <Text style={M.amberText}>YOU ARE CAPTAIN {isCaptainA ? "A" : "B"}</Text>
          <View style={M.divider} />
          <TouchableOpacity style={M.ghostBtn} onPress={onLeaveCaptain}>
            <Text style={M.dangerText}>LEAVE CAPTAIN ROLE</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={M.divider} />
    </>
  );
}
