import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import { T } from "../../constants/theme";

const ROWS = [
  { icon:"🕐", lbl:"HORARIOS DE ATENCION", key:"schedule" },
  { icon:"📞", lbl:"TELEFONO",             key:"phone" },
  { icon:"📍", lbl:"DIRECCION",            key:"address" },
  { icon:"🛵", lbl:"ZONA DE DELIVERY",     key:"delivery" },
];

export default function InfoScreen() {
  const { business } = useApp();
  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.brand}>FORNO ROSSO</Text>
        <Text style={s.title}>Informacion</Text>

        <View style={s.mapBox}>
          <Text style={{ fontSize:36 }}>📍</Text>
          <Text style={s.mapAddr}>{business.address}</Text>
          <Text style={s.mapTag}>GPS REAL — EVAL. FINAL</Text>
        </View>

        {ROWS.map(r => (
          <View key={r.key} style={s.card}>
            <Text style={{ fontSize:22, marginTop:2 }}>{r.icon}</Text>
            <View style={{ flex:1 }}>
              <Text style={s.cardLbl}>{r.lbl}</Text>
              <Text style={s.cardVal}>{(business as any)[r.key]}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root:    { flex:1, backgroundColor:T.bg },
  scroll:  { padding:20, paddingBottom:40 },
  brand:   { fontSize:10, color:T.accent, letterSpacing:4, marginBottom:4 },
  title:   { fontSize:26, fontWeight:"800", color:T.text, marginBottom:16 },
  mapBox:  { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, height:120, marginBottom:12, justifyContent:"center", alignItems:"center" },
  mapAddr: { fontSize:13, color:T.text, marginTop:4 },
  mapTag:  { fontSize:9, color:T.accent, letterSpacing:3, marginTop:4 },
  card:    { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:14, flexDirection:"row", gap:14, alignItems:"flex-start", marginBottom:10 },
  cardLbl: { fontSize:10, color:T.muted, letterSpacing:3, marginBottom:6 },
  cardVal: { fontSize:14, color:T.text, lineHeight:20 },
});
