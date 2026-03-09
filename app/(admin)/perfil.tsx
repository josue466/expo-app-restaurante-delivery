import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
  TextInput, Modal, Alert, Platform,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useApp } from "../../context/AppContext";
import RoleBadge from "../../components/RoleBadge";
import { T } from "../../constants/theme";
import { Repartidor } from "../../constants/Data";

export default function AdminPerfilScreen() {
  const { user, repartidores, setRepartidores } = useApp();
  const [tab, setTab]     = useState<"datos"|"reps">("datos");
  const [modal, setModal] = useState(false);
  const [rName,  setRName]  = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass,  setRPass]  = useState("");

  const addRep = () => {
    if (!rName || !rEmail || !rPass) {
      if (Platform.OS === "web") alert("Completa nombre, correo y contrasena");
      else Alert.alert("Aviso", "Completa nombre, correo y contrasena");
      return;
    }
    const rep: Repartidor = {
      id:     `rep_${Date.now()}`,
      name:   rName,
      phone:  rPhone,
      email:  rEmail,
      active: true,
    };
    setRepartidores(p => [rep, ...p]);
    setModal(false);
    setRName(""); setRPhone(""); setREmail(""); setRPass("");
  };

  const toggleActive = (id: string) => {
    setRepartidores(p => p.map(r => r.id===id ? { ...r, active:!r.active } : r));
  };
  const deleteRep = (id: string) => {
    setRepartidores(p => p.filter(r => r.id !== id));
  };

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.brand}>ADMIN / COCINERO</Text>
        <Text style={s.title}>Perfil</Text>


        {user && (
          <View style={s.userCard}>
            <View style={s.avatar}><Text style={s.avatarTxt}>{(user.email||"A")[0].toUpperCase()}</Text></View>
            <View style={{ flex:1 }}>
              <Text style={s.userName}>{user.email}</Text>
              <RoleBadge role="admin" />
            </View>
          </View>
        )}


        <View style={s.tabRow}>
          {(["datos","reps"] as const).map(t => (
            <TouchableOpacity key={t} style={[s.tabBtn, tab===t && s.tabBtnOn]} onPress={() => setTab(t)}>
              <Text style={[s.tabTxt, tab===t && s.tabTxtOn]}>
                {t==="datos" ? "📋 Mis Datos" : "🛵 Repartidores"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "datos" && (
          <View style={s.card}>
            {[
              ["ROL",    "Administrador / Cocinero"],
              ["CORREO", user?.email || "—"],
              ["ACCESO", "Solo creado por el sistema"],
            ].map(([k, v]) => (
              <View key={k} style={s.dataRow}>
                <Text style={s.dataKey}>{k}</Text>
                <Text style={s.dataVal}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        {tab === "reps" && (
          <>
            <View style={s.repHeader}>
              <Text style={s.secLbl}>REPARTIDORES ({repartidores.length})</Text>
              <TouchableOpacity style={s.addBtn} onPress={() => setModal(true)}>
                <Text style={s.addTxt}>+ Nuevo</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.repNote}>Solo el Admin puede crear cuentas de Repartidor</Text>

            {repartidores.map(r => (
              <View key={r.id} style={s.repCard}>
                <View style={s.repAvatar}>
                  <Text style={s.repAvatarTxt}>{r.name[0]}</Text>
                </View>
                <View style={{ flex:1 }}>
                  <Text style={s.repName}>{r.name}</Text>
                  <Text style={s.repEmail}>{r.email}</Text>
                  <Text style={s.repPhone}>{r.phone}</Text>
                </View>
                <View style={s.repActions}>
                  <TouchableOpacity style={[s.statusBtn, r.active ? s.statusBtnOn : s.statusBtnOff]}
                    onPress={() => toggleActive(r.id)}>
                    <Text style={s.statusBtnTxt}>{r.active ? "Activo" : "Inactivo"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.delBtn} onPress={() => deleteRep(r.id)}>
                    <Text style={s.delTxt}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {repartidores.length === 0 && (
              <View style={s.emptyCard}><Text style={s.emptyTxt}>No hay repartidores registrados</Text></View>
            )}
          </>
        )}

        <TouchableOpacity style={s.logoutBtn} onPress={() => signOut(auth)}>
          <Text style={s.logoutTxt}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </ScrollView>


      <Modal visible={modal} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Nuevo Repartidor</Text>
            {[
              ["NOMBRE COMPLETO",  rName,  setRName,  false],
              ["TELEFONO",         rPhone, setRPhone, false],
              ["CORREO",           rEmail, setREmail, false],
              ["CONTRASENA",       rPass,  setRPass,  true],
            ].map(([lbl, val, setter, secure]) => (
              <View key={lbl as string}>
                <Text style={s.label}>{lbl as string}</Text>
                <TextInput style={s.input}
                  value={val as string}
                  onChangeText={setter as any}
                  secureTextEntry={secure as boolean}
                  placeholderTextColor={T.muted}
                  autoCapitalize="none"
                />
              </View>
            ))}
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setModal(false)}>
                <Text style={s.cancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn2} onPress={addRep}>
                <Text style={s.saveTxt}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:T.bg },
  scroll:       { padding:20, paddingBottom:40 },
  brand:        { fontSize:10, color:T.accent, letterSpacing:4, marginBottom:4 },
  title:        { fontSize:26, fontWeight:"800", color:T.text, marginBottom:16 },
  userCard:     { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:20, flexDirection:"row", alignItems:"center", gap:16, marginBottom:16 },
  avatar:       { width:52, height:52, borderRadius:16, backgroundColor:T.accent, justifyContent:"center", alignItems:"center" },
  avatarTxt:    { fontSize:22, fontWeight:"700", color:"#fff" },
  userName:     { fontSize:15, fontWeight:"700", color:T.text, marginBottom:6 },
  tabRow:       { flexDirection:"row", gap:8, marginBottom:16 },
  tabBtn:       { flex:1, paddingVertical:10, borderRadius:12, backgroundColor:T.card, borderWidth:1, borderColor:T.border, alignItems:"center" },
  tabBtnOn:     { backgroundColor:T.accent, borderColor:T.accent },
  tabTxt:       { fontSize:12, color:T.muted },
  tabTxtOn:     { color:"#fff", fontWeight:"700" },
  card:         { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:16, marginBottom:16 },
  dataRow:      { flexDirection:"row", justifyContent:"space-between", paddingVertical:10, borderBottomWidth:1, borderBottomColor:T.border },
  dataKey:      { fontSize:10, color:T.muted, letterSpacing:2 },
  dataVal:      { fontSize:13, color:T.text },
  repHeader:    { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  secLbl:       { fontSize:10, color:T.muted, letterSpacing:3 },
  addBtn:       { backgroundColor:T.accent, borderRadius:10, paddingHorizontal:14, paddingVertical:6 },
  addTxt:       { color:"#fff", fontWeight:"700", fontSize:12 },
  repNote:      { fontSize:11, color:T.muted, marginBottom:12 },
  repCard:      { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:14, flexDirection:"row", alignItems:"center", gap:12, marginBottom:8 },
  repAvatar:    { width:44, height:44, borderRadius:12, backgroundColor:T.blue, justifyContent:"center", alignItems:"center" },
  repAvatarTxt: { fontSize:18, fontWeight:"700", color:"#fff" },
  repName:      { fontSize:14, fontWeight:"700", color:T.text },
  repEmail:     { fontSize:11, color:T.muted },
  repPhone:     { fontSize:11, color:T.muted },
  repActions:   { alignItems:"flex-end", gap:6 },
  statusBtn:    { borderRadius:8, paddingHorizontal:10, paddingVertical:4 },
  statusBtnOn:  { backgroundColor:T.green+"33" },
  statusBtnOff: { backgroundColor:T.red+"33" },
  statusBtnTxt: { fontSize:11, color:T.text, fontWeight:"600" },
  delBtn:       { backgroundColor:T.red+"22", borderRadius:8, paddingHorizontal:8, paddingVertical:4 },
  delTxt:       { fontSize:16 },
  emptyCard:    { backgroundColor:T.card, borderRadius:14, padding:24, alignItems:"center", marginBottom:16 },
  emptyTxt:     { color:T.muted },
  logoutBtn:    { backgroundColor:T.card, borderRadius:14, borderWidth:1, borderColor:T.border, paddingVertical:14, alignItems:"center", marginTop:8 },
  logoutTxt:    { color:T.red, fontWeight:"700", fontSize:15 },
  overlay:      { flex:1, backgroundColor:"rgba(0,0,0,0.7)", justifyContent:"flex-end" },
  modalCard:    { backgroundColor:T.surface, borderTopLeftRadius:24, borderTopRightRadius:24, padding:24, paddingBottom:40 },
  modalTitle:   { fontSize:20, fontWeight:"800", color:T.text, marginBottom:20 },
  label:        { fontSize:10, color:T.muted, letterSpacing:3, marginBottom:8 },
  input:        { height:52, backgroundColor:T.card, borderWidth:2, borderColor:T.border, borderRadius:14, paddingHorizontal:16, fontSize:14, color:T.text, marginBottom:14 },
  modalBtns:    { flexDirection:"row", gap:12, marginTop:8 },
  cancelBtn:    { flex:1, backgroundColor:T.card, borderRadius:14, paddingVertical:14, alignItems:"center", borderWidth:1, borderColor:T.border },
  cancelTxt:    { color:T.muted, fontSize:14 },
  saveBtn2:     { flex:1, backgroundColor:T.accent, borderRadius:14, paddingVertical:14, alignItems:"center" },
  saveTxt:      { color:"#fff", fontWeight:"700", fontSize:14 },
});
