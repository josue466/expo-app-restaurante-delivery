import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, get } from "firebase/database";
import { database } from "../../firebaseConfig";
import { useApp } from "../../context/AppContext";
import { T } from "../../constants/theme";

export default function StatsScreen() {
  const { orders } = useApp();
  const [totalClientes, setTotalClientes] = useState(0);

  useEffect(() => {
    get(ref(database, "users")).then(snap => {
      if (snap.exists()) {
        const data = snap.val();
        const clientes = Object.values(data).filter((u: any) => u.role === "cliente");
        setTotalClientes(clientes.length);
      }
    }).catch(() => {});
  }, []);

  const delivered = orders.filter(o => o.status === "Entregado");
  const total     = delivered.reduce((a, o) => a + o.total, 0);


  const freq: Record<number, { name: string; qty: number }> = {};
  delivered.forEach(o => o.items?.forEach(it => {
    if (!freq[it.id]) freq[it.id] = { name: it.name, qty: 0 };
    freq[it.id].qty += it.qty;
  }));
  const top = Object.values(freq).sort((a, b) => b.qty - a.qty).slice(0, 4);

  const kpis = [
    { icon: "💰", label: "Ingresos Totales",    val: `S/. ${total}`,              color: T.green },
    { icon: "📦", label: "Entregas Completadas", val: String(delivered.length),    color: T.blue  },
    { icon: "📋", label: "Total Pedidos",        val: String(orders.length),       color: T.accent },
    { icon: "👥", label: "Clientes Registrados", val: String(totalClientes),       color: T.gold  },
  ];

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.brand}>ADMIN / COCINERO</Text>
        <Text style={s.title}>Estadisticas</Text>
        <Text style={s.sub}>Ingresos y entregas: solo pedidos "Entregado"</Text>

        <View style={s.grid}>
          {kpis.map(k => (
            <View key={k.label} style={s.kpiCard}>
              <Text style={s.kpiIcon}>{k.icon}</Text>
              <Text style={[s.kpiVal, { color: k.color }]}>{k.val}</Text>
              <Text style={s.kpiLbl}>{k.label}</Text>
            </View>
          ))}
        </View>

        <Text style={s.secLbl}>TOP PLATOS</Text>
        {top.length === 0
          ? <View style={s.emptyCard}><Text style={s.emptyTxt}>Sin datos aun</Text></View>
          : top.map((p, i) => (
            <View key={p.name} style={s.topCard}>
              <View style={[s.rankBadge, { backgroundColor: i === 0 ? T.gold : T.border }]}>
                <Text style={s.rankTxt}>#{i + 1}</Text>
              </View>
              <Text style={s.topName}>{p.name}</Text>
              <Text style={s.topQty}>{p.qty} vendidos</Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: T.bg },
  scroll:    { padding: 20, paddingBottom: 40 },
  brand:     { fontSize: 10, color: T.accent, letterSpacing: 4, marginBottom: 4 },
  title:     { fontSize: 26, fontWeight: "800", color: T.text },
  sub:       { fontSize: 11, color: T.muted, marginBottom: 20 },
  grid:      { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  kpiCard:   { width: "47%", backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 18, alignItems: "center" },
  kpiIcon:   { fontSize: 28, marginBottom: 8 },
  kpiVal:    { fontSize: 22, fontWeight: "800" },
  kpiLbl:    { fontSize: 11, color: T.muted, textAlign: "center", marginTop: 4 },
  secLbl:    { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 12 },
  emptyCard: { backgroundColor: T.card, borderRadius: 14, padding: 24, alignItems: "center" },
  emptyTxt:  { color: T.muted },
  topCard:   { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 14, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 8 },
  rankBadge: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  rankTxt:   { color: "#fff", fontWeight: "700", fontSize: 14 },
  topName:   { flex: 1, fontSize: 14, fontWeight: "700", color: T.text },
  topQty:    { fontSize: 12, color: T.muted },
});