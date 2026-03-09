import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { T } from "../constants/theme";
import { Pizza } from "../constants/Data";

export default function FoodCard({ item, onPress }: { item: Pizza; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.8}>
      <View style={s.imgBox}>
        {item.img
          ? <Image source={{ uri: item.img }} style={s.img} />
          : <Text style={s.emoji}>🍕</Text>}
      </View>
      <View style={s.info}>
        <Text style={s.name}>{item.name}</Text>
        <Text style={s.desc} numberOfLines={1}>{item.desc}</Text>
        <View style={s.meta}>
          <Text style={s.rating}>⭐ {item.rating}</Text>
          <Text style={s.time}>• {item.time}</Text>
        </View>
      </View>
      <View style={s.right}>
        <Text style={s.price}>S/. {item.price}</Text>
        <View style={s.addBtn}><Text style={s.addTxt}>+</Text></View>
      </View>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  card:   { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 14 },
  imgBox: { width: 68, height: 68, borderRadius: 14, backgroundColor: "#1a0e06", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  img:    { width: 68, height: 68 },
  emoji:  { fontSize: 28 },
  info:   { flex: 1 },
  name:   { fontSize: 15, fontWeight: "700", color: T.text },
  desc:   { fontSize: 11, color: T.muted, marginTop: 2 },
  meta:   { flexDirection: "row", gap: 8, marginTop: 5 },
  rating: { fontSize: 11, color: T.gold },
  time:   { fontSize: 11, color: T.muted },
  right:  { alignItems: "flex-end" },
  price:  { fontSize: 15, fontWeight: "700", color: T.accentSoft },
  addBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: T.accent, justifyContent: "center", alignItems: "center", marginTop: 6 },
  addTxt: { color: "#fff", fontSize: 18, lineHeight: 20 },
});
