export const T = {
  bg:         "#0f0e0c",
  surface:    "#1a1814",
  card:       "#222019",
  accent:     "#e8440a",
  accentSoft: "#ff6b35",
  gold:       "#f5a623",
  text:       "#f5f0e8",
  muted:      "#8a8070",
  border:     "#2e2b24",
  green:      "#4caf50",
  blue:       "#2196f3",
  red:        "#f44336",
};

export const STATUS_COLOR: Record<string, string> = {
  "Pendiente":      T.gold,
  "En preparacion": T.blue,
  "En camino":      T.accentSoft,
  "Entregado":      T.green,
};

export const STATUS_ICON: Record<string, string> = {
  "Pendiente":      "🕐",
  "En preparacion": "👨‍🍳",
  "En camino":      "🛵",
  "Entregado":      "✅",
};

export const STATUS_FLOW = ["Pendiente", "En preparacion", "En camino", "Entregado"];

export const TOPPINGS = [
  "+ Queso extra",
  "+ Pepperoni",
  "+ Jamon",
  "+ Champinones",
  "+ Aceitunas",
  "+ Jalapenos",
];
