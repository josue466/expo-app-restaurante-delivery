import { Tabs } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { T } from "../../constants/theme";

export default function RepartidorLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: s.bar,
      tabBarActiveTintColor:   T.accent,
      tabBarInactiveTintColor: T.muted,
      tabBarLabelStyle: s.lbl,
    }}>
      <Tabs.Screen name="entregas" options={{ title:"ENTREGAS", tabBarIcon:({ color }) => <Text style={{ fontSize:20, color }}>🛵</Text> }} />
      <Tabs.Screen name="perfil"   options={{ title:"YO",       tabBarIcon:({ color }) => <Text style={{ fontSize:20, color }}>👤</Text> }} />
    </Tabs>
  );
}
const s = StyleSheet.create({
  bar: { backgroundColor:T.surface, borderTopWidth:1, borderTopColor:T.border, height:62 },
  lbl: { fontSize:9, letterSpacing:0.5 },
});
