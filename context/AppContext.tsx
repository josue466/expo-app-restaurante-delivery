import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, get, set, push, onValue } from "firebase/database";
import { auth, database } from "../firebaseConfig";
import {
  INIT_PIZZAS, INIT_BUSINESS, INIT_REPARTIDORES,
  Pizza, Order, Business, Repartidor, CartItem,
} from "../constants/Data";

type AppContextType = {
  user:            User | null;
  role:            string;
  authLoading:     boolean;
  cart:            CartItem[];
  setCart:         React.Dispatch<React.SetStateAction<CartItem[]>>;
  orders:          Order[];
  setOrders:       React.Dispatch<React.SetStateAction<Order[]>>;
  addOrder:        (order: Omit<Order, "id">) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  pizzas:          Pizza[];
  setPizzas:       React.Dispatch<React.SetStateAction<Pizza[]>>;
  business:        Business;
  setBusiness:     React.Dispatch<React.SetStateAction<Business>>;
  repartidores:    Repartidor[];
  setRepartidores: React.Dispatch<React.SetStateAction<Repartidor[]>>;
  cartCount:       number;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [role, setRole]               = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart]               = useState<CartItem[]>([]);
  const [orders, setOrders]           = useState<Order[]>([]);
  const [pizzas, setPizzas]           = useState<Pizza[]>(INIT_PIZZAS);
  const [business, setBusiness]       = useState<Business>(INIT_BUSINESS);
  const [repartidores, setRepartidores] = useState<Repartidor[]>(INIT_REPARTIDORES);

  // ── Listener de autenticacion
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const snap = await get(ref(database, `users/${firebaseUser.uid}/role`));
          setRole(snap.exists() ? snap.val() : "cliente");
        } catch {
          setRole("cliente");
        }
      } else {
        setUser(null);
        setRole("");
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // ── Listener de pedidos en tiempo real desde Firebase
  useEffect(() => {
    const ordersRef = ref(database, "orders");
    const unsub = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista: Order[] = Object.keys(data).map(key => ({
          ...data[key],
          id: key, // usamos el key de Firebase como id
        }));
        // Ordenar por fecha descendente
        lista.sort((a, b) => String(b.date).localeCompare(String(a.date)));
        setOrders(lista);
      } else {
        setOrders([]);
      }
    });
    return () => unsub();
  }, []);

  // ── Agregar pedido a Firebase
  const addOrder = async (orderData: Omit<Order, "id">) => {
    const ordersRef = ref(database, "orders");
    await push(ordersRef, orderData);
  };

  // ── Actualizar estado del pedido en Firebase
  const updateOrderStatus = async (orderId: string, status: string) => {
    await set(ref(database, `orders/${orderId}/status`), status);
  };

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, role, authLoading,
      cart, setCart,
      orders, setOrders,
      addOrder, updateOrderStatus,
      pizzas, setPizzas,
      business, setBusiness,
      repartidores, setRepartidores,
      cartCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);