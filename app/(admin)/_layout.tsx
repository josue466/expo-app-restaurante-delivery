import { Tabs } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { T } from "../../constants/theme";

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: s.bar,
      tabBarActiveTintColor:   T.accent,
      tabBarInactiveTintColor: T.muted,
      tabBarLabelStyle: s.lbl,
    }}>
      <Tabs.Screen name="pedidos"  options={{ title:"PEDIDOS", tabBarIcon:({ color }) => <Text style={{ fontSize:18, color }}>📋</Text> }} />
      <Tabs.Screen name="menu"     options={{ title:"MENU",    tabBarIcon:({ color }) => <Text style={{ fontSize:18, color }}>🍕</Text> }} />
      <Tabs.Screen name="stats"    options={{ title:"STATS",   tabBarIcon:({ color }) => <Text style={{ fontSize:18, color }}>📊</Text> }} />
      <Tabs.Screen name="negocio"  options={{ title:"NEGOCIO", tabBarIcon:({ color }) => <Text style={{ fontSize:18, color }}>🏪</Text> }} />
      <Tabs.Screen name="perfil"   options={{ title:"YO",      tabBarIcon:({ color }) => <Text style={{ fontSize:18, color }}>⚙️</Text> }} />
    </Tabs>
  );
}
const s = StyleSheet.create({
  bar: { backgroundColor:T.surface, borderTopWidth:1, borderTopColor:T.border, height:62 },
  lbl: { fontSize:8, letterSpacing:0.5 },
});
