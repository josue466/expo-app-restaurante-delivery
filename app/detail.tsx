import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApp } from "../context/AppContext";
import { T } from "../constants/theme";

const SIZES = ["Personal", "Mediana", "Familiar"];
const MULT  = [1, 1.3, 1.7];
const IS_FOOD = (cat: string) => cat !== "Bebidas" && cat !== "Postres";

export default function DetailScreen() {
  const { itemJson } = useLocalSearchParams<{ itemJson: string }>();
  const item = JSON.parse(itemJson || "{}");
  const { setCart } = useApp();
  const router = useRouter();

  const [qty,  setQty]  = useState(1);
  const [size, setSize] = useState(1);

  const foodItem = IS_FOOD(item.category ?? "");
  const unitPrice = Math.round(item.price * (foodItem ? MULT[size] : 1));
  const total = unitPrice * qty;

  const addToCart = () => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id && i.selectedSize === SIZES[size]);
      if (exists) return prev.map(i =>
        i.id === item.id && i.selectedSize === SIZES[size] ? { ...i, qty: i.qty + qty } : i
      );
      return [...prev, { ...item, qty, selectedSize: SIZES[size], priceActual: unitPrice }];
    });
    if (Platform.OS === "web") alert(`${item.name} agregado al carrito 🍕`);
    else Alert.alert("Agregado ✅", `${item.name} agregado al carrito`);
    router.back();
  };

  return (
    <View style={s.root}>
      {/* Hero */}
      <View style={s.hero}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <Text style={s.backTxt}>← Volver</Text>
        </TouchableOpacity>
        {item.img ? <Image source={{ uri: item.img }} style={s.heroImg} /> : <Text style={s.heroEmoji}>🍕</Text>}
        <Text style={s.catLabel}>{(item.category || "").toUpperCase()}</Text>
        <Text style={s.heroName}>{item.name}</Text>
        <View style={s.metaRow}>
          <Text style={s.meta}>⭐ {item.rating}</Text>
          <Text style={s.meta}>🕐 {item.time}</Text>
        </View>
      </View>

      {/* Scroll body */}
      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={s.desc}>{item.desc}</Text>

        {foodItem && (
          <>
            <Text style={s.label}>TAMAÑO</Text>
            <View style={s.sizesRow}>
              {SIZES.map((sz, i) => (
                <TouchableOpacity key={sz}
                  style={[s.sizeBtn, size === i && s.sizeBtnOn]}
                  onPress={() => setSize(i)}>
                  <Text style={[s.sizeTxt, size === i && s.sizeTxtOn]}>{sz}</Text>
                  <Text style={[s.sizeMul, size === i && s.sizeTxtOn]}>×{MULT[i]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={s.label}>CANTIDAD</Text>
        <View style={s.qtyRow}>
          <View style={s.qtyCtrl}>
            <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))}>
              <Text style={s.qtyMinus}>−</Text>
            </TouchableOpacity>
            <Text style={s.qtyNum}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty(qty + 1)}>
              <Text style={s.qtyPlus}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.totalPx}>S/. {total}</Text>
        </View>
      </ScrollView>

      {/* Footer button */}
      <View style={s.footer}>
        <TouchableOpacity style={s.addBtn} onPress={addToCart}>
          <Text style={s.addTxt}>Agregar al pedido  —  S/. {total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:      { flex:1, backgroundColor:T.bg },
  hero:      { backgroundColor:"#1a0e06", padding:20, paddingTop:16, alignItems:"center" },
  back:      { alignSelf:"flex-start", marginBottom:12 },
  backTxt:   { color:T.muted, fontSize:14 },
  heroImg:   { width:120, height:120, borderRadius:24, marginBottom:8 },
  heroEmoji: { fontSize:80, marginBottom:8 },
  catLabel:  { fontSize:10, color:T.accent, letterSpacing:4 },
  heroName:  { fontSize:26, fontWeight:"800", color:T.text, marginTop:4 },
  metaRow:   { flexDirection:"row", gap:16, marginTop:8 },
  meta:      { fontSize:13, color:T.muted },
  body:      { flex:1, padding:20 },
  desc:      { fontSize:14, color:T.muted, lineHeight:22, marginBottom:20 },
  label:     { fontSize:10, color:T.muted, letterSpacing:3, marginBottom:10 },
  sizesRow:  { flexDirection:"row", gap:8, marginBottom:20 },
  sizeBtn:   { flex:1, padding:10, borderRadius:12, backgroundColor:T.card, borderWidth:1, borderColor:T.border, alignItems:"center" },
  sizeBtnOn: { backgroundColor:T.accent, borderColor:T.accent },
  sizeTxt:   { fontSize:11, color:T.muted, fontWeight:"600" },
  sizeTxtOn: { color:"#fff" },
  sizeMul:   { fontSize:10, color:T.muted, marginTop:2 },
  qtyRow:    { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:20 },
  qtyCtrl:   { flexDirection:"row", alignItems:"center", gap:16, backgroundColor:T.card, borderRadius:14, paddingHorizontal:20, paddingVertical:10, borderWidth:1, borderColor:T.border },
  qtyMinus:  { fontSize:24, color:T.text },
  qtyPlus:   { fontSize:24, color:T.accent },
  qtyNum:    { fontSize:20, color:T.text, minWidth:28, textAlign:"center" },
  totalPx:   { fontSize:24, fontWeight:"800", color:T.accentSoft },
  footer:    { padding:16, borderTopWidth:1, borderTopColor:T.border },
  addBtn:    { backgroundColor:T.accent, borderRadius:16, paddingVertical:16, alignItems:"center", shadowColor:T.accent, shadowOffset:{width:0,height:4}, shadowOpacity:0.35, shadowRadius:8, elevation:4 },
  addTxt:    { color:"#fff", fontSize:16, fontWeight:"700" },
});
