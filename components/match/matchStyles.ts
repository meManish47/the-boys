import { StyleSheet } from "react-native";
import { C, F } from "../../constants/theme";

export const M = StyleSheet.create({
  // Root
  root:    { flex: 1, backgroundColor: C.bg },
  scroll:  { flex: 1 },
  content: { paddingBottom: 100 },
  divider: { height: 1, backgroundColor: C.line },

  // Header
  header:     { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
  title:      { fontSize: 28, fontWeight: F.black, color: C.white, letterSpacing: 4 },
  dateText:   { fontSize: 11, fontWeight: F.semi, color: C.gray, letterSpacing: 1.5, marginTop: 4 },

  // Section label row
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10 },
  sectionLbl: { fontSize: 11, fontWeight: F.black, color: C.gray, letterSpacing: 2 },
  sectionVal: { fontSize: 11, fontWeight: F.black, color: C.amber, letterSpacing: 2 },

  // Generic full text block
  infoBlock: { paddingHorizontal: 16, paddingVertical: 20 },
  infoTitle: { fontSize: 15, fontWeight: F.black, color: C.white, letterSpacing: 1, marginBottom: 6 },
  infoSub:   { fontSize: 12, color: C.gray, letterSpacing: 0.5 },

  // Buttons
  amberBtn:     { backgroundColor: C.amber, paddingVertical: 18, paddingHorizontal: 16, alignItems: "center" },
  amberBtnText: { fontSize: 14, fontWeight: F.black, color: "#000", letterSpacing: 3 },
  ghostBtn:     { paddingVertical: 16, paddingHorizontal: 16, alignItems: "center", borderTopWidth: 1, borderTopColor: C.line },
  ghostBtnText: { fontSize: 13, fontWeight: F.bold, color: C.gray, letterSpacing: 2 },
  dangerText:   { fontSize: 13, fontWeight: F.bold, color: C.red, letterSpacing: 1 },

  // Team grid
  teamsRow:    { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.line },
  teamCol:     { flex: 1, padding: 16, borderRightWidth: 1, borderRightColor: C.line },
  teamColLast: { flex: 1, padding: 16 },
  teamLabel:   { fontSize: 10, fontWeight: F.black, color: C.gray, letterSpacing: 2, marginBottom: 8 },
  captainRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  captainTag:  { fontSize: 9, fontWeight: F.black, color: C.amber, letterSpacing: 1 },
  captainName: { fontSize: 14, fontWeight: F.bold, color: C.white, letterSpacing: 0.5 },
  memberRow:   { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  memberName:  { fontSize: 12, color: C.gray, letterSpacing: 0.5 },
  vsBox:       { paddingHorizontal: 6, justifyContent: "center", alignItems: "center", borderTopWidth: 0, paddingTop: 24 },
  vsText:      { fontSize: 10, fontWeight: F.black, color: C.gray, letterSpacing: 2 },

  // Player pick rows
  pickRow:     { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  pickName:    { fontSize: 14, fontWeight: F.bold, color: C.white, letterSpacing: 1, flex: 1 },
  pickIcon:    { fontSize: 18, color: C.amber },

  // Status box
  liveBox:     { paddingHorizontal: 16, paddingVertical: 24, alignItems: "center", gap: 6 },
  liveLabel:   { fontSize: 11, fontWeight: F.black, color: C.amber, letterSpacing: 3 },
  liveText:    { fontSize: 20, fontWeight: F.black, color: C.white, letterSpacing: 1, textAlign: "center" },

  // Amount display
  bigAmountWrap: { alignItems: "center", paddingVertical: 24 },
  bigAmount:     { fontSize: 52, fontWeight: F.black, color: C.amber, letterSpacing: -1 },
  bigAmountLbl:  { fontSize: 11, color: C.gray, letterSpacing: 2 },

  // Finished
  finishRow:  { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.line },
  finishCell: { flex: 1, alignItems: "center", paddingVertical: 20, borderRightWidth: 1, borderRightColor: C.line },
  finishNum:  { fontSize: 28, fontWeight: F.black, letterSpacing: -0.5 },
  finishLbl:  { fontSize: 9, fontWeight: F.black, color: C.gray, letterSpacing: 2, marginTop: 2 },

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 30, // align with member name
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: C.lineHard,
  },
  actionBtnText: {
    fontSize: 9,
    fontWeight: F.bold,
    color: C.white,
    letterSpacing: 1,
  },
  removeBtn: {
    backgroundColor: C.red + "20",
    borderWidth: 1,
    borderColor: C.red + "50",
  },
  removeText: {
    color: C.red,
  },
  captainBtn: {
    backgroundColor: C.amber + "20",
    borderWidth: 1,
    borderColor: C.amber + "50",
  },
  captainText: {
    color: C.amber,
  },

  // Modal
  modalWrap:  { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  modal:      { backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line },
  modalTitle: { fontSize: 16, fontWeight: F.black, color: C.white, letterSpacing: 3, padding: 20, paddingBottom: 4 },
  modalSub:   { fontSize: 12, color: C.gray, paddingHorizontal: 20, paddingBottom: 16 },
  modalInput: { fontSize: 16, color: C.white, padding: 20, backgroundColor: C.surface },

  // Waiting text
  waitText:  { textAlign: "center", fontSize: 13, color: C.gray, letterSpacing: 1, paddingVertical: 16, paddingHorizontal: 16 },
  amberText: { textAlign: "center", fontSize: 13, color: C.amber, letterSpacing: 1, paddingVertical: 16, paddingHorizontal: 16, fontWeight: F.bold },

  // Used by AmountModal
  cancelBtn:  { paddingVertical: 18, alignItems: "center", backgroundColor: C.bg },
  cancelText: { fontSize: 13, fontWeight: F.bold, color: C.gray, letterSpacing: 2 },
});
