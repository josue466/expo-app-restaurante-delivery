import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { T } from "../constants/theme";

const COLORS: Record<string,string> = { cliente: T.green, admin: T.accent, repartidor: T.blue };
const LABELS: Record<string,string> = { cliente: "👤 Cliente", admin: "⚙️ Admin", repartidor: "🛵 Repartidor" };

export default function RoleBadge({ role }: { role: string }) {
  const c = COLORS[role] || T.muted;
  return (
    <View style={[s.badge, { backgroundColor: c + "22" }]}>
      <Text style={[s.txt, { color: c }]}>{LABELS[role] || role}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start" },
  txt:   { fontSize: 11, fontWeight: "700" },
});
