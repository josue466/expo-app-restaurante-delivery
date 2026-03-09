import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STATUS_COLOR, STATUS_ICON } from "../constants/theme";

export default function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLOR[status] || "#888";
  return (
    <View style={[s.badge, { backgroundColor: color + "22", borderColor: color + "55" }]}>
      <Text style={[s.txt, { color }]}>{STATUS_ICON[status]} {status}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  badge: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start" },
  txt:   { fontSize: 11, fontWeight: "700" },
});
