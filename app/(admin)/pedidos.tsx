import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { T } from "../../constants/theme";

export default function PedidosAdminScreen() {
  const { orders, updateOrderStatus } = useApp();

  const pending = orders.filter(o => o.status === "Pendiente");
  const active  = orders.filter(o => o.status === "En preparacion");

  const accept = async (id: string) => {
    await updateOrderStatus(id, "En preparacion");
  };

  const renderCard = (item: any, showBtn: boolean) => (
    <View style={s.card}>
      <View style={s.cardHead}>
        <View>
          <Text style={s.orderId}>Pedido #{String(item.id).slice(-5)}</Text>
          <Text style={s.clientName}>{item.clientName}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <Text style={s.address}>📍 {item.address}</Text>
      {item.items?.map((it: any, i: number) => (
        <Text key={i} style={s.itemLine}>🍕 {it.name} ×{it.qty}  —  S/. {it.price * it.qty}</Text>
      ))}
      {item.toppings?.length > 0 && (
        <Text style={s.toppings}>+ {item.toppings.join(", ")}</Text>
      )}
      <View style={s.cardFoot}>
        <Text style={s.total}>Total:  S/. {item.total}</Text>
        {showBtn && (
          <TouchableOpacity style={s.acceptBtn} onPress={() => accept(item.id)}>
            <Text style={s.acceptTxt}>👨‍🍳 Aceptar y Preparar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.root}>
      <Text style={s.brand}>ADMIN / COCINERO</Text>
      <Text style={s.title}>Pedidos</Text>

      {pending.length === 0 && active.length === 0 && (
        <View style={s.emptyBox}>
          <Text style={{ fontSize: 46, marginBottom: 10 }}>🍕</Text>
          <Text style={s.emptyTxt}>No hay pedidos activos</Text>
          <Text style={s.emptyHint}>Los pedidos nuevos aparecen aqui en tiempo real</Text>
        </View>
      )}

      <FlatList
        data={[...pending, ...active]}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        renderItem={({ item }) => renderCard(item, item.status === "Pendiente")}
        ListHeaderComponent={pending.length > 0
          ? <Text style={s.secLbl}>PENDIENTES ({pending.length})</Text>
          : active.length > 0
            ? <Text style={s.secLbl}>EN PREPARACION ({active.length})</Text>
            : null}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: T.bg },
  brand:      { fontSize: 10, color: T.accent, letterSpacing: 4, paddingHorizontal: 20, paddingTop: 16 },
  title:      { fontSize: 26, fontWeight: "800", color: T.text, paddingHorizontal: 20, marginBottom: 4 },
  list:       { padding: 20 },
  secLbl:     { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 10 },
  card:       { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12 },
  cardHead:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  orderId:    { fontSize: 15, fontWeight: "700", color: T.text },
  clientName: { fontSize: 12, color: T.muted, marginTop: 2 },
  address:    { fontSize: 12, color: T.muted, marginBottom: 6 },
  itemLine:   { fontSize: 13, color: T.text, marginBottom: 3 },
  toppings:   { fontSize: 12, color: T.gold, marginTop: 4 },
  cardFoot:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTopWidth: 1, borderTopColor: T.border, paddingTop: 10 },
  total:      { fontSize: 15, fontWeight: "700", color: T.accentSoft },
  acceptBtn:  { backgroundColor: T.accent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  acceptTxt:  { color: "#fff", fontWeight: "700", fontSize: 13 },
  emptyBox:   { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyTxt:   { color: T.muted, fontSize: 15, marginBottom: 6 },
  emptyHint:  { color: T.border, fontSize: 12, textAlign: "center" },
});