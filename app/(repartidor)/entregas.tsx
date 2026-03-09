import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { T } from "../../constants/theme";

export default function EntregasScreen() {
  const { orders, updateOrderStatus } = useApp();

  const ready    = orders.filter(o => o.status === "En preparacion");
  const onTheWay = orders.filter(o => o.status === "En camino");

  const pickup  = async (id: string) => await updateOrderStatus(id, "En camino");
  const deliver = async (id: string) => await updateOrderStatus(id, "Entregado");

  const renderCard = (item: any) => (
    <View style={s.card}>
      <View style={s.cardHead}>
        <View>
          <Text style={s.orderId}>Pedido #{String(item.id).slice(-5)}</Text>
          <Text style={s.client}>{item.clientName}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <Text style={s.addr}>📍 {item.address}</Text>
      {item.items?.map((it: any, i: number) => (
        <Text key={i} style={s.itemLine}>🍕 {it.name} ×{it.qty}</Text>
      ))}
      <Text style={s.total}>Total:  S/. {item.total}</Text>

      {/* Mapa GPS simulado */}
      {item.status === "En camino" && (
        <View style={s.mapBox}>
          <Text style={s.mapDot}>🛵</Text>
          <View style={s.mapRoute} />
          <Text style={s.mapPin}>📍</Text>
          <Text style={s.mapLabel}>GPS REAL — EVAL. FINAL</Text>
        </View>
      )}

      <View style={s.btnRow}>
        {item.status === "En preparacion" && (
          <TouchableOpacity style={s.pickupBtn} onPress={() => pickup(item.id)}>
            <Text style={s.pickupTxt}>🛵 Recoger y Salir</Text>
          </TouchableOpacity>
        )}
        {item.status === "En camino" && (
          <TouchableOpacity style={s.deliverBtn} onPress={() => deliver(item.id)}>
            <Text style={s.deliverTxt}>✅ Confirmar Entrega</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.root}>
      <Text style={s.brand}>REPARTIDOR</Text>
      <Text style={s.title}>Mis Entregas</Text>

      {ready.length === 0 && onTheWay.length === 0 && (
        <View style={s.emptyBox}>
          <Text style={{ fontSize: 46, marginBottom: 10 }}>🛵</Text>
          <Text style={s.emptyTxt}>No hay entregas asignadas</Text>
          <Text style={s.emptyHint}>Aparecen aqui cuando el admin aprueba un pedido</Text>
        </View>
      )}

      <FlatList
        data={[...onTheWay, ...ready]}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        renderItem={({ item }) => renderCard(item)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: T.bg },
  brand:     { fontSize: 10, color: T.accent, letterSpacing: 4, paddingHorizontal: 20, paddingTop: 16 },
  title:     { fontSize: 26, fontWeight: "800", color: T.text, paddingHorizontal: 20, marginBottom: 4 },
  list:      { padding: 20 },
  card:      { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12 },
  cardHead:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  orderId:   { fontSize: 15, fontWeight: "700", color: T.text },
  client:    { fontSize: 12, color: T.muted, marginTop: 2 },
  addr:      { fontSize: 12, color: T.muted, marginBottom: 6 },
  itemLine:  { fontSize: 13, color: T.text, marginBottom: 3 },
  total:     { fontSize: 14, fontWeight: "700", color: T.accentSoft, marginTop: 6 },
  mapBox:    { backgroundColor: "#0a1220", borderRadius: 14, height: 90, marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", borderWidth: 1, borderColor: T.border + "44" },
  mapDot:    { fontSize: 28 },
  mapRoute:  { flex: 1, height: 2, backgroundColor: T.accentSoft, marginHorizontal: 8 },
  mapPin:    { fontSize: 28 },
  mapLabel:  { position: "absolute", bottom: 4, right: 8, fontSize: 8, color: T.accent, letterSpacing: 2 },
  btnRow:    { marginTop: 12 },
  pickupBtn: { backgroundColor: T.blue, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  pickupTxt: { color: "#fff", fontWeight: "700", fontSize: 14 },
  deliverBtn:{ backgroundColor: T.green, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  deliverTxt:{ color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyBox:  { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyTxt:  { color: T.muted, fontSize: 15, marginBottom: 6 },
  emptyHint: { color: T.border, fontSize: 12, textAlign: "center" },
});