import { useState } from "react";
import {
  Alert, Platform, StyleSheet, TextInput, View,
  TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebaseConfig";
import { FirebaseError } from "firebase/app";
import { T } from "../constants/theme";

export default function RegisterScreen() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const showMessage = (msg: string) => {
    if (Platform.OS === "web") alert(msg);
    else Alert.alert("Aviso", msg);
  };

  const register = async () => {
    if (!name || !email || !password || !confirm) {
      showMessage("Por favor completa todos los campos");
      return;
    }
    if (password !== confirm) {
      showMessage("Las contrasenias no coinciden");
      return;
    }
    if (password.length < 6) {
      showMessage("La contrasenia debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Guardar datos completos en Realtime Database
      await set(ref(database, `users/${cred.user.uid}`), {
        name,
        email,
        phone,
        address,   // ← direccion guardada desde el registro
        role:      "cliente",
        createdAt: Date.now(),
      });
      showMessage("Cuenta creada exitosamente 🎉");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          showMessage("Este correo ya esta registrado. Intenta iniciar sesion.");
        } else if (error.code === "auth/weak-password") {
          showMessage("La contrasenia debe tener al menos 6 caracteres");
        } else if (error.code === "auth/invalid-email") {
          showMessage("Por favor ingresa un correo valido");
        } else {
          showMessage(error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <Text style={s.backTxt}>← Volver</Text>
        </TouchableOpacity>

        <Text style={s.brand}>FORNO ROSSO</Text>
        <Text style={s.title}>Crear Cuenta</Text>
        <Text style={s.sub}>Solo para clientes. El admin crea cuentas de repartidor.</Text>

        <View style={s.card}>
          <Text style={s.label}>NOMBRE COMPLETO</Text>
          <TextInput style={s.input} placeholder="Juan Perez"
            placeholderTextColor={T.muted} value={name} onChangeText={setName} />

          <Text style={s.label}>CORREO ELECTRONICO</Text>
          <TextInput style={s.input} placeholder="correo@gmail.com"
            placeholderTextColor={T.muted} value={email} onChangeText={setEmail}
            autoCapitalize="none" keyboardType="email-address" />

          <Text style={s.label}>TELEFONO</Text>
          <TextInput style={s.input} placeholder="+51 999 999 999"
            placeholderTextColor={T.muted} value={phone} onChangeText={setPhone}
            keyboardType="phone-pad" />

          <Text style={s.label}>DIRECCION DE ENTREGA</Text>
          <TextInput style={s.input} placeholder="Ej: Jr. Las Flores 456, Lima"
            placeholderTextColor={T.muted} value={address} onChangeText={setAddress} />

          <Text style={s.label}>CONTRASENIA</Text>
          <TextInput style={s.input} placeholder="Minimo 6 caracteres"
            placeholderTextColor={T.muted} value={password} onChangeText={setPassword}
            secureTextEntry autoCapitalize="none" />

          <Text style={s.label}>CONFIRMAR CONTRASENIA</Text>
          <TextInput style={s.input} placeholder="Repite tu contrasenia"
            placeholderTextColor={T.muted} value={confirm} onChangeText={setConfirm}
            secureTextEntry autoCapitalize="none" />

          <TouchableOpacity
            style={[s.btn, isLoading && s.btnOff]}
            onPress={register} disabled={isLoading} activeOpacity={0.8}>
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnTxt}>Crear Cuenta</Text>}
          </TouchableOpacity>
        </View>

        <View style={s.row}>
          <Text style={s.footTxt}>Ya tienes cuenta?  </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={s.footLink}>Inicia sesion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: T.bg },
  scroll:  { flexGrow: 1, padding: 24, paddingBottom: 40 },
  back:    { marginBottom: 20 },
  backTxt: { color: T.muted, fontSize: 14 },
  brand:   { fontSize: 10, color: T.accent, letterSpacing: 4, marginBottom: 4 },
  title:   { fontSize: 28, fontWeight: "800", color: T.text, marginBottom: 6 },
  sub:     { fontSize: 12, color: T.muted, marginBottom: 28 },
  card:    { backgroundColor: T.card, borderRadius: 20, borderWidth: 1, borderColor: T.border, padding: 20, marginBottom: 16 },
  label:   { fontSize: 10, color: T.muted, letterSpacing: 3, marginBottom: 8 },
  input:   { height: 52, backgroundColor: T.surface, borderWidth: 2, borderColor: T.border, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: T.text, marginBottom: 16 },
  btn:     { backgroundColor: T.accent, height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center", marginTop: 4, shadowColor: T.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  btnOff:  { opacity: 0.6 },
  btnTxt:  { color: "#fff", fontSize: 16, fontWeight: "700" },
  row:     { flexDirection: "row", justifyContent: "center" },
  footTxt: { fontSize: 13, color: T.muted },
  footLink:{ fontSize: 13, color: T.accentSoft, fontWeight: "600" },
});