import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Alert, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ref, get } from "firebase/database";
import { database } from "../../firebaseConfig";
import { useApp } from "../../context/AppContext";
import { T, TOPPINGS } from "../../constants/theme";

export default function CartScreen() {
  const { cart, setCart, addOrder, user } = useApp();
  const [address, setAddress] = useState("");
  const [tops, setTops]       = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-cargar direccion desde Firebase
  useEffect(() => {
    if (!user) return;
    get(ref(database, `users/${user.uid}`)).then(snap => {
      if (snap.exists() && snap.val().address) {
        setAddress(snap.val().address);
      }
    }).catch(() => {});
  }, [user]);

  const subtotal = cart.reduce((a, i) => a + i.priceActual * i.qty, 0);
  const topCost  = tops.length * 3;
  const total    = subtotal + topCost + 5;

  const toggleTop  = (t: string) => setTops(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const removeItem = (idx: number) => setCart(p => p.filter((_, i) => i !== idx));

  const confirmOrder = async () => {
    if (!user) { router.push("/login" as any); return; }
    if (cart.length === 0) return;
    if (!address) {
      if (Platform.OS === "web") alert("Ingresa una direccion de entrega");
      else Alert.alert("Aviso", "Ingresa una direccion de entrega");
      return;
    }

    setLoading(true);
    try {
      // Guardar pedido en Firebase Realtime Database
      await addOrder({
        clientId:   user.uid,
        clientName: user.email || "Cliente",
        items:      cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.priceActual })),
        address,
        toppings:   tops,
        total,
        status:     "Pendiente",
        date:       new Date().toISOString().split("T")[0],
      });

      setCart([]);
      setTops([]);
      setAddress("");

      if (Platform.OS === "web") alert("Pedido enviado ✅ El restaurante lo esta revisando");
      else Alert.alert("Pedido enviado ✅", "El restaurante lo esta revisando");

      router.push("/(cliente)/" as any);
    } catch (e) {
      if (Platform.OS === "web") alert("Error al enviar el pedido. Intenta de nuevo.");
      else Alert.alert("Error", "No se pudo enviar el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <SafeAreaView style={s.root}>
      <View style={s.emptyBox}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>🛒</Text>
        <Text style={s.emptyTitle}>Tu carrito esta vacio</Text>
        <Text style={s.emptySub}>Agrega pizzas desde el menu</Text>
        <TouchableOpacity style={s.goMenu} onPress={() => router.push("/(cliente)/" as any)}>
          <Text style={s.goMenuTxt}>Ver Menu  →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.root}>
      <Text style={s.title}>Mi Pedido</Text>
      <ScrollView contentContainerStyle={s.scroll}>

        {/* Items */}
        {cart.map((item, i) => (
          <View key={i} style={s.itemCard}>
            <View style={s.itemImgBox}><Text style={{ fontSize: 24 }}>🍕</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.itemName}>{item.name}</Text>
              {item.selectedSize !== "Personal" && (
                <Text style={s.itemSub}>Tamano: {item.selectedSize}</Text>
              )}
              <Text style={s.itemSub}>Cant: {item.qty} × S/. {item.priceActual}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <Text style={s.itemTotal}>S/. {item.priceActual * item.qty}</Text>
              <TouchableOpacity style={s.rmBtn} onPress={() => removeItem(i)}>
                <Text style={s.rmTxt}>🗑 Quitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Toppings */}
        <View style={s.card}>
          <Text style={s.label}>TOPPINGS  <Text style={{ color: T.gold }}>+S/. 3 c/u</Text></Text>
          <View style={s.tGrid}>
            {TOPPINGS.map(t => (
              <TouchableOpacity key={t}
                style={[s.tChip, tops.includes(t) && s.tChipOn]}
                onPress={() => toggleTop(t)}>
                <Text style={[s.tTxt, tops.includes(t) && s.tTxtOn]}>
                  {tops.includes(t) ? "✓ " : ""}{t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Direccion */}
        <View style={s.card}>
          <Text style={s.label}>DIRECCION DE ENTREGA</Text>
          <TextInput
            style={s.input}
            placeholder="Ingresa tu direccion..."
            placeholderTextColor={T.muted}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Resumen */}
        <View style={s.card}>
          <View style={s.sumRow}><Text style={s.sumKey}>Subtotal</Text><Text style={s.sumVal}>S/. {subtotal}</Text></View>
          {tops.length > 0 && (
            <View style={s.sumRow}>
              <Text style={s.sumKey}>Toppings ({tops.length})</Text>
              <Text style={s.sumVal}>S/. {topCost}</Text>
            </View>
          )}
          <View style={s.sumRow}><Text style={s.sumKey}>Delivery</Text><Text style={s.sumVal}>S/. 5</Text></View>
          <View style={s.totalRow}>
            <Text style={s.totalLbl}>Total</Text>
            <Text style={s.totalAmt}>S/. {total}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={s.footer}>
        {!user && (
          <Text style={s.loginHint}>
            <Text style={{ color: T.accentSoft, fontWeight: "600" }}
              onPress={() => router.push("/login" as any)}>
              Inicia sesion
            </Text>
            {" "}para confirmar tu pedido
          </Text>
        )}
        <TouchableOpacity style={[s.confBtn, loading && { opacity: 0.6 }]}
          onPress={confirmOrder} disabled={loading}>
          <Text style={s.confTxt}>
            {loading ? "Enviando pedido..." : user ? `Confirmar Pedido — S/. ${total}` : "Iniciar sesion para pedir"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: T.bg },
  title:      { fontSize: 26, fontWeight: "800", color: T.text, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },
  scroll:     { padding: 20 },
  emptyBox:   { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: T.text, marginBottom: 6 },
  emptySub:   { fontSize: 13, color: T.muted, marginBottom: 24 },
  goMenu:     { backgroundColor: T.accent, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 28 },
  goMenuTxt:  { color: "#fff", fontWeight: "700", fontSize: 15 },
  itemCard:   { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  itemImgBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#1a0e06", justifyContent: "center", alignItems: "center" },
  itemName:   { fontSize: 14, fontWeight: "700", color: T.text },
  itemSub:    { fontSize: 11, color: T.muted, marginTop: 2 },
  itemTotal:  { fontSize: 15, fontWeight: "700", color: T.accentSoft },
  rmBtn:      { backgroundColor: T.red + "22", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  rmTxt:      { color: T.red, fontSize: 11 },
  card:       { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12 },
  label:      { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 10 },
  tGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tChip:      { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: T.border, backgroundColor: T.surface },
  tChipOn:    { borderColor: T.accent, backgroundColor: T.accent + "33" },
  tTxt:       { fontSize: 12, color: T.muted },
  tTxtOn:     { color: T.accentSoft },
  input:      { height: 48, backgroundColor: T.surface, borderWidth: 2, borderColor: T.border, borderRadius: 14, paddingHorizontal: 16, fontSize: 14, color: T.text, marginBottom: 8 },
  gpsNote:    { fontSize: 10, color: T.accent, letterSpacing: 2 },
  sumRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sumKey:     { fontSize: 14, color: T.muted },
  sumVal:     { fontSize: 14, color: T.text },
  totalRow:   { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: T.border, paddingTop: 10, marginTop: 4 },
  totalLbl:   { fontSize: 18, fontWeight: "700", color: T.text },
  totalAmt:   { fontSize: 18, fontWeight: "700", color: T.accentSoft },
  footer:     { padding: 16, borderTopWidth: 1, borderTopColor: T.border },
  loginHint:  { textAlign: "center", fontSize: 13, color: T.muted, marginBottom: 8 },
  confBtn:    { backgroundColor: T.accent, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  confTxt:    { color: "#fff", fontSize: 16, fontWeight: "700" },
});