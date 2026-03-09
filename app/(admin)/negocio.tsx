import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, Alert, Platform,
} from "react-native";
import { useApp } from "../../context/AppContext";
import { T } from "../../constants/theme";

const FIELDS: { label:string; key:keyof import("../../constants/Data").Business; multiline?:boolean }[] = [
  { label:"NOMBRE DEL NEGOCIO",       key:"name" },
  { label:"TELEFONO DE CONTACTO",     key:"phone" },
  { label:"DIRECCION FISICA",         key:"address" },
  { label:"HORARIOS DE ATENCION",     key:"schedule",  multiline:true },
  { label:"ZONA Y TIEMPO DE DELIVERY",key:"delivery" },
  { label:"PROMOCION ACTIVA",         key:"promo" },
];

export default function NegocioScreen() {
  const { business, setBusiness } = useApp();
  const [form, setForm] = useState({ ...business });

  const save = () => {
    setBusiness(form);
    if (Platform.OS === "web") alert("Datos actualizados ✅");
    else Alert.alert("Guardado ✅", "Datos del negocio actualizados");
  };

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.brand}>ADMIN / COCINERO</Text>
        <Text style={s.title}>Configuracion del Negocio</Text>

        <View style={s.card}>
          {FIELDS.map(f => (
            <View key={f.key}>
              <Text style={s.label}>{f.label}</Text>
              <TextInput
                style={[s.input, f.multiline && { height:80, textAlignVertical:"top" }]}
                value={form[f.key]}
                onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                placeholderTextColor={T.muted}
                multiline={f.multiline}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.saveBtn} onPress={save}>
          <Text style={s.saveTxt}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root:    { flex:1, backgroundColor:T.bg },
  scroll:  { padding:20, paddingBottom:40 },
  brand:   { fontSize:10, color:T.accent, letterSpacing:4, marginBottom:4 },
  title:   { fontSize:26, fontWeight:"800", color:T.text, marginBottom:16 },
  card:    { backgroundColor:T.card, borderRadius:20, borderWidth:1, borderColor:T.border, padding:20, marginBottom:16 },
  label:   { fontSize:10, color:T.muted, letterSpacing:3, marginBottom:8 },
  input:   { height:52, backgroundColor:T.surface, borderWidth:2, borderColor:T.border, borderRadius:14, paddingHorizontal:16, fontSize:14, color:T.text, marginBottom:16 },
  saveBtn: { backgroundColor:T.accent, borderRadius:16, paddingVertical:16, alignItems:"center", shadowColor:T.accent, shadowOffset:{width:0,height:4}, shadowOpacity:0.35, shadowRadius:8, elevation:4 },
  saveTxt: { color:"#fff", fontSize:16, fontWeight:"700" },
});
