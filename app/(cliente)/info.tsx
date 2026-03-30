import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { useApp } from "../../context/AppContext";
import { T } from "../../constants/theme";


const PIZZERIA_LOCATION = {
  latitude:  -12.0773,
  longitude: -77.0892,
};

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


        <View style={s.mapContainer}>
          <MapView
            style={s.map}
            initialRegion={{
              latitude:       PIZZERIA_LOCATION.latitude,
              longitude:      PIZZERIA_LOCATION.longitude,
              latitudeDelta:  0.005,
              longitudeDelta: 0.005,
            }}>
            <Marker
              coordinate={PIZZERIA_LOCATION}
              title="Forno Rosso"
              description={business.address}
              pinColor={T.accent}
            />
          </MapView>

          <View style={s.mapBadge}>
            <Text style={s.mapBadgeTxt}>🍕 {business.name}</Text>
          </View>
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
  root:         { flex:1, backgroundColor:T.bg },
  scroll:       { padding:20, paddingBottom:40 },
  brand:        { fontSize:10, color:T.accent, letterSpacing:4, marginBottom:4 },
  title:        { fontSize:26, fontWeight:"800", color:T.text, marginBottom:16 },
  mapContainer: { borderRadius:18, overflow:"hidden", height:200, marginBottom:12, borderWidth:1, borderColor:T.border },
  map:          { flex:1 },
  mapBadge:     { position:"absolute", bottom:10, left:10, backgroundColor:"#000000bb", borderRadius:10, paddingHorizontal:10, paddingVertical:6 },
  mapBadgeTxt:  { fontSize:12, color:"#fff", fontWeight:"700" },
  card:         { backgroundColor:T.card, borderRadius:18, borderWidth:1, borderColor:T.border, padding:14, flexDirection:"row", gap:14, alignItems:"flex-start", marginBottom:10 },
  cardLbl:      { fontSize:10, color:T.muted, letterSpacing:3, marginBottom:6 },
  cardVal:      { fontSize:14, color:T.text, lineHeight:20 },
});