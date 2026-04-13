import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ref, update } from "firebase/database";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { database } from "../../firebaseConfig";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import { T } from "../../constants/theme";

const GOOGLE_MAPS_APIKEY = "AIzaSyDb1EiZ9DVXsc_iyArQP3ZprqGPLQz6bCA";


const CLIENTE_LOCATION = {
  latitude:  -6.8750,
  longitude: -79.8697,
};

export default function EntregasScreen() {
  const { orders, updateOrderStatus, user } = useApp();
  const router = useRouter();

  const [location,      setLocation]      = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [routeInfo,     setRouteInfo]     = useState<{ distance: string; duration: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permiso de ubicacion denegado");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude:  loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const ready    = orders.filter(o => o.status === "En preparacion");
  const onTheWay = orders.filter(o => o.status === "En camino" && o.repartidorId === user?.uid);

  const pickup = async (id: string) => {
    await update(ref(database, `orders/${id}`), {
      status:       "En camino",
      repartidorId: user?.uid ?? "",
    });
  };

  const deliver = async (id: string) => await updateOrderStatus(id, "Entregado");

  const renderCard = (item: any) => (
    <View style={s.card}>
      <View style={s.cardHead}>
        <View>
          <Text style={s.orderId}>Pedido #{String(item.id).slice(-5)}</Text>
          <Text style={s.client}>{item.clientName}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <Text style={s.addr}>📍 {item.address}</Text>
      {item.items?.map((it: any, i: number) => (
        <Text key={i} style={s.itemLine}>🍕 {it.name} ×{it.qty}</Text>
      ))}
      <Text style={s.total}>Total:  S/. {item.total}</Text>


      {item.status === "En camino" && (
        location ? (
          <View>

            {routeInfo && (
              <View style={s.routeInfo}>
                <Text style={s.routeInfoTxt}>
                  🛣️ {routeInfo.distance} km  ·  ⏱️ {routeInfo.duration} min
                </Text>
              </View>
            )}

            <View style={s.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={s.map}
                initialRegion={{

                  latitude:       (location.latitude  + CLIENTE_LOCATION.latitude)  / 2,
                  longitude:      (location.longitude + CLIENTE_LOCATION.longitude) / 2,
                  latitudeDelta:  Math.abs(location.latitude  - CLIENTE_LOCATION.latitude)  * 2.5,
                  longitudeDelta: Math.abs(location.longitude - CLIENTE_LOCATION.longitude) * 2.5,
                }}>


                <Marker
                  coordinate={location}
                  title="Tu ubicacion 🛵"
                  description="Estás aquí"
                  pinColor="blue"
                />

                <Marker
                  coordinate={CLIENTE_LOCATION}
                  title={item.clientName}
                  description={item.address}
                  pinColor="#22c55e"
                />

                <MapViewDirections
                  origin={location}
                  destination={CLIENTE_LOCATION}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={4}
                  strokeColor={T.accent}
                  optimizeWaypoints={true}
                  onReady={(result: any) => {
                    setRouteInfo({
                      distance: result.distance.toFixed(1),
                      duration: Math.round(result.duration).toString(),
                    });
                    console.log(`Distancia: ${result.distance} km`);
                    console.log(`Duracion estimada: ${result.duration} min.`);
                  }}
                  onError={(errorMessage: any) => {
                    console.error("Error al trazar ruta: ", errorMessage);
                  }}
                />
              </MapView>
            </View>
          </View>
        ) : (
          <View style={s.mapBox}>
            <Text style={s.mapDot}>🛵</Text>
            <View style={s.mapRoute} />
            <Text style={s.mapPin}>📍</Text>
            <Text style={s.mapLabel}>{locationError || "Obteniendo GPS..."}</Text>
          </View>
        )
      )}

      <View style={s.btnRow}>
        {item.status === "En preparacion" && (
          <TouchableOpacity style={s.pickupBtn} onPress={() => pickup(item.id)}>
            <Text style={s.pickupTxt}>🛵 Recoger y Salir</Text>
          </TouchableOpacity>
        )}

        {item.status === "En camino" && (
          <View style={s.actionRow}>
            <TouchableOpacity
              style={s.chatBtn}
              onPress={() => router.push(`/chat?orderId=${item.id}&senderRole=repartidor` as any)}>
              <Text style={s.chatTxt}>💬 Chatear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.deliverBtn} onPress={() => deliver(item.id)}>
              <Text style={s.deliverTxt}>✅ Confirmar Entrega</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.root}>
      <Text style={s.brand}>REPARTIDOR</Text>
      <Text style={s.title}>Mis Entregas</Text>

      {ready.length === 0 && onTheWay.length === 0 && (
        <View style={s.emptyBox}>
          <Text style={{ fontSize: 46, marginBottom: 10 }}>🛵</Text>
          <Text style={s.emptyTxt}>No hay entregas asignadas</Text>
          <Text style={s.emptyHint}>Aparecen aqui cuando el admin aprueba un pedido</Text>
        </View>
      )}

      <FlatList
        data={[...onTheWay, ...ready]}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        renderItem={({ item }) => renderCard(item)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: T.bg },
  brand:        { fontSize: 10, color: T.accent, letterSpacing: 4, paddingHorizontal: 20, paddingTop: 16 },
  title:        { fontSize: 26, fontWeight: "800", color: T.text, paddingHorizontal: 20, marginBottom: 4 },
  list:         { padding: 20 },
  card:         { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12 },
  cardHead:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  orderId:      { fontSize: 15, fontWeight: "700", color: T.text },
  client:       { fontSize: 12, color: T.muted, marginTop: 2 },
  addr:         { fontSize: 12, color: T.muted, marginBottom: 6 },
  itemLine:     { fontSize: 13, color: T.text, marginBottom: 3 },
  total:        { fontSize: 14, fontWeight: "700", color: T.accentSoft, marginTop: 6 },
  routeInfo:    { backgroundColor: "#1a0e06", borderRadius: 10, padding: 8, marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: T.accent + "44" },
  routeInfoTxt: { fontSize: 12, color: T.accentSoft, fontWeight: "700" },
  mapContainer: { borderRadius: 14, overflow: "hidden", marginTop: 8, height: 355, borderWidth: 1, borderColor: T.border },
  map:          { flex: 1 },
  mapBox:       { backgroundColor: "#0a1220", borderRadius: 14, height: 90, marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", borderWidth: 1, borderColor: T.border + "44" },
  mapDot:       { fontSize: 28 },
  mapRoute:     { flex: 1, height: 2, backgroundColor: T.accentSoft, marginHorizontal: 8 },
  mapPin:       { fontSize: 28 },
  mapLabel:     { position: "absolute", bottom: 4, right: 8, fontSize: 8, color: T.accent, letterSpacing: 2 },
  btnRow:       { marginTop: 12 },
  pickupBtn:    { backgroundColor: T.blue, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  pickupTxt:    { color: "#fff", fontWeight: "700", fontSize: 14 },
  actionRow:    { flexDirection: "row", gap: 8 },
  chatBtn:      { flex: 1, backgroundColor: "#1a2e1a", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#22c55e44" },
  chatTxt:      { color: "#22c55e", fontWeight: "700", fontSize: 13 },
  deliverBtn:   { flex: 2, backgroundColor: T.green, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  deliverTxt:   { color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyBox:     { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyTxt:     { color: T.muted, fontSize: 15, marginBottom: 6 },
  emptyHint:    { color: T.border, fontSize: 12, textAlign: "center" },
});