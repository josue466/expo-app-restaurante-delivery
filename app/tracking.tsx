import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 1. Importar el hook
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import { T, STATUS_FLOW, STATUS_ICON } from "../constants/theme";

const DESC: Record<string, string> = {
  "Pendiente": "Esperando confirmación del restaurante",
  "En preparacion": "Admin/Cocinero aceptó — preparando tu pizza 🍕",
  "En camino": "Repartidor en camino a tu dirección 🛵",
  "Entregado": "Pedido entregado exitosamente ✅",
};

export default function TrackingScreen() {
  const insets = useSafeAreaInsets(); // 2. Inicializar insets
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders } = useApp();
  const router = useRouter();
  const order = orders.find(o => String(o.id) === orderId);

  // Vista de Error (Pedido no encontrado)
  if (!order) return (
    <View style={[s.root, { paddingTop: insets.top + 20 }]}> 
      <TouchableOpacity style={s.back} onPress={() => {
        if (router.canGoBack()) router.back();
        else router.replace("/(cliente)" as any);
      }}>
        <Text style={s.backTxt}>← Volver</Text>
      </TouchableOpacity>
      <Text style={s.empty}>Pedido no encontrado</Text>
    </View>
  );

  const step = STATUS_FLOW.indexOf(order.status);

  return (
    <View style={s.root}>
      {/* 3. Aplicar padding dinámico al ScrollView */}
      <ScrollView 
        contentContainerStyle={[
          s.scroll, 
          { paddingTop: insets.top + 10 } 
        ]}
      >
        <TouchableOpacity style={s.back} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace("/(cliente)" as any);
        }}>
          <Text style={s.backTxt}>← Volver</Text>
        </TouchableOpacity>

        <Text style={s.orderLbl}>PEDIDO #{order.id}</Text>
        <Text style={s.title}>Seguimiento</Text>

        <View style={s.card}>
          <Text style={s.statusEmoji}>{STATUS_ICON[order.status]}</Text>
          <StatusBadge status={order.status} />
          <Text style={s.statusDesc}>{DESC[order.status]}</Text>
        </View>

        {order.status === "En camino" && (
          <TouchableOpacity
            style={s.chatBtn}
            onPress={() => router.push(`/chat?orderId=${order.id}&senderRole=cliente` as any)}>
            <Text style={s.chatEmoji}>💬</Text>
            <View>
              <Text style={s.chatBtnTxt}>Chatear con el Repartidor</Text>
              <Text style={s.chatBtnSub}>Pregunta dónde está o da indicaciones</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={s.card2}>
          {STATUS_FLOW.map((st, i) => (
            <View key={st} style={s.tRow}>
              <View style={s.tLeft}>
                <View style={[s.dot, i <= step ? s.dotOn : s.dotOff]}>
                  <Text style={s.dotTxt}>{i <= step ? "✓" : String(i + 1)}</Text>
                </View>
                {i < STATUS_FLOW.length - 1 && (
                  <View style={[s.tLine, i < step ? s.tLineOn : s.tLineOff]} />
                )}
              </View>
              <View style={[s.tContent, i < STATUS_FLOW.length - 1 && { marginBottom: 22 }]}>
                <Text style={[s.tName, i <= step && s.tNameOn]}>{st}</Text>
                <Text style={s.tDesc}>{DESC[st]}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={s.card2}>
          <Text style={s.secLbl}>RESUMEN</Text>
          {order.items.map((it, i) => (
            <View key={i} style={s.sumRow}>
              <Text style={s.sumItem}>🍕 {it.name} ×{it.qty}</Text>
              <Text style={s.sumPrice}>S/. {it.price * it.qty}</Text>
            </View>
          ))}
          {order.toppings?.length > 0 && (
            <Text style={s.tops}>Toppings: {order.toppings.join(", ")}</Text>
          )}
          <View style={s.totalRow}>
            <Text style={s.totalLbl}>Total</Text>
            <Text style={s.totalAmt}>S/. {order.total}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { marginBottom: 12 },
  backTxt: { color: T.muted, fontSize: 14 },
  orderLbl: { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "800", color: T.text, marginBottom: 16 },
  empty: { fontSize: 16, color: T.muted, textAlign: "center", marginTop: 40 },
  card: { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 20, marginBottom: 12, alignItems: "center" },
  card2: { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 20, marginBottom: 12 },
  statusEmoji: { fontSize: 52, marginBottom: 8 },
  statusDesc: { fontSize: 13, color: T.muted, marginTop: 8, textAlign: "center" },
  chatBtn: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#1a2e1a", borderRadius: 18, borderWidth: 1, borderColor: "#22c55e44", padding: 16, marginBottom: 12 },
  chatEmoji: { fontSize: 32 },
  chatBtnTxt: { fontSize: 14, fontWeight: "700", color: "#22c55e" },
  chatBtnSub: { fontSize: 11, color: T.muted, marginTop: 2 },
  tRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  tLeft: { alignItems: "center" },
  dot: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  dotOn: { backgroundColor: T.accent },
  dotOff: { backgroundColor: T.border },
  dotTxt: { color: "#fff", fontSize: 12, fontWeight: "700" },
  tLine: { width: 2, height: 22, marginTop: 2 },
  tLineOn: { backgroundColor: T.accent },
  tLineOff: { backgroundColor: T.border },
  tContent: { flex: 1 },
  tName: { fontSize: 14, color: T.muted },
  tNameOn: { color: T.text, fontWeight: "700" },
  tDesc: { fontSize: 11, color: T.muted, marginTop: 2 },
  secLbl: { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 10 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  sumItem: { fontSize: 13, color: T.muted },
  sumPrice: { fontSize: 13, color: T.text },
  tops: { fontSize: 12, color: T.muted, marginTop: 4 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: T.border, marginTop: 10, paddingTop: 10 },
  totalLbl: { fontSize: 16, fontWeight: "700", color: T.text },
  totalAmt: { fontSize: 16, fontWeight: "700", color: T.accentSoft },
});