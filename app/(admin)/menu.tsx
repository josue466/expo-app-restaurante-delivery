import React, { useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, Alert, Platform, Modal, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { ref, push, update, remove, get } from "firebase/database";
import { database } from "../../firebaseConfig";
import { useApp } from "../../context/AppContext";
import { T } from "../../constants/theme";
import { Pizza } from "../../constants/Data";

const CATEGORIES = ["Clasicas", "Especiales", "Bebidas", "Postres"];

const EMPTY_FORM = {
  name: "", desc: "", category: "Clasicas",
  price: "", rating: "4.5", time: "25 min",
};

export default function MenuAdminScreen() {
  const { pizzas, setPizzas } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState(EMPTY_FORM);


  useFocusEffect(
    useCallback(() => {
      get(ref(database, "pizzas")).then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const lista: Pizza[] = Object.keys(data).map(key => ({
            ...data[key], id: key,
          }));
          setPizzas(lista);
        } else {
          setPizzas([]);
        }
      }).catch(() => {});
    }, [])
  );

  const isPizza = form.category === "Clasicas" || form.category === "Especiales";

  const showMsg = (title: string, msg: string) => {
    if (Platform.OS === "web") alert(`${title}: ${msg}`);
    else Alert.alert(title, msg);
  };

  // ── Agregar plato
  const addPizza = async () => {
    if (!form.name.trim() || !form.price || !form.desc.trim()) {
      showMsg("Aviso", "Completa nombre, descripcion y precio");
      return;
    }
    setSaving(true);
    try {
      const newPizza: Omit<Pizza, "id"> = {
        name:      form.name.trim(),
        desc:      form.desc.trim(),
        category:  form.category,
        price:     Number(form.price),
        rating:    Number(form.rating) || 4.5,
        time:      form.time || "25 min",
        img:       null,
        available: true,
      };
      const result = await push(ref(database, "pizzas"), newPizza);
      setPizzas(prev => [...prev, { ...newPizza, id: result.key as any }]);
      setForm(EMPTY_FORM);
      setModalOpen(false);
      showMsg("Listo ✅", `"${newPizza.name}" agregado`);
    } catch {
      showMsg("Error", "No se pudo agregar");
    } finally {
      setSaving(false);
    }
  };

  // ── Ocultar / Mostrar
  const toggleAvailable = async (pizza: Pizza) => {
    const newVal = !pizza.available;
    try {
      await update(ref(database, `pizzas/${pizza.id}`), { available: newVal });
      setPizzas(prev => prev.map(p =>
        p.id === pizza.id ? { ...p, available: newVal } : p
      ));
    } catch {
      showMsg("Error", "No se pudo actualizar");
    }
  };

  // ── Eliminar
  const deletePizza = (pizza: Pizza) => {
    const doDelete = async () => {
      try {
        await remove(ref(database, `pizzas/${pizza.id}`));
        setPizzas(prev => prev.filter(p => p.id !== pizza.id));
      } catch {
        showMsg("Error", "No se pudo eliminar");
      }
    };
    if (Platform.OS === "web") {
      if (window.confirm(`¿Eliminar "${pizza.name}"?`)) doDelete();
    } else {
      Alert.alert("Eliminar", `¿Eliminar "${pizza.name}"?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: doDelete },
      ]);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.topBar}>
        <View>
          <Text style={s.brand}>ADMIN / COCINERO</Text>
          <Text style={s.title}>Gestión del Menú</Text>
          <Text style={s.summary}>
            {pizzas.filter(p => p.available).length} activos · {pizzas.filter(p => !p.available).length} ocultos · {pizzas.length} total
          </Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setModalOpen(true)}>
          <Text style={s.addBtnTxt}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pizzas}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHead}>
              <View style={s.imgBox}>
                <Text style={{ fontSize: 24 }}>
                  {item.category === "Bebidas" ? "🥤" : item.category === "Postres" ? "🍮" : "🍕"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.cat}>{item.category} · {item.time}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text style={s.price}>S/. {item.price}</Text>
                <View style={[s.badge, item.available ? s.badgeOn : s.badgeOff]}>
                  <Text style={[s.badgeTxt, { color: item.available ? "#22c55e" : T.muted }]}>
                    {item.available ? "Activo" : "Oculto"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={s.actions}>
              <TouchableOpacity
                style={[s.actionBtn, item.available ? s.hideBtn : s.showBtn]}
                onPress={() => toggleAvailable(item)}>
                <Text style={s.actionTxt}>{item.available ? "👁 Ocultar" : "✓ Mostrar"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.delBtn} onPress={() => deletePizza(item)}>
                <Text style={s.delTxt}>🗑 Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={{ fontSize: 44, marginBottom: 10 }}>🍕</Text>
            <Text style={s.emptyTxt}>No hay platos. Agrega el primero.</Text>
          </View>
        }
      />

      {/* Modal agregar plato */}
      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modalCard}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={s.modalTitle}>Nuevo Plato / Producto</Text>

              <Text style={s.lbl}>NOMBRE</Text>
              <TextInput style={s.input} value={form.name}
                onChangeText={v => setForm(p => ({ ...p, name: v }))}
                placeholder="Ej: Margherita o Inka Cola" placeholderTextColor={T.muted} />

              <Text style={s.lbl}>CATEGORIA</Text>
              <View style={s.catRow}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity key={c}
                    style={[s.catChip, form.category === c && s.catChipOn]}
                    onPress={() => setForm(p => ({ ...p, category: c }))}>
                    <Text style={[s.catTxt, form.category === c && s.catTxtOn]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={s.cameraBox}>
                <Text style={s.cameraTxt}>📸 CAMARA / GALERIA — EVAL. FINAL</Text>
              </View>

              <Text style={s.lbl}>PRECIO {isPizza ? "BASE (Personal)" : "UNITARIO"} — S/.</Text>
              <TextInput style={s.input} value={form.price}
                onChangeText={v => setForm(p => ({ ...p, price: v }))}
                placeholder="0.00" keyboardType="numeric" placeholderTextColor={T.muted} />

              {isPizza && !!form.price && Number(form.price) > 0 && (
                <View style={s.previewBox}>
                  <Text style={s.previewLbl}>PRECIOS DINÁMICOS POR TAMAÑO</Text>
                  <Text style={s.previewTxt}>Personal  ×1.0  →  S/. {Math.round(Number(form.price) * 1)}</Text>
                  <Text style={s.previewTxt}>Mediana   ×1.3  →  S/. {Math.round(Number(form.price) * 1.3)}</Text>
                  <Text style={s.previewTxt}>Familiar  ×1.7  →  S/. {Math.round(Number(form.price) * 1.7)}</Text>
                </View>
              )}

              <Text style={s.lbl}>DESCRIPCION</Text>
              <TextInput style={[s.input, s.inputMulti]} value={form.desc}
                onChangeText={v => setForm(p => ({ ...p, desc: v }))}
                multiline placeholder="Detalles del plato..." placeholderTextColor={T.muted} />

              <Text style={s.lbl}>TIEMPO ESTIMADO</Text>
              <TextInput style={s.input} value={form.time}
                onChangeText={v => setForm(p => ({ ...p, time: v }))}
                placeholder="Ej: 25 min" placeholderTextColor={T.muted} />

              <View style={s.modalBtns}>
                <TouchableOpacity style={s.cancelBtn}
                  onPress={() => { setModalOpen(false); setForm(EMPTY_FORM); }}>
                  <Text style={s.cancelTxt}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]}
                  onPress={addPizza} disabled={saving}>
                  {saving
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.saveTxt}>Guardar</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: T.bg },
  topBar:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 20 },
  brand:      { fontSize: 10, color: T.accent, letterSpacing: 3 },
  title:      { fontSize: 22, fontWeight: "800", color: T.text },
  summary:    { fontSize: 11, color: T.muted, marginTop: 4 },
  addBtn:     { backgroundColor: T.accent, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  addBtnTxt:  { color: "#fff", fontWeight: "700" },
  list:       { padding: 20 },
  card:       { backgroundColor: T.card, borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: T.border },
  cardHead:   { flexDirection: "row", gap: 12, marginBottom: 12, alignItems: "center" },
  imgBox:     { width: 45, height: 45, borderRadius: 10, backgroundColor: "#1a0e06", justifyContent: "center", alignItems: "center" },
  name:       { fontSize: 14, fontWeight: "700", color: T.text },
  cat:        { fontSize: 10, color: T.muted, marginTop: 2 },
  price:      { fontSize: 15, fontWeight: "700", color: T.accentSoft },
  badge:      { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeOn:    { backgroundColor: "#22c55e22" },
  badgeOff:   { backgroundColor: T.border },
  badgeTxt:   { fontSize: 10, fontWeight: "600" },
  actions:    { flexDirection: "row", gap: 8 },
  actionBtn:  { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  hideBtn:    { backgroundColor: T.border },
  showBtn:    { backgroundColor: "#22c55e33" },
  actionTxt:  { fontSize: 12, color: T.text },
  delBtn:     { flex: 1, backgroundColor: "#ef444422", borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  delTxt:     { color: "#ef4444", fontSize: 12 },
  emptyBox:   { alignItems: "center", paddingTop: 60 },
  emptyTxt:   { color: T.muted, fontSize: 14 },
  overlay:    { flex: 1, backgroundColor: "#000000bb", justifyContent: "flex-end" },
  modalCard:  { backgroundColor: T.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "92%" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: T.text, marginBottom: 20 },
  lbl:        { fontSize: 9, color: T.muted, letterSpacing: 2, marginBottom: 8 },
  input:      { height: 48, backgroundColor: T.card, borderRadius: 12, paddingHorizontal: 15, color: T.text, marginBottom: 15, borderWidth: 1, borderColor: T.border },
  inputMulti: { height: 60, textAlignVertical: "top", paddingTop: 10 },
  catRow:     { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 15 },
  catChip:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: T.border },
  catChipOn:  { backgroundColor: T.accent, borderColor: T.accent },
  catTxt:     { fontSize: 11, color: T.muted },
  catTxtOn:   { color: "#fff" },
  cameraBox:  { padding: 15, borderWidth: 1, borderStyle: "dashed", borderColor: T.accent, borderRadius: 12, alignItems: "center", marginBottom: 15 },
  cameraTxt:  { fontSize: 10, color: T.accent, fontWeight: "700" },
  previewBox: { backgroundColor: "#fbbf2411", padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: "#fbbf2433" },
  previewLbl: { fontSize: 9, color: "#fbbf24", fontWeight: "700", marginBottom: 5 },
  previewTxt: { fontSize: 11, color: T.text },
  modalBtns:  { flexDirection: "row", gap: 10, marginTop: 10 },
  cancelBtn:  { flex: 1, padding: 14, alignItems: "center" },
  cancelTxt:  { color: T.muted },
  saveBtn:    { flex: 1, backgroundColor: T.accent, borderRadius: 12, padding: 14, alignItems: "center" },
  saveTxt:    { color: "#fff", fontWeight: "700" },
});