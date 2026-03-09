import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { auth, database } from "../../firebaseConfig";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { T } from "../../constants/theme";

type UserData = {
  name:    string;
  email:   string;
  phone:   string;
  address: string;
  role:    string;
};

export default function PerfilScreen() {
  const { user, orders } = useApp();
  const router = useRouter();

  const [userData,  setUserData]  = useState<UserData | null>(null);
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);

  // Campos editables
  const [eName,    setEName]    = useState("");
  const [ePhone,   setEPhone]   = useState("");
  const [eAddress, setEAddress] = useState("");


  useEffect(() => {
    if (!user) return;
    get(ref(database, `users/${user.uid}`)).then(snap => {
      if (snap.exists()) {
        const d = snap.val() as UserData;
        setUserData(d);
        setEName(d.name    || "");
        setEPhone(d.phone  || "");
        setEAddress(d.address || "");
      }
    }).catch(() => {});
  }, [user]);

 
  const saveChanges = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await update(ref(database, `users/${user.uid}`), {
        name:    eName,
        phone:   ePhone,
        address: eAddress,
      });
      setUserData(prev => prev ? { ...prev, name: eName, phone: ePhone, address: eAddress } : prev);
      setEditing(false);
      if (Platform.OS === "web") alert("Datos actualizados ✅");
      else Alert.alert("Listo ✅", "Datos actualizados correctamente");
    } catch {
      if (Platform.OS === "web") alert("Error al guardar. Intenta de nuevo.");
      else Alert.alert("Error", "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEName(userData?.name    || "");
    setEPhone(userData?.phone  || "");
    setEAddress(userData?.address || "");
    setEditing(false);
  };

  if (!user) return (
    <SafeAreaView style={s.root}>
      <View style={s.noAuth}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>👤</Text>
        <Text style={s.noAuthTitle}>No has iniciado sesion</Text>
        <TouchableOpacity style={s.loginBtn} onPress={() => router.push("/login")}>
          <Text style={s.loginBtnTxt}>Iniciar Sesion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={s.regLink}>Crear cuenta nueva</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const myOrders    = orders.filter(o => o.clientId === user.uid);
  const displayName = userData?.name || user.email || "Cliente";
  const initial     = displayName[0].toUpperCase();

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.brand}>MI CUENTA</Text>
        <Text style={s.title}>Perfil</Text>

        {/* Avatar */}
        <View style={s.userCard}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName}>{displayName}</Text>
            <Text style={s.userEmail}>{userData?.email || user.email}</Text>
          </View>
          {/* Boton editar */}
          <TouchableOpacity style={s.editBtn} onPress={() => setEditing(!editing)}>
            <Text style={s.editBtnTxt}>{editing ? "✕ Cancelar" : "✏️ Editar"}</Text>
          </TouchableOpacity>
        </View>

        {/* INFO — modo lectura */}
        {!editing && (
          <View style={s.infoCard}>
            {[
              ["NOMBRE",    userData?.name    || "—"],
              ["CORREO",    userData?.email   || user.email || "—"],
              ["TELEFONO",  userData?.phone   || "—"],
              ["DIRECCION", userData?.address || "—"],
            ].map(([k, v]) => (
              <View key={k} style={s.infoRow}>
                <Text style={s.infoKey}>{k}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        {/* INFO — modo edicion */}
        {editing && (
          <View style={s.editCard}>
            <Text style={s.editTitle}>Editar Informacion</Text>

            <Text style={s.label}>NOMBRE</Text>
            <TextInput style={s.input} value={eName} onChangeText={setEName}
              placeholderTextColor={T.muted} placeholder="Tu nombre" />

            <Text style={s.label}>TELEFONO</Text>
            <TextInput style={s.input} value={ePhone} onChangeText={setEPhone}
              placeholderTextColor={T.muted} placeholder="+51 999 999 999"
              keyboardType="phone-pad" />

            <Text style={s.label}>DIRECCION DE ENTREGA</Text>
            <TextInput style={s.input} value={eAddress} onChangeText={setEAddress}
              placeholderTextColor={T.muted} placeholder="Jr. Las Flores 456, Lima" />

            <Text style={s.editNote}>
              📧 El correo no se puede modificar
            </Text>

            <View style={s.editBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={cancelEdit}>
                <Text style={s.cancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveBtn, saving && { opacity: 0.6 }]}
                onPress={saveChanges} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={s.saveTxt}>Guardar Cambios</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Historial de pedidos */}
        <Text style={s.secLbl}>MIS PEDIDOS</Text>
        {myOrders.length === 0
          ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyTxt}>No tienes pedidos aun</Text>
            </View>
          )
          : myOrders.map(o => (
            <TouchableOpacity key={o.id} style={s.orderCard}
              onPress={() => router.push({ pathname: "/tracking" as any, params: { orderId: String(o.id) } })}>
              <View style={s.orderHead}>
                <Text style={s.orderId}>Pedido #{String(o.id).slice(-5)}</Text>
                <StatusBadge status={o.status} />
              </View>
              <Text style={s.orderItems}>{o.items.map(i => `🍕 ${i.name}`).join(", ")}</Text>
              <View style={s.orderFoot}>
                <Text style={s.orderDate}>{o.date}</Text>
                <Text style={s.orderTotal}>S/. {o.total}</Text>
              </View>
            </TouchableOpacity>
          ))}

        <TouchableOpacity style={s.logoutBtn} onPress={() => signOut(auth)}>
          <Text style={s.logoutTxt}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: T.bg },
  scroll:      { padding: 20, paddingBottom: 40 },
  brand:       { fontSize: 10, color: T.accent, letterSpacing: 4, marginBottom: 4 },
  title:       { fontSize: 26, fontWeight: "800", color: T.text, marginBottom: 16 },
  noAuth:      { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  noAuthTitle: { fontSize: 16, color: T.muted, marginBottom: 24 },
  loginBtn:    { backgroundColor: T.accent, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 12 },
  loginBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  regLink:     { color: T.accentSoft, fontSize: 14 },
  userCard:    { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 20, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  avatar:      { width: 52, height: 52, borderRadius: 16, backgroundColor: T.accent, justifyContent: "center", alignItems: "center" },
  avatarTxt:   { fontSize: 22, fontWeight: "700", color: "#fff" },
  userName:    { fontSize: 16, fontWeight: "700", color: T.text },
  userEmail:   { fontSize: 12, color: T.muted, marginTop: 2 },
  editBtn:     { backgroundColor: T.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: T.border },
  editBtnTxt:  { fontSize: 12, color: T.accentSoft, fontWeight: "600" },
  infoCard:    { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 16 },
  infoRow:     { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: T.border },
  infoKey:     { fontSize: 10, color: T.muted, letterSpacing: 2 },
  infoVal:     { fontSize: 13, color: T.text, fontWeight: "600", flex: 1, textAlign: "right" },
  editCard:    { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 20, marginBottom: 16 },
  editTitle:   { fontSize: 16, fontWeight: "700", color: T.text, marginBottom: 16 },
  label:       { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 8 },
  input:       { height: 50, backgroundColor: T.surface, borderWidth: 2, borderColor: T.border, borderRadius: 14, paddingHorizontal: 16, fontSize: 14, color: T.text, marginBottom: 14 },
  editNote:    { fontSize: 11, color: T.muted, marginBottom: 16 },
  editBtns:    { flexDirection: "row", gap: 10 },
  cancelBtn:   { flex: 1, backgroundColor: T.surface, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: T.border },
  cancelTxt:   { color: T.muted, fontWeight: "600" },
  saveBtn:     { flex: 1, backgroundColor: T.accent, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  saveTxt:     { color: "#fff", fontWeight: "700" },
  secLbl:      { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 10 },
  emptyCard:   { backgroundColor: T.card, borderRadius: 14, padding: 24, alignItems: "center", marginBottom: 16 },
  emptyTxt:    { color: T.muted, fontSize: 14 },
  orderCard:   { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 14, marginBottom: 10 },
  orderHead:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  orderId:     { fontSize: 14, fontWeight: "700", color: T.text },
  orderItems:  { fontSize: 12, color: T.muted, marginBottom: 8 },
  orderFoot:   { flexDirection: "row", justifyContent: "space-between" },
  orderDate:   { fontSize: 12, color: T.muted },
  orderTotal:  { fontSize: 13, fontWeight: "700", color: T.accentSoft },
  logoutBtn:   { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  logoutTxt:   { color: T.red, fontWeight: "700", fontSize: 15 },
});