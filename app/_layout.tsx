import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { AppProvider, useApp } from "../context/AppContext";
import { T } from "../constants/theme";

function Guard() {
  const { user, role, authLoading } = useApp();
  const router   = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (authLoading) return;

    const inPublic =
      (segments[0] as string) === "index"    ||
      (segments[0] as string) === "login"    ||
      (segments[0] as string) === "register";

    if (!user) {
      if (!inPublic) router.replace("/");
      return;
    }

    if (!role) return;

    if (role === "admin") {
      router.replace("/(admin)/pedidos" as any);
    } else if (role === "repartidor") {
      router.replace("/(repartidor)/entregas" as any);
    } else {
      router.replace("/(cliente)/" as any);
    }
  }, [user, role, authLoading]);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: T.bg }}>
        <ActivityIndicator color={T.accent} size="large" />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />
      <Guard />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: T.bg } }}>
        <Stack.Screen name="index"        options={{ headerShown: false }} />
        <Stack.Screen name="login"        options={{ headerShown: false }} />
        <Stack.Screen name="register"     options={{ headerShown: false }} />
        <Stack.Screen name="detail"       options={{ headerShown: false }} />
        <Stack.Screen name="tracking"     options={{ headerShown: false }} />
        <Stack.Screen name="(cliente)"    options={{ headerShown: false }} />
        <Stack.Screen name="(admin)"      options={{ headerShown: false }} />
        <Stack.Screen name="(repartidor)" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}