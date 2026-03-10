import { useState } from "react";
import {
  Alert, Platform, StyleSheet, TextInput, View,
  TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { T } from "../constants/theme";

export default function LoginScreen() {
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const showMessage = (msg: string) => {
    if (Platform.OS === "web") alert(msg);
    else Alert.alert("Aviso", msg);
  };

  const login = async () => {
    if (!email || !password) {
      showMessage("Por favor completa todos los campos");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        showMessage("Correo o contrasena incorrectos");
      } else if (error.code === "auth/user-not-found") {
        showMessage("No existe una cuenta con este correo");
      } else {
        showMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={s.back} onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/" as any);
          }}>
            <Text style={s.backTxt}>← Volver</Text>
          </TouchableOpacity>

          <Text style={s.brand}>FORNO ROSSO</Text>
          <Text style={s.title}>Iniciar Sesion</Text>
          <Text style={s.sub}>Accede para gestionar tus pedidos</Text>

          <View style={s.card}>
            <Text style={s.label}>CORREO ELECTRONICO</Text>
            <TextInput
              style={s.input}
              placeholder="correo@gmail.com"
              placeholderTextColor={T.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={s.label}>CONTRASEÑA</Text>
            <TextInput
              style={s.input}
              placeholder="Tu contrasena"
              placeholderTextColor={T.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[s.btn, isLoading && s.btnOff]}
              onPress={login}
              disabled={isLoading}
              activeOpacity={0.8}>
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnTxt}>Iniciar Sesion</Text>}
            </TouchableOpacity>
          </View>

          <View style={s.row}>
            <Text style={s.footTxt}>No tienes cuenta?  </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={s.footLink}>Registrate</Text>
            </TouchableOpacity>
          </View>

          <View style={s.demo}>
            <Text style={s.demoTitle}>⚡  CREDENCIALES DEMO</Text>
            <Text style={s.demoTxt}>
              {"Cliente    :  cliente@demo.com  /  123456\n"}
              {"Admin      :  admin@demo.com    /  admin123\n"}
              {"Repartidor :  repartidor@demo.com  /  rep123"}
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex:1, backgroundColor:T.bg },
  root:      { flex:1 },
  scroll:    { flexGrow:1, padding:24, paddingBottom:40 },
  back:      { marginBottom:20 },
  backTxt:   { color:T.muted, fontSize:14 },
  brand:     { fontSize:10, color:T.accent, letterSpacing:4, marginBottom:4 },
  title:     { fontSize:28, fontWeight:"800", color:T.text, marginBottom:6 },
  sub:       { fontSize:13, color:T.muted, marginBottom:28 },
  card:      { backgroundColor:T.card, borderRadius:20, borderWidth:1, borderColor:T.border, padding:20, marginBottom:16 },
  label:     { fontSize:10, color:T.muted, letterSpacing:3, marginBottom:8 },
  input:     { height:52, backgroundColor:T.surface, borderWidth:2, borderColor:T.border, borderRadius:14, paddingHorizontal:16, fontSize:15, color:T.text, marginBottom:16 },
  btn:       { backgroundColor:T.accent, height:52, borderRadius:14, justifyContent:"center", alignItems:"center", marginTop:4, shadowColor:T.accent, shadowOffset:{width:0,height:4}, shadowOpacity:0.35, shadowRadius:8, elevation:4 },
  btnOff:    { opacity:0.6 },
  btnTxt:    { color:"#fff", fontSize:16, fontWeight:"700" },
  row:       { flexDirection:"row", justifyContent:"center", marginBottom:20 },
  footTxt:   { fontSize:13, color:T.muted },
  footLink:  { fontSize:13, color:T.accentSoft, fontWeight:"600" },
  demo:      { backgroundColor:T.card, borderRadius:14, borderWidth:1, borderColor:T.border, padding:16 },
  demoTitle: { fontSize:10, color:T.gold, letterSpacing:2, marginBottom:8 },
  demoTxt:   { fontSize:11, color:T.muted, lineHeight:18 },
});