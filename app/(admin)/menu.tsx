import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
  SafeAreaView, ScrollView, Modal, Alert, Platform,
} from "react-native";
import { useApp } from "../../context/AppContext";
import { T } from "../../constants/theme";
import { Pizza } from "../../constants/Data";

const CATS = ["Clasicas", "Especiales", "Bebidas", "Postres"];

export default function MenuAdminScreen() {
  const { pizzas, setPizzas } = useApp();
  const [modal, setModal]   = useState(false);
  const [name, setName]     = useState("");
  const [price, setPrice]   = useState("");
  const [desc, setDesc]     = useState("");
  const [cat, setCat]       = useState("Clasicas");

  const toggleAvail = (id: number) => {
    setPizzas(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };
  const deleteItem = (id: number) => {
    setPizzas(prev => prev.filter(p => p.id !== id));
  };
  const addItem = () => {
    if (!name || !price) {
      if (Platform.OS === "web") alert("Completa nombre y precio");
      else Alert.alert("Aviso", "Completa nombre y precio");
      return;
    }
    const newP: Pizza = {
      id:        Date.now(),
      name,
      category:  cat,
      price:     parseFloat(price) || 0,
      desc,
      img:       null,
      rating:    5.0,
      time:      "30 min",
      available: true,
    };
    setPizzas(prev => [newP, ...prev]);
    setModal(false);
    setName(""); setPrice(""); setDesc(""); setCat("Clasicas");
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <View>
          <Text style={s.brand}>ADMIN / COCINERO</Text>
          <Text style={s.title}>Gestion del Menu</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setModal(true)}>
          <Text style={s.addTxt}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pizzas}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={[s.card, !item.available && s.cardOff]}>
            <View style={s.imgBox}><Text style={{ fontSize:26 }}>🍕</Text></View>
            <View style={{ flex:1 }}>
              <Text style={s.itemName}>{item.name}</Text>
              <Text style={s.itemCat}>{item.category}</Text>
              <Text style={s.itemPrice}>S/. {item.price}</Text>
            </View>
            <View style={s.actions}>
              <TouchableOpacity style={[s.actBtn, item.available ? s.actBtnGreen : s.actBtnRed]}
                onPress={() => toggleAvail(item.id)}>
                <Text style={s.actBtnTxt}>{item.available ? "✓ Activo" : "✗ Oculto"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.delBtn} onPress={() => deleteItem(item.id)}>
                <Text style={s.delTxt}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal agregar */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={s.overlay}>
          <ScrollView contentContainerStyle={s.modalCard}>
            <Text style={s.modalTitle}>Agregar Plato</Text>

            <Text style={s.label}>NOMBRE</Text>
            <TextInput style={s.input} placeholder="Nombre del plato" placeholderTextColor={T.muted}
              value={name} onChangeText={setName} />

            <Text style={s.label}>PRECIO  (S/.)</Text>
            <TextInput style={s.input} placeholder="0.00" placeholderTextColor={T.muted}
              value={price} onChangeText={setPrice} keyboardType="numeric" />

            <Text style={s.label}>DESCRIPCION</Text>
            <TextInput style={[s.input, { height:80, textAlignVertical:"top" }]}
              placeholder="Descripcion del plato..." placeholderTextColor={T.muted}
              value={desc} onChangeText={setDesc} multiline />

            <Text style={s.label}>CATEGORIA</Text>
            <View style={s.catRow}>
              {CATS.map(c => (
                <TouchableOpacity key={c} style={[s.catBtn, cat===c && s.catBtnOn]} onPress={() => setCat(c)}>
                  <Text style={[s.catTxt, cat===c && s.catTxtOn]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.imgNote}>📸 Camara / Galeria — EVAL. FINAL</Text>

            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setModal(false)}>
                <Text style={s.cancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={addItem}>
                <Text style={s.saveTxt}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:T.bg },
  header:     { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-end", paddingHorizontal:20, paddingTop:16, paddingBottom:10 },
  brand:      { fontSize:10, color:T.accent, letterSpacing:4 },
  title:      { fontSize:22, fontWeight:"800", color:T.text },
  addBtn:     { backgroundColor:T.accent, borderRadius:12, paddingHorizontal:16, paddingVertical:8, shadowColor:T.accent, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:6, elevation:3 },
  addTxt:     { color:"#fff", fontWeight:"700", fontSize:14 },
  list:       { padding:20 },
  card:       { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:14, flexDirection:"row", alignItems:"center", gap:12, marginBottom:10 },
  cardOff:    { opacity:0.5 },
  imgBox:     { width:52, height:52, borderRadius:12, backgroundColor:"#1a0e06", justifyContent:"center", alignItems:"center" },
  itemName:   { fontSize:14, fontWeight:"700", color:T.text },
  itemCat:    { fontSize:11, color:T.muted, marginTop:2 },
  itemPrice:  { fontSize:14, color:T.accentSoft, fontWeight:"700", marginTop:4 },
  actions:    { alignItems:"flex-end", gap:6 },
  actBtn:     { borderRadius:8, paddingHorizontal:10, paddingVertical:4 },
  actBtnGreen:{ backgroundColor:T.green+"33" },
  actBtnRed:  { backgroundColor:T.red+"33" },
  actBtnTxt:  { fontSize:11, fontWeight:"600", color:T.text },
  delBtn:     { backgroundColor:T.red+"22", borderRadius:8, paddingHorizontal:8, paddingVertical:4 },
  delTxt:     { fontSize:16 },
  overlay:    { flex:1, backgroundColor:"rgba(0,0,0,0.7)", justifyContent:"flex-end" },
  modalCard:  { backgroundColor:T.surface, borderTopLeftRadius:24, borderTopRightRadius:24, padding:24, paddingBottom:40 },
  modalTitle: { fontSize:20, fontWeight:"800", color:T.text, marginBottom:20 },
  label:      { fontSize:10, color:T.muted, letterSpacing:3, marginBottom:8 },
  input:      { height:52, backgroundColor:T.card, borderWidth:2, borderColor:T.border, borderRadius:14, paddingHorizontal:16, fontSize:14, color:T.text, marginBottom:16 },
  catRow:     { flexDirection:"row", flexWrap:"wrap", gap:8, marginBottom:16 },
  catBtn:     { paddingHorizontal:14, paddingVertical:8, borderRadius:20, backgroundColor:T.card, borderWidth:1, borderColor:T.border },
  catBtnOn:   { backgroundColor:T.accent, borderColor:T.accent },
  catTxt:     { fontSize:12, color:T.muted },
  catTxtOn:   { color:"#fff" },
  imgNote:    { fontSize:10, color:T.accent, letterSpacing:2, marginBottom:20 },
  modalBtns:  { flexDirection:"row", gap:12 },
  cancelBtn:  { flex:1, backgroundColor:T.card, borderRadius:14, paddingVertical:14, alignItems:"center", borderWidth:1, borderColor:T.border },
  cancelTxt:  { color:T.muted, fontSize:15 },
  saveBtn:    { flex:1, backgroundColor:T.accent, borderRadius:14, paddingVertical:14, alignItems:"center", shadowColor:T.accent, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:6, elevation:3 },
  saveTxt:    { color:"#fff", fontWeight:"700", fontSize:15 },
});
