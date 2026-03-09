import React, { useState } from "react";
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useApp } from "../../context/AppContext";
import FoodCard from "../../components/FoodCard";
import { T } from "../../constants/theme";

const CATS = ["Todos", "Clasicas", "Especiales", "Bebidas", "Postres"];

export default function HomeScreen() {
  const { pizzas, business, user, cartCount } = useApp();
  const [cat, setCat] = useState("Todos");
  const router = useRouter();

  const filtered = cat === "Todos"
    ? pizzas.filter(p => p.available)
    : pizzas.filter(p => p.category === cat && p.available);

  return (
    <SafeAreaView style={s.root}>

      <View style={s.topBar}>
        <View>
          <Text style={s.greeting}>{user ? `Hola 👋` : "FORNO ROSSO"}</Text>
          <Text style={s.topTitle}>Nuestro Menu</Text>
        </View>
        <TouchableOpacity style={s.cartBtn} onPress={() => router.push("/(cliente)/cart")}>
          <Text style={{ fontSize: 18 }}>🛒</Text>
          {cartCount > 0 && (
            <View style={s.cartBadge}>
              <Text style={s.cartBadgeTxt}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>


      {!!business.promo && (
        <View style={s.promoBanner}>
          <View style={{ flex: 1 }}>
            <Text style={s.promoLabel}>PROMOCION</Text>
            <Text style={s.promoTxt}>{business.promo}</Text>
          </View>
          <Text style={{ fontSize: 30 }}>🎉</Text>
        </View>
      )}


      <View style={s.catWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.catContent}
        >
          {CATS.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.catBtn, cat === c && s.catBtnOn]}
              onPress={() => setCat(c)}
            >
              <Text style={[s.catTxt, cat === c && s.catTxtOn]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onPress={() =>
              router.push({ pathname: "/detail" as any, params: { itemJson: JSON.stringify(item) } })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={s.empty}>No hay platos disponibles en esta categoria</Text>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: T.bg },
  topBar:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  greeting:     { fontSize: 10, color: T.muted, letterSpacing: 2 },
  topTitle:     { fontSize: 22, fontWeight: "800", color: T.text, marginTop: 2 },
  cartBtn:      { width: 44, height: 44, borderRadius: 13, backgroundColor: T.card, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: T.border },
  cartBadge:    { position: "absolute", top: -4, right: -4, backgroundColor: T.accent, borderRadius: 8, width: 17, height: 17, justifyContent: "center", alignItems: "center" },
  cartBadgeTxt: { color: "#fff", fontSize: 9, fontWeight: "700" },
  promoBanner:  { marginHorizontal: 20, marginVertical: 8, backgroundColor: "#1a0e06", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#3a2010", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  promoLabel:   { fontSize: 9, color: T.gold, letterSpacing: 3, marginBottom: 4 },
  promoTxt:     { fontSize: 13, fontWeight: "700", color: T.text },

  catWrapper:   { paddingVertical: 10 },
  catContent:   { paddingHorizontal: 20, gap: 8, alignItems: "center" },
  catBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.border,
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  catBtnOn:  { backgroundColor: T.accent, borderColor: T.accent },
  catTxt:    { fontSize: 13, color: T.muted, lineHeight: 18 },
  catTxtOn:  { color: "#fff", fontWeight: "700" },

  list:  { padding: 20 },
  empty: { textAlign: "center", color: T.muted, marginTop: 40, fontSize: 14 },
});