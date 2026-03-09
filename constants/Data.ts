export type Pizza = {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  img: string | null;
  rating: number;
  time: string;
  available: boolean;
};

export type OrderItem = { id: number; name: string; qty: number; price: number };

export type Order = {
  id: number;
  clientId: string;
  clientName: string;
  items: OrderItem[];
  address: string;
  toppings: string[];
  total: number;
  status: string;
  date: string;
};

export type Business = {
  name: string;
  address: string;
  phone: string;
  schedule: string;
  delivery: string;
  promo: string;
};

export type Repartidor = {
  id: string;
  name: string;
  phone: string;
  email: string;
  active: boolean;
};

export type CartItem = Pizza & {
  qty: number;
  selectedSize: string;
  priceActual: number;
};

export const INIT_PIZZAS: Pizza[] = [
  { id:1,  name:"Margherita",          category:"Clasicas",   price:28, desc:"Salsa de tomate, mozzarella fresca y albahaca.",          img:null, rating:4.8, time:"25 min", available:true },
  { id:2,  name:"Pepperoni",           category:"Clasicas",   price:32, desc:"Salsa de tomate, mozzarella y pepperoni artesanal.",       img:null, rating:4.9, time:"25 min", available:true },
  { id:3,  name:"Cuatro Quesos",       category:"Clasicas",   price:35, desc:"Mozzarella, gouda, parmesano y queso azul.",              img:null, rating:4.7, time:"30 min", available:true },
  { id:4,  name:"BBQ Bacon",           category:"Especiales", price:38, desc:"Salsa BBQ ahumada, bacon crocante y cebolla.",            img:null, rating:4.9, time:"30 min", available:true },
  { id:5,  name:"Pollo & Champinones", category:"Especiales", price:36, desc:"Pollo a la plancha, champinones salteados y crema.",      img:null, rating:4.6, time:"30 min", available:true },
  { id:6,  name:"Veggie Deluxe",       category:"Especiales", price:33, desc:"Pimientos, aceitunas, tomate cherry y albahaca.",         img:null, rating:4.5, time:"25 min", available:true },
  { id:7,  name:"Coca-Cola",           category:"Bebidas",    price:7,  desc:"Botella 600ml bien fria.",                                img:null, rating:5.0, time:"—",      available:true },
  { id:8,  name:"Limonada",            category:"Bebidas",    price:9,  desc:"Limonada natural con hierbabuena.",                       img:null, rating:4.8, time:"—",      available:true },
  { id:9,  name:"Tiramisu",            category:"Postres",    price:15, desc:"Clasico tiramisu italiano con cafe espresso.",            img:null, rating:4.9, time:"—",      available:true },
  { id:10, name:"Brownie",             category:"Postres",    price:12, desc:"Brownie caliente con helado de vainilla.",                img:null, rating:4.8, time:"—",      available:true },
];

export const INIT_BUSINESS: Business = {
  name:     "Forno Rosso",
  address:  "Av. La Molina 1234, Lima",
  phone:    "+51 999 123 456",
  schedule: "Lun-Vie: 12:00 - 22:00\nSab-Dom: 11:00 - 23:00",
  delivery: "Hasta 5 km del local — Tiempo estimado: 30 min",
  promo:    "🔥 2x1 en Pizzas Clasicas — Hoy hasta las 8pm",
};

export const INIT_REPARTIDORES: Repartidor[] = [
  { id:"rep01", name:"Carlos Repartidor", phone:"+51 999 000 003", email:"repartidor@demo.com", active:true },
];

export const INIT_ORDERS: Order[] = [
  {
    id:101, clientId:"demo_uid", clientName:"Juan Perez",
    items:[{ id:2, name:"Pepperoni", qty:1, price:32 }, { id:7, name:"Coca-Cola", qty:2, price:7 }],
    address:"Jr. Las Flores 456", toppings:[], total:51,
    status:"Entregado", date:"2024-01-10",
  },
  {
    id:102, clientId:"demo_uid", clientName:"Juan Perez",
    items:[{ id:4, name:"BBQ Bacon", qty:1, price:38 }],
    address:"Jr. Las Flores 456", toppings:["+ Queso extra"], total:43,
    status:"Pendiente", date:"2024-01-11",
  },
];
