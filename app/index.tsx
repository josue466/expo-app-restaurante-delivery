import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { T } from "../constants/theme";

export default function SplashScreen() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <Text style={s.emoji}>🍕</Text>
      <Text style={s.brand}>BIENVENIDO A</Text>
      <Text style={s.title}>Forno</Text>
      <Text style={s.titleRed}>Rosso</Text>
      <View style={s.line} />
      <Text style={s.sub}>{"Pizzas artesanales horneadas en leña.\nDelivery en 30 minutos."}</Text>
      <TouchableOpacity style={s.btnMain} onPress={() => router.push("/(cliente)/" as any)}>
        <Text style={s.btnMainTxt}>Explorar Menu  →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.btnSec} onPress={() => router.push("/login")}>
        <Text style={s.btnSecTxt}>Iniciar Sesion</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={s.link}>Crear cuenta  →</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:T.bg, alignItems:"center", justifyContent:"center", padding:32 },
  emoji:      { fontSize:80, marginBottom:12 },
  brand:      { fontSize:10, letterSpacing:6, color:T.accent, marginBottom:6 },
  title:      { fontSize:52, fontWeight:"900", color:T.text, lineHeight:56 },
  titleRed:   { fontSize:52, fontWeight:"900", color:T.accent, lineHeight:56, marginBottom:12 },
  line:       { width:40, height:3, backgroundColor:T.accent, marginBottom:18 },
  sub:        { fontSize:14, color:T.muted, lineHeight:22, textAlign:"center", marginBottom:40 },
  btnMain:    { width:"100%", backgroundColor:T.accent, borderRadius:16, paddingVertical:16, alignItems:"center", marginBottom:12, shadowColor:T.accent, shadowOffset:{width:0,height:6}, shadowOpacity:0.4, shadowRadius:12, elevation:6 },
  btnMainTxt: { color:"#fff", fontSize:16, fontWeight:"700" },
  btnSec:     { width:"100%", borderRadius:16, paddingVertical:14, alignItems:"center", borderWidth:1, borderColor:T.border, marginBottom:16 },
  btnSecTxt:  { color:T.muted, fontSize:15 },
  link:       { color:T.accentSoft, fontSize:13 },
});