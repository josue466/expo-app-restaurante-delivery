import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { T } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

export default function ClienteLayout() {
  const { cartCount } = useApp();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: s.bar,
      tabBarActiveTintColor:   T.accent,
      tabBarInactiveTintColor: T.muted,
      tabBarLabelStyle: s.lbl,
    }}>
      <Tabs.Screen name="index"  options={{ title:"MENU",   tabBarIcon:({ color }) => <Text style={{ fontSize:20, color }}>🍕</Text> }} />
      <Tabs.Screen name="info"   options={{ title:"INFO",   tabBarIcon:({ color }) => <Text style={{ fontSize:20, color }}>📍</Text> }} />
      <Tabs.Screen name="cart"   options={{ title:"PEDIDO",
        tabBarIcon:({ color }) => (
          <View>
            <Text style={{ fontSize:20, color }}>🛒</Text>
            {cartCount > 0 && (
              <View style={s.badge}><Text style={s.badgeTxt}>{cartCount}</Text></View>
            )}
          </View>
        ),
      }} />
      <Tabs.Screen name="perfil" options={{ title:"YO",    tabBarIcon:({ color }) => <Text style={{ fontSize:20, color }}>👤</Text> }} />
    </Tabs>
  );
}
const s = StyleSheet.create({
  bar:      { backgroundColor:T.surface, borderTopWidth:1, borderTopColor:T.border, height:62 },
  lbl:      { fontSize:9, letterSpacing:0.5 },
  badge:    { position:"absolute", top:-4, right:-8, backgroundColor:T.accent, borderRadius:8, width:16, height:16, justifyContent:"center", alignItems:"center" },
  badgeTxt: { color:"#fff", fontSize:9, fontWeight:"700" },
});
