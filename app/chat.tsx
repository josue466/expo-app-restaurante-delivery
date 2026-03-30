import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ref, push, onValue } from "firebase/database";
import { database } from "../firebaseConfig";
import { useApp } from "../context/AppContext";
import { T } from "../constants/theme";

type Msg = {
  id:     string;
  text:   string;
  sender: string;
  time:   string;
};

export default function ChatScreen() {
  const { orderId, senderRole } = useLocalSearchParams<{ orderId: string; senderRole: string }>();
  const { user } = useApp();
  const router   = useRouter();

  const [msgs,  setMsgs]  = useState<Msg[]>([]);
  const [text,  setText]  = useState("");
  const listRef = useRef<FlatList>(null);

  
  useEffect(() => {
    if (!orderId) return;
    const unsub = onValue(ref(database, `chats/${orderId}`), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const lista: Msg[] = Object.keys(data).map(key => ({
          id: key, ...data[key],
        }));
        lista.sort((a, b) => a.time.localeCompare(b.time));
        setMsgs(lista);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      } else {
        setMsgs([]);
      }
    });
    return () => unsub();
  }, [orderId]);


  const send = async () => {
    if (!text.trim() || !orderId) return;
    await push(ref(database, `chats/${orderId}`), {
      text:   text.trim(),
      sender: senderRole,
      time:   new Date().toISOString(),
    });
    setText("");
  };

  const renderMsg = ({ item }: { item: Msg }) => {
    const isMine = item.sender === senderRole;
    return (
      <View style={[s.bubble, isMine ? s.bubbleMine : s.bubbleOther]}>
        <Text style={[s.bubbleSender, isMine && { color: "#fff9" }]}>
          {item.sender === "cliente" ? "🙋 Cliente" : "🛵 Repartidor"}
        </Text>
        <Text style={[s.bubbleText, isMine && { color: "#fff" }]}>{item.text}</Text>
        <Text style={[s.bubbleTime, isMine && { color: "#fff9" }]}>
          {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.root}>

      <View style={s.header}>
        <TouchableOpacity onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace("/(cliente)" as any);
        }}>
          <Text style={s.backTxt}>← Volver</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.headerTitle}>Chat del Pedido</Text>
          <Text style={s.headerSub}>#{String(orderId).slice(-6)}  ·  En camino 🛵</Text>
        </View>
        <View style={s.onlineDot} />
      </View>


      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={item => item.id}
        contentContainerStyle={s.list}
        renderItem={renderMsg}
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>💬</Text>
            <Text style={s.emptyTxt}>Inicia la conversacion</Text>
            <Text style={s.emptyTxt}>Puedes preguntar "¿Dónde estás?" o "Toca el timbre"</Text>
          </View>
        }
      />


      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={text}
            onChangeText={setText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={T.muted}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[s.sendBtn, !text.trim() && { opacity: 0.4 }]}
            onPress={send}
            disabled={!text.trim()}>
            <Text style={s.sendTxt}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: T.bg },
  header:       { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.surface },
  backTxt:      { color: T.muted, fontSize: 14 },
  headerTitle:  { fontSize: 15, fontWeight: "700", color: T.text },
  headerSub:    { fontSize: 11, color: T.muted, marginTop: 2 },
  onlineDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: "#22c55e" },
  list:         { padding: 16, paddingBottom: 8 },
  bubble:       { maxWidth: "75%", borderRadius: 16, padding: 12, marginBottom: 8 },
  bubbleMine:   { backgroundColor: T.accent, alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleOther:  { backgroundColor: T.card, alignSelf: "flex-start", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: T.border },
  bubbleSender: { fontSize: 10, color: T.muted, marginBottom: 4, fontWeight: "600" },
  bubbleText:   { fontSize: 14, color: T.text },
  bubbleTime:   { fontSize: 10, color: T.muted, marginTop: 4, textAlign: "right" },
  emptyBox:     { alignItems: "center", paddingTop: 60 },
  emptyTxt:     { fontSize: 15, color: T.muted, marginBottom: 6 },
  emptyHint:    { fontSize: 12, color: T.border, textAlign: "center", paddingHorizontal: 40 },
  inputRow:     { flexDirection: "row", padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: T.border, backgroundColor: T.surface },
  input:        { flex: 1, height: 46, backgroundColor: T.card, borderRadius: 23, paddingHorizontal: 16, color: T.text, fontSize: 14, borderWidth: 1, borderColor: T.border },
  sendBtn:      { backgroundColor: T.accent, borderRadius: 23, paddingHorizontal: 20, justifyContent: "center" },
  sendTxt:      { color: "#fff", fontWeight: "700", fontSize: 14 },
});
