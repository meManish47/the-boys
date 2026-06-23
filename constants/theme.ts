// ─── Scoreboard Design Tokens ─────────────────────────────────────────────────
export const C = {
  bg:        "#000000",
  surface:   "#0A0A0A",
  line:      "#222222",
  lineHard:  "#333333",

  amber:     "#F59E0B",
  amberDim:  "#7A4E00",

  white:     "#FFFFFF",
  gray:      "#666666",
  grayLight: "#999999",

  green:     "#22C55E",
  red:       "#EF4444",
  blue:      "#3B82F6",
};

export const F = {
  black:    "900" as const,
  bold:     "700" as const,
  semi:     "600" as const,
  medium:   "500" as const,
  regular:  "400" as const,
};

// deterministic color per player name (for avatar bg)
const AVATAR_COLORS = ["#F59E0B","#EF4444","#8B5CF6","#3B82F6","#22C55E","#EC4899","#06B6D4","#F97316"];
export function avatarColor(name: string): string {
  if (!name) return AVATAR_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
export function initials(name: string): string {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]?.toUpperCase()).slice(0, 2).join("");
}
