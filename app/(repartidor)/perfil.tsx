import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useApp } from "../../context/AppContext";
import RoleBadge from "../../components/RoleBadge";
import { T } from "../../constants/theme";

export default function RepartidorPerfilScreen() {
  const { user, orders } = useApp();

  const delivered = orders.filter(o => o.status === "Entregado").length;
  const earnings  = delivered * 5;

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.brand}>REPARTIDOR</Text>
        <Text style={s.title}>Mi Perfil</Text>

        {user && (
          <View style={s.userCard}>
            <View style={s.avatar}><Text style={s.avatarTxt}>{(user.email||"R")[0].toUpperCase()}</Text></View>
            <View style={{ flex:1 }}>
              <Text style={s.userName}>{user.displayName || user.email}</Text>
              <Text style={s.userEmail}>{user.email}</Text>
              <RoleBadge role="repartidor" />
            </View>
          </View>
        )}

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statVal}>{delivered}</Text>
            <Text style={s.statLbl}>Entregas</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statVal, { color:T.green }]}>S/. {earnings}</Text>
            <Text style={s.statLbl}>Ganancias hoy</Text>
          </View>
        </View>

        <View style={s.infoCard}>
          <Text style={s.infoRow}>📌 Solo el Administrador puede crear cuentas de Repartidor</Text>
          <Text style={s.infoRow}>💰 Ganancia fija: S/. 5.00 por entrega completada</Text>
        </View>

        <TouchableOpacity style={s.logoutBtn} onPress={() => signOut(auth)}>
          <Text style={s.logoutTxt}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root:      { flex:1, backgroundColor:T.bg },
  scroll:    { padding:20, paddingBottom:40 },
  brand:     { fontSize:10, color:T.accent, letterSpacing:4, marginBottom:4 },
  title:     { fontSize:26, fontWeight:"800", color:T.text, marginBottom:16 },
  userCard:  { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:20, flexDirection:"row", alignItems:"center", gap:16, marginBottom:16 },
  avatar:    { width:52, height:52, borderRadius:16, backgroundColor:T.blue, justifyContent:"center", alignItems:"center" },
  avatarTxt: { fontSize:22, fontWeight:"700", color:"#fff" },
  userName:  { fontSize:15, fontWeight:"700", color:T.text, marginBottom:2 },
  userEmail: { fontSize:12, color:T.muted, marginBottom:6 },
  statsRow:  { flexDirection:"row", gap:12, marginBottom:16 },
  statCard:  { flex:1, backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:20, alignItems:"center" },
  statVal:   { fontSize:26, fontWeight:"800", color:T.accentSoft },
  statLbl:   { fontSize:12, color:T.muted, marginTop:4 },
  infoCard:  { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:16, marginBottom:16, gap:8 },
  infoRow:   { fontSize:13, color:T.muted, lineHeight:20 },
  logoutBtn: { backgroundColor:T.card, borderRadius:14, borderWidth:1, borderColor:T.border, paddingVertical:14, alignItems:"center" },
  logoutTxt: { color:T.red, fontWeight:"700", fontSize:15 },
});
