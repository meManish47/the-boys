import { StyleSheet, Text, View } from "react-native";
import { avatarColor, C, F, initials } from "../constants/theme";

interface AvatarProps {
  name: string;
  size?: number;
  showName?: boolean;
}

export function Avatar({ name, size = 36, showName = false }: AvatarProps) {
  if (!name) return null;
  const bg = avatarColor(name);
  return (
    <View style={styles.wrap}>
      <View style={[styles.box, { width: size, height: size, backgroundColor: bg }]}>
        <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials(name)}</Text>
      </View>
      {showName && <Text style={styles.name}>{name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 3 },
  box: { justifyContent: "center", alignItems: "center" },
  initials: { color: "#000", fontWeight: F.black, letterSpacing: 0.5 },
  name: { fontSize: 10, color: C.gray, fontWeight: F.medium },
});
