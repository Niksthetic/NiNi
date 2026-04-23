/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Cake, 
  Cookie,
  IceCream,
  Croissant,
  Heart, 
  Star, 
  ShoppingBag, 
  Menu as MenuIcon, 
  Instagram, 
  Facebook, 
  Bird,
  ChefHat,
  Sparkles,
  Candy,
  ArrowRight,
  Plus,
  Trash2,
  LayoutDashboard,
  Package,
  History,
  Settings,
  X,
  Search,
  ShoppingCart,
  Printer,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Lock,
  TrendingUp,
  Users,
  DollarSign,
  MessageCircle,
  Send
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo, type ReactNode, type FormEvent } from 'react';
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
}

interface VariantOption {
  name: string;
  priceDelta: number;
}

interface ProductVariants {
  sizes?: VariantOption[];
  flavors?: VariantOption[];
  toppings?: VariantOption[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  variants?: ProductVariants;
}

interface SelectedVariants {
  size?: VariantOption;
  flavor?: VariantOption;
  toppings?: VariantOption[];
}

interface OrderItem {
  id: string; // Add unique ID for cart items to distinguish same product with different variants
  product: Product;
  quantity: number;
  selectedVariants?: SelectedVariants;
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'delivered';
}

interface UserSession {
  role: 'admin' | 'user' | null;
  name: string | null;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

// --- Mock Data ---
const CURRENCY = '₹';

// --- Constants & Data ---
const SALES_DATA = [
  { month: 'Jan', sales: 45000, orders: 120 },
  { month: 'Feb', sales: 52000, orders: 145 },
  { month: 'Mar', sales: 48000, orders: 130 },
  { month: 'Apr', sales: 61000, orders: 160 },
  { month: 'May', sales: 55000, orders: 155 },
  { month: 'Jun', sales: 67000, orders: 190 },
  { month: 'Jul', sales: 72000, orders: 210 },
  { month: 'Aug', sales: 69000, orders: 195 },
  { month: 'Sep', sales: 75000, orders: 230 },
  { month: 'Oct', sales: 88000, orders: 260 },
  { month: 'Nov', sales: 94000, orders: 280 },
  { month: 'Dec', sales: 125000, orders: 350 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Velvet Dream Cake', price: 1250, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800', category: 'Cakes', 
    variants: {
      sizes: [{ name: 'Half KG', priceDelta: 0 }, { name: '1 KG', priceDelta: 800 }, { name: '2 KG', priceDelta: 1800 }],
      flavors: [{ name: 'Classic Red', priceDelta: 0 }, { name: 'Chocolate Velvet', priceDelta: 150 }]
    }
  },
  { id: '2', name: 'Cloud Macarons', price: 450, image: 'https://images.unsplash.com/photo-1569864358642-9d1619702661?q=80&w=800', category: 'Treats',
    variants: {
      flavors: [{ name: 'Vanilla', priceDelta: 0 }, { name: 'Pistachio', priceDelta: 50 }, { name: 'Rose', priceDelta: 50 }]
    }
  },
  { id: '3', name: 'Golden Croissants', price: 180, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800', category: 'Pastry',
    variants: {
      toppings: [{ name: 'Extra Butter', priceDelta: 40 }, { name: 'Almond Flakes', priceDelta: 60 }]
    }
  },
  { id: '4', name: 'Berry Bliss Tart', price: 650, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800', category: 'Pastry' },
  { id: '5', name: 'Strawberry Cheesecake', price: 850, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800', category: 'Cakes',
    variants: {
      sizes: [{ name: 'Slice', priceDelta: 0 }, { name: 'Full Cake', priceDelta: 2400 }]
    }
  },
  { id: '6', name: 'Chocolate Lava Cake', price: 350, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800', category: 'Cakes' },
  { id: '7', name: 'Rainbow Cupcakes', price: 120, image: 'https://images.unsplash.com/photo-1576618148400-f54499d485e9?q=80&w=800', category: 'Treats' },
  { id: '8', name: 'Blueberry Muffins', price: 150, image: 'https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?q=80&w=800', category: 'Pastry' },
  { id: '9', name: 'Classic Fudge Brownie', price: 200, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800', category: 'Treats' },
  { id: '10', name: 'Artisan Sourdough', price: 280, image: 'https://images.unsplash.com/photo-1585478259715-876a6a81b344?q=80&w=800', category: 'Pastry' },
  { id: '11', name: 'Nutella Donuts', price: 90, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800', category: 'Treats' },
  { id: '12', name: 'Tiramisu Cup', price: 550, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800', category: 'Treats' },
];

const REVIEWS: Testimonial[] = [
  { id: '1', name: 'Aditya', comment: 'The Red Velvet is absolutely heavenly! A must try.', rating: 5 },
  { id: '2', name: 'Nikita', comment: 'Loved the Macarons, so puffy and delicious. Best bakery in town!', rating: 5 },
  { id: '3', name: 'Nidhi', comment: 'The croissants are buttered to perfection. Amazing service!', rating: 4 },
];

export default function App() {
  // --- View State ---
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'products' | 'orders' | 'history' | 'settings' | 'reviews'>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [auth, setAuth] = useState<UserSession>({ role: null, name: null });
  
  // --- Functional State ---
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([]);
  const [showBill, setShowBill] = useState<Order | null>(null);
  const [selectingProduct, setSelectingProduct] = useState<Product | null>(null);

  // --- Scroll Parallax ---
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // --- Persistence & Effects ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Helpers ---
  const addNotification = (text: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const calculateItemPrice = (item: OrderItem) => {
    let extra = 0;
    if (item.selectedVariants?.size) extra += item.selectedVariants.size.priceDelta;
    if (item.selectedVariants?.flavor) extra += item.selectedVariants.flavor.priceDelta;
    if (item.selectedVariants?.toppings) {
      extra += item.selectedVariants.toppings.reduce((s, o) => s + o.priceDelta, 0);
    }
    return (item.product.price + extra) * item.quantity;
  };

  const handleLogin = (role: 'admin' | 'user') => {
    setAuth({ role, name: role === 'admin' ? 'Nikita' : 'Sweet Guest' });
    setView(role === 'admin' ? 'dashboard' : 'orders');
    addNotification(`Welcome back, ${role === 'admin' ? 'Nikita' : 'Guest'}!`);
  };

  const handleLogout = () => {
    setAuth({ role: null, name: null });
    setView('landing');
    addNotification('Logged out successfully.');
  };

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      image: `https://picsum.photos/seed/${Date.now()}/400/400`,
    };
    setProducts(prev => [newProduct, ...prev]);
    e.currentTarget.reset();
    addNotification('Product baked and added to stock!');
  };

  const handleAddToCart = (product: Product, variants?: SelectedVariants) => {
    const configKey = variants ? JSON.stringify(variants) : 'plain';
    const cartItemId = `${product.id}-${configKey}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item => item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: cartItemId, product, quantity: 1, selectedVariants: variants }];
    });
    addNotification(`${product.name} added!`);
  };

  const handlePlaceOrder = (customerName: string) => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerName,
      items: [...cart],
      total,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setShowBill(newOrder);
    setSelectingProduct(null);
    addNotification('Order placed successfully! ✨');
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    addNotification('Removed from cart.');
  };

  // --- Filtering ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // --- Render Sections ---
  return (
    <div className={cn("min-h-screen relative overflow-x-hidden transition-colors duration-500", theme === 'dark' ? 'bg-[#121212] text-slate-100' : 'bg-bakery-bg text-slate-900')}>
      
      <AnimatedBackground />

      {/* Notifications Portal */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ scale: 0.8, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.8, opacity: 0, x: 20 }}
              className="immersive-glass px-6 py-4 flex items-center gap-3 border-bakery-pink/30 pointer-events-auto"
            >
              <Bell className="w-5 h-5 text-bakery-main" />
              <span className="font-semibold text-sm">{n.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Parallax Background Layers */}
      <div className="parallax-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#FFE3E8_0%,transparent_40%),radial-gradient(circle_at_80%_80%,#FFD6E0_0%,transparent_40%)] opacity-50" />
        {/* Floating Shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40, 0], 
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity }}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? '#FFB6C1' : '#D14D72'
            }}
          />
        ))}
      </div>

      {/* --- Global Navigation --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-6xl">
        <div className="immersive-glass flex items-center justify-between px-8 py-4 relative overflow-hidden">
          <div className="flex items-center gap-2 md:gap-4 cursor-pointer group relative z-10" onClick={() => setView('landing')}>
            <motion.div 
               initial={{ y: -100 }} animate={{ y: 0 }}
               className="w-10 h-10 md:w-12 md:h-12 bg-bakery-main rounded-xl md:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform"
            >
              <ChefHat className="text-white w-5 h-5 md:w-7 md:h-7" />
            </motion.div>
            <motion.span 
              initial={{ y: -100 }} animate={{ y: 0 }}
              className="font-serif text-xl md:text-2xl font-bold tracking-tight leading-none text-bakery-main"
            >
              NiNiBakers
            </motion.span>
          </div>

          <div className="hidden lg:flex items-center gap-10 relative z-10">
            {auth.role === 'admin' ? (
              <>
                <NavLink icon={<LayoutDashboard size={18}/>} label="Pulse" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <NavLink icon={<Package size={18}/>} label="Storage" active={view === 'products'} onClick={() => setView('products')} />
                <NavLink icon={<ShoppingCart size={18}/>} label="POS" active={view === 'orders'} onClick={() => setView('orders')} />
                <NavLink icon={<History size={18}/>} label="Archive" active={view === 'history'} onClick={() => setView('history')} />
              </>
            ) : auth.role === 'user' ? (
              <>
                <NavLink icon={<Plus size={18}/>} label="Order Now" active={view === 'orders'} onClick={() => setView('orders')} />
                <NavLink icon={<Star size={18}/>} label="Reviews" active={view === 'reviews'} onClick={() => setView('reviews')} />
                <NavLink icon={<History size={18}/>} label="My Orders" active={view === 'history'} onClick={() => setView('history')} />
                <NavLink icon={<Settings size={18}/>} label="Profile" active={view === 'settings'} onClick={() => setView('settings')} />
              </>
            ) : (
              <NavLink icon={<Star size={18}/>} label="Home" active={view === 'landing'} onClick={() => setView('landing')} />
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 md:p-3 hover:bg-white/20 rounded-full transition-colors text-bakery-main">
              {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
            </button>
            {auth.role ? (
              <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l border-bakery-main/20">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-bold text-bakery-main uppercase">{auth.role}</span>
                  <span className="text-sm font-semibold">{auth.name}</span>
                </div>
                <button onClick={handleLogout} className="p-2 md:p-3 glass-button rounded-full text-bakery-main">
                  <LogOut size={18}/>
                </button>
              </div>
            ) : (
              <button onClick={() => setView('login')} className="glass-button px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-xs md:text-sm text-bakery-main flex items-center gap-2">
                <ShieldCheck size={16}/> <span className="hidden sm:inline">Login</span>
              </button>
            )}
            <button className="lg:hidden p-2 md:p-3 text-bakery-main" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MenuIcon size={20}/>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile View Switcher (Dropdown) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsMenuOpen(false)}
               className="fixed inset-0 z-[50] bg-black/5 dark:bg-white/5 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
              className="fixed top-28 left-1/2 z-[55] w-[90%] max-w-sm immersive-glass p-8 lg:hidden origin-top"
            >
              <div className="flex flex-col gap-6 text-xl font-serif font-bold text-bakery-main">
                {auth.role === 'admin' ? (
                  <>
                    {[
                      { label: 'Pulse', icon: <LayoutDashboard size={20}/>, v: 'dashboard' },
                      { label: 'Storage', icon: <Package size={20}/>, v: 'products' },
                      { label: 'POS', icon: <ShoppingCart size={20}/>, v: 'orders' },
                      { label: 'Archive', icon: <History size={20}/>, v: 'history' },
                      { label: 'Settings', icon: <Settings size={20}/>, v: 'settings' }
                    ].map(item => (
                      <button key={item.v} className="flex items-center gap-4 hover:translate-x-2 transition-transform" onClick={() => { setView(item.v as any); setIsMenuOpen(false); }}>
                        <span className="p-2 bg-bakery-main/10 rounded-xl">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-500 pt-6 mt-6 border-t border-red-500/10 flex items-center gap-4">
                      <span className="p-2 bg-red-500/10 rounded-xl"><LogOut size={20}/></span> Sign Out
                    </button>
                  </>
                ) : auth.role === 'user' ? (
                  <>
                    {[
                      { label: 'Order Now', icon: <Plus size={20}/>, v: 'orders' },
                      { label: 'Products', icon: <Package size={20}/>, v: 'products' },
                      { label: 'My Orders', icon: <History size={20}/>, v: 'history' },
                      { label: 'Reviews', icon: <Star size={20}/>, v: 'reviews' },
                      { label: 'Profile', icon: <Settings size={20}/>, v: 'settings' }
                    ].map(item => (
                      <button key={item.v} className="flex items-center gap-4 hover:translate-x-2 transition-transform" onClick={() => { setView(item.v as any); setIsMenuOpen(false); }}>
                        <span className="p-2 bg-bakery-main/10 rounded-xl">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-500 pt-6 mt-6 border-t border-red-500/10 flex items-center gap-4">
                      <span className="p-2 bg-red-500/10 rounded-xl"><LogOut size={20}/></span> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex items-center gap-4 hover:translate-x-2 transition-transform" onClick={() => { setView('landing'); setIsMenuOpen(false); }}>
                      <span className="p-2 bg-bakery-main/10 rounded-xl"><Star size={20}/></span> Home
                    </button>
                    <button className="flex items-center gap-4 hover:translate-x-2 transition-transform" onClick={() => { setView('login'); setIsMenuOpen(false); }}>
                      <span className="p-2 bg-bakery-main/10 rounded-xl"><ShieldCheck size={20}/></span> Login
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN VIEWS --- */}
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          
          {/* 1. LANDING VIEW */}
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              className="text-center flex flex-col items-center"
            >
              <motion.div className="title-main mb-6 relative">
                <span className="text-gloss">Experience the delicious taste of</span>
                <br />
                <span className="italic font-normal pr-4">NiNiBakers</span>
                <Heart className="absolute -top-10 -right-10 w-16 h-16 text-bakery-heart opacity-30 animate-pulse" />
              </motion.div>
              
              <p className="max-w-2xl text-lg md:text-xl text-bakery-subtitle font-medium leading-relaxed mb-12">
                A premium quality of the most delightful treats.
              </p>

              <div className="flex gap-6">
                <button onClick={() => setView('login')} className="glass-button px-10 py-5 rounded-[32px] font-bold text-bakery-main text-lg shadow-xl hover:scale-105">
                  Get Started
                </button>
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i}/80/80`} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border-4 border-white shadow-lg" />
                  ))}
                  <div className="w-12 h-12 rounded-full bg-bakery-main border-4 border-white flex items-center justify-center text-white text-xs font-bold">+5k</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24 w-full">
                {products.slice(0, 4).map(p => (
                  <div key={p.id} className="immersive-glass p-4 group">
                    <img src={p.image} referrerPolicy="no-referrer" className="w-full aspect-square rounded-[32px] object-cover mb-4 group-hover:scale-105 transition-transform" />
                    <h4 className="font-serif text-lg font-bold truncate">{p.name}</h4>
                    <p className="text-bakery-subtitle font-bold">{CURRENCY}{p.price}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. LOGIN VIEW */}
          {view === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center">
              <div className="immersive-glass w-full max-w-md p-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-bakery-main/10 rounded-3xl flex items-center justify-center mb-8">
                  <ChefHat className="text-bakery-main w-10 h-10" />
                </div>
                <h2 className="title-main text-4xl mb-2">Welcome Back</h2>
                <p className="text-bakery-subtitle font-bold mb-8 uppercase tracking-widest text-xs">Unlock your bakery kingdom</p>
                
                <div className="w-full flex flex-col gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-main w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Username" 
                      className="w-full bg-white/20 dark:bg-black/20 border border-bakery-pink/30 rounded-3xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-bakery-pink" 
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-main w-5 h-5" />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full bg-white/20 dark:bg-black/20 border border-bakery-pink/30 rounded-3xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-bakery-pink" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4 mt-4">
                    <button 
                      onClick={() => handleLogin('user')} 
                      className="glass-button bg-bakery-main text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 w-full"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => addNotification('Signup feature coming soon! ✨')} 
                      className="glass-button py-5 rounded-3xl font-bold flex items-center justify-center gap-3 w-full border border-bakery-pink/30"
                    >
                      Sign Up
                    </button>
                  </div>

                  <div className="pt-6 border-t border-bakery-pink/10 mt-2">
                    <button 
                      onClick={() => handleLogin('admin')} 
                      className="text-[10px] uppercase tracking-widest font-bold text-bakery-subtitle hover:text-bakery-main transition-colors mx-auto block"
                    >
                      Admin Access
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. DASHBOARD VIEW (Admin or Guest) */}
          {view === 'dashboard' && (
            auth.role === 'admin' ? (
              <motion.div key="dashboard-admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="title-main text-5xl mb-2">Bakery Heartbeat</h2>
                    <p className="text-bakery-subtitle uppercase tracking-[0.2em] font-bold text-xs">Admin Management Panel</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setView('orders')} className="glass-button px-6 py-3 rounded-full font-bold flex items-center gap-3 text-sm">
                      <Plus size={18}/> New Order
                    </button>
                    <button onClick={() => addNotification('Generating report...')} className="glass-button px-6 py-3 rounded-full font-bold flex items-center gap-3 text-sm">
                      <TrendingUp size={18}/> Sales Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <MetricCard icon={<DollarSign/>} label="Total Revenue" value={`${CURRENCY}${orders.reduce((s,o)=>s+o.total, 0)}`} color="bg-bakery-pink" />
                  <MetricCard icon={<ShoppingBag/>} label="Total Orders" value={orders.length.toString()} color="bg-amber-100" />
                  <MetricCard icon={<TrendingUp/>} label="Avg Ticket" value={`${CURRENCY}${orders.length ? Math.round(orders.reduce((s,o)=>s+o.total, 0)/orders.length) : 0}`} color="bg-emerald-100" />
                  <MetricCard icon={<Users/>} label="Total Clients" value={new Set(orders.map(o=>o.customerName)).size.toString()} color="bg-sky-100" />
                </div>

                <div className="immersive-glass p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="font-serif text-2xl font-bold">Annual Performance Architecture</h3>
                      <p className="text-bakery-subtitle text-sm">Reviewing the pulse of NiNiBakers over the fiscal year</p>
                    </div>
                    <div className="flex gap-2">
                       <span className="flex items-center gap-2 text-xs font-bold text-bakery-main bg-bakery-main/10 px-3 py-1 rounded-full">
                         <TrendingUp size={12}/> +12.4% vs LY
                       </span>
                    </div>
                  </div>
                  <SalesChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="immersive-glass p-8">
                    <h3 className="font-serif text-2xl font-bold mb-6">Real-Time Operational Pulse</h3>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/20 rounded-[24px]">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-bakery-pink flex items-center justify-center text-white font-bold">{o.customerName[0]}</div>
                            <div>
                              <p className="font-bold">{o.customerName}</p>
                              <p className="text-xs text-bakery-subtitle">{format(new Date(o.date), 'hh:mm a')}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-bakery-main/10 text-bakery-main rounded-full text-xs font-bold uppercase">{o.status}</span>
                        </div>
                      ))}
                      {orders.length === 0 && <p className="text-center text-bakery-subtitle py-10 font-bold italic">No active pulse detected. Bake something!</p>}
                    </div>
                  </div>

                  <div className="immersive-glass p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-bold mb-2">Management Goals</h3>
                      <p className="text-bakery-subtitle text-sm mb-8">Quarterly performance targets</p>
                      <ProgressBar label="Inventory Utility" progress={Math.min((products.length / 20) * 100, 100)} />
                      <ProgressBar label="Order Volume" progress={Math.min((orders.length / 50) * 100, 100)} />
                      <ProgressBar label="Growth Margin" progress={78} />
                    </div>
                    <button onClick={() => setView('history')} className="w-full py-4 mt-10 rounded-[24px] border-2 border-bakery-main/20 text-bakery-main font-bold hover:bg-bakery-main hover:text-white transition-all">
                      Full Sales History
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="dashboard-guest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12">
                <div className="text-center">
                   <h2 className="title-main text-6xl mb-4">Welcome to our World</h2>
                   <p className="text-bakery-subtitle font-bold tracking-[0.3em] uppercase mb-12">Handcrafted Bliss Just for You</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="immersive-glass p-10 text-center">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 text-bakery-main">
                        <ShoppingBag size={32} />
                      </div>
                      <h4 className="font-serif text-2xl font-bold mb-4">Easy Ordering</h4>
                      <p className="text-bakery-subtitle text-sm">Pick your favorites from our live catalog and get them baked fresh.</p>
                      <button onClick={() => setView('orders')} className="mt-8 text-bakery-main font-bold flex items-center justify-center gap-2 mx-auto">
                        Order Now <ArrowRight size={16} />
                      </button>
                   </div>
                   <div className="immersive-glass p-10 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                        <Star size={32} />
                      </div>
                      <h4 className="font-serif text-2xl font-bold mb-4">Share Love</h4>
                      <p className="text-bakery-subtitle text-sm">Tell the world how much you loved our treats. Your feedback moves us!</p>
                      <button onClick={() => setView('reviews')} className="mt-8 text-amber-500 font-bold flex items-center justify-center gap-2 mx-auto">
                        Write Review <ArrowRight size={16} />
                      </button>
                   </div>
                   <div className="immersive-glass p-10 text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                        <History size={32} />
                      </div>
                      <h4 className="font-serif text-2xl font-bold mb-4">Order Tracking</h4>
                      <p className="text-bakery-subtitle text-sm">Keep an eye on your past treats and reorder with a single tap.</p>
                      <button onClick={() => setView('history')} className="mt-8 text-emerald-500 font-bold flex items-center justify-center gap-2 mx-auto">
                        View History <ArrowRight size={16} />
                      </button>
                   </div>
                </div>

                <div className="immersive-glass p-12">
                   <h3 className="title-main text-4xl mb-8">What our Fam Says</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {REVIEWS.map(r => (
                        <div key={r.id} className="p-6 bg-white/30 dark:bg-black/20 rounded-[32px]">
                           <div className="flex gap-1 mb-4 text-amber-400">
                              {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                           </div>
                           <p className="text-sm italic mb-6">"{r.comment}"</p>
                           <p className="font-bold text-bakery-main">- {r.name}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )
          )}

          {/* 4. PRODUCTS VIEW */}
          {view === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="sticky top-32 immersive-glass p-10">
                  <h3 className="font-serif text-3xl font-bold mb-6">New Creation</h3>
                  <form onSubmit={handleAddProduct} className="flex flex-col gap-6">
                    <FormField label="Product Name" name="name" placeholder="E.g. Unicorn Cupcake" />
                    <FormField label="Base Price" name="price" type="number" placeholder="10.00" />
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-subtitle ml-4">Category</label>
                       <select name="category" className="bg-white/20 dark:bg-black/20 border border-bakery-pink/30 rounded-3xl py-4 px-6 focus:outline-none">
                         <option>Cakes</option>
                         <option>Pastry</option>
                         <option>Treats</option>
                         <option>Cookies</option>
                       </select>
                    </div>
                    <button type="submit" className="glass-button bg-bakery-main text-white py-5 rounded-[32px] font-bold shadow-lg shadow-bakery-main/30">
                      Add to Database
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="title-main text-4xl">Storage Room</h2>
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-main w-5 h-5" />
                    <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search pantry..." 
                      className="w-full md:w-64 immersive-glass py-3 pl-12 pr-6 text-sm focus:w-80 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProducts.map(p => (
                    <motion.div 
                      layout
                      key={p.id} 
                      className="immersive-glass p-4 group"
                    >
                      <div className="relative aspect-video rounded-[32px] overflow-hidden mb-6">
                        <motion.img 
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          src={p.image} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover transition-transform duration-700" 
                        />
                        <div className="absolute top-4 right-4 immersive-pill text-[10px] py-1 px-3 glass-button">{p.category}</div>
                        {auth.role === 'admin' && (
                          <button 
                            onClick={() => setProducts(products.filter(x => x.id !== p.id))}
                            className="absolute bottom-4 right-4 p-3 bg-red-400/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                          >
                            <Trash2 size={16}/>
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between items-center px-4">
                        <h4 className="font-serif text-xl font-bold">{p.name}</h4>
                        <span className="font-accent font-bold text-bakery-main text-lg">{CURRENCY}{p.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. ORDERS VIEW (POS) */}
          {view === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 flex flex-col gap-8">
                <h2 className="title-main text-4xl mb-4">New Order Creation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {products.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => {
                        if (p.variants) {
                          setSelectingProduct(p);
                        } else {
                          handleAddToCart(p);
                        }
                      }}
                      className="immersive-glass p-3 text-left hover:scale-105 transition-all group"
                    >
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="relative"
                      >
                        <img src={p.image} referrerPolicy="no-referrer" className="w-full aspect-square rounded-[24px] object-cover mb-3" />
                        <motion.div 
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-bakery-main/10 rounded-[24px] pointer-events-none flex items-center justify-center"
                        >
                          <Sparkles className="text-white drop-shadow-lg" size={24} />
                        </motion.div>
                      </motion.div>
                      <p className="font-bold text-sm truncate">{p.name}</p>
                      <p className="text-bakery-subtitle text-xs font-bold font-accent">{CURRENCY}{p.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-32 immersive-glass p-8 flex flex-col min-h-[600px]">
                  <h3 className="font-serif text-3xl font-bold mb-8 flex items-center gap-3 border-b border-bakery-pink/20 pb-4">
                    <ShoppingBag className="text-bakery-main" /> Cart
                  </h3>
                  
                  <div className="flex-grow flex flex-col gap-4 overflow-y-auto max-h-[400px] mb-8 pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center animate-in fade-in slide-in-from-right-4 group/item">
                        <div className="flex gap-4">
                          <img src={item.product.image} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold truncate w-24">{item.product.name}</p>
                            <p className="text-[10px] text-bakery-subtitle italic leading-tight">
                              {item.selectedVariants?.size && `Size: ${item.selectedVariants.size.name} `}
                              {item.selectedVariants?.flavor && `Flavor: ${item.selectedVariants.flavor.name} `}
                              {item.selectedVariants?.toppings && item.selectedVariants.toppings.length > 0 && `Extras: ${item.selectedVariants.toppings.map(t => t.name).join(', ')}`}
                            </p>
                            <p className="text-xs text-bakery-main font-bold mt-1">x{item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-bakery-main">{CURRENCY}{calculateItemPrice(item)}</p>
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="p-2 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {cart.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-bakery-subtitle">
                        <ShoppingCart size={48} className="opacity-20 mb-4" />
                        <p className="font-bold italic">Cart is empty...</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-bakery-pink/20 pt-6 space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Balance</span>
                      <span className="text-2xl font-accent text-bakery-main">{CURRENCY}{cart.reduce((s,i)=>s+calculateItemPrice(i), 0)}</span>
                    </div>
                    <input 
                      id="customer-name"
                      placeholder="Customer Name" 
                      className="w-full bg-white/20 dark:bg-black/20 border border-bakery-pink/30 rounded-[20px] py-4 px-6 focus:outline-none" 
                    />
                    <button 
                      onClick={() => {
                        const name = (document.getElementById('customer-name') as HTMLInputElement).value || 'Anonymous Guest';
                        handlePlaceOrder(name);
                      }}
                      disabled={cart.length === 0}
                      className="w-full glass-button bg-bakery-main text-white py-5 rounded-[32px] font-bold shadow-lg shadow-bakery-main/30 disabled:opacity-50"
                    >
                      Process Checkout
                    </button>
                    <p className="text-[10px] text-center uppercase tracking-widest font-bold text-bakery-subtitle opacity-60">NiNiBakers | Finalize Order</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. HISTORY VIEW */}
          {view === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
               <div className="flex justify-between items-center">
                  <h2 className="title-main text-5xl">Archive Room</h2>
                  <button onClick={() => addNotification('Exporting legacy logs...')} className="immersive-pill flex items-center gap-2">
                    <Printer size={16}/> Export Report
                  </button>
               </div>
               <div className="immersive-glass overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-bakery-pink/10">
                       <th className="p-8 text-[11px] uppercase tracking-[0.2em] font-bold text-bakery-subtitle">Order ID</th>
                       <th className="p-8 text-[11px] uppercase tracking-[0.2em] font-bold text-bakery-subtitle">Customer</th>
                       <th className="p-8 text-[11px] uppercase tracking-[0.2em] font-bold text-bakery-subtitle">Date</th>
                       <th className="p-8 text-[11px] uppercase tracking-[0.2em] font-bold text-bakery-subtitle">Value</th>
                       <th className="p-8 text-[11px] uppercase tracking-[0.2em] font-bold text-bakery-subtitle">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {orders.map(o => (
                       <tr key={o.id} className="border-b border-bakery-pink/5 hover:bg-white/20 transition-colors">
                         <td className="p-8 font-mono text-sm uppercase tracking-widest">{o.id}</td>
                         <td className="p-8 font-bold">{o.customerName}</td>
                         <td className="p-8 text-sm text-bakery-subtitle">{format(new Date(o.date), 'MMM dd, yyyy')}</td>
                         <td className="p-8 font-accent font-bold text-bakery-main">{CURRENCY}{o.total}</td>
                         <td className="p-8">
                           <button onClick={() => setShowBill(o)} className="p-3 glass-button rounded-full text-bakery-main">
                             <Printer size={18}/>
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 {orders.length === 0 && (
                   <div className="py-32 text-center flex flex-col items-center gap-4">
                     <History size={64} className="opacity-10 text-bakery-main" />
                     <p className="font-serif text-2xl italic text-bakery-subtitle opacity-40">The archives are currently empty...</p>
                   </div>
                 )}
               </div>
            </motion.div>
          )}

          {/* 7. SETTINGS VIEW */}
          {view === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full">
              <h2 className="title-main text-5xl mb-8">Preferences</h2>
              <div className="immersive-glass p-8 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">Theme Appearance</h4>
                    <p className="text-sm text-bakery-subtitle">Switch between light and dark backgrounds.</p>
                  </div>
                  <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="glass-button p-4 rounded-3xl flex items-center gap-3">
                    {theme === 'light' ? <Moon /> : <Sun />}
                    <span className="font-bold text-sm uppercase">{theme}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-bakery-pink/10 pt-8">
                  <div>
                    <h4 className="font-bold text-lg text-red-500">System Reset</h4>
                    <p className="text-sm text-bakery-subtitle text-red-400">Clear all orders and product history from this session.</p>
                  </div>
                  <button 
                    onClick={() => {
                        if(confirm('Wipe session data?')) {
                            setOrders([]);
                            setCart([]);
                            setProducts(INITIAL_PRODUCTS);
                            addNotification('System reset successful.');
                        }
                    }} 
                    className="p-4 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-3xl font-bold uppercase text-xs"
                  >
                    Wipe Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 8. REVIEWS VIEW (Guest only) */}
          {view === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto w-full flex flex-col gap-12">
               <div className="text-center">
                  <h2 className="title-main text-5xl mb-4">The Wall of Love</h2>
                  <p className="text-bakery-subtitle font-bold tracking-widest uppercase">What our community thinks about us</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="immersive-glass p-10 flex flex-col gap-6">
                     <h3 className="font-serif text-2xl font-bold">Leave a Review</h3>
                     <form onSubmit={(e) => { e.preventDefault(); addNotification('Thank you for your feedback! ✨'); e.currentTarget.reset(); }} className="flex flex-col gap-6">
                        <FormField label="Your Name" name="reviewer" placeholder="E.g. Aditya" />
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-subtitle ml-4">Rating</label>
                           <div className="flex gap-4 p-4 immersive-glass justify-center text-amber-400">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} size={24} className="cursor-pointer hover:scale-125 transition-transform" />
                              ))}
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-subtitle ml-4">Message</label>
                           <textarea className="bg-white/20 dark:bg-black/20 border border-bakery-pink/30 rounded-[32px] py-4 px-6 focus:outline-none min-h-[120px]" placeholder="Tell us about your experience..." />
                        </div>
                        <button type="submit" className="glass-button bg-bakery-main text-white py-5 rounded-[32px] font-bold">Share My Story</button>
                     </form>
                  </div>

                  <div className="space-y-6">
                     {REVIEWS.map(r => (
                       <div key={r.id} className="immersive-glass p-8">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <p className="font-bold text-lg">{r.name}</p>
                                <div className="flex gap-1 text-amber-400">
                                   {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-bakery-pink/20 flex items-center justify-center text-bakery-main font-bold">
                                {r.name[0]}
                             </div>
                          </div>
                          <p className="text-bakery-subtitle italic text-sm">"{r.comment}"</p>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-bakery-pink/10 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bakery-main rounded-xl flex items-center justify-center">
              <ChefHat className="text-white w-6 h-6" />
            </div>
            <span className="font-serif text-xl font-bold text-bakery-main">NiNiBakers</span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-bakery-subtitle text-center">
            Handcrafted with love in the NiNiBakers oven © 2026
          </p>

          <div className="flex gap-4">
            {[Instagram, Facebook, Bird].map((Icon, i) => (
              <a key={i} href="#" className="p-2 glass-button rounded-full text-bakery-main">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* --- Bill Modal --- */}
      <AnimatePresence>
        {selectingProduct && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-bakery-bg/60 dark:bg-black/60 backdrop-blur-md">
            <VariantSelector 
              product={selectingProduct} 
              onClose={() => setSelectingProduct(null)} 
              onAdd={(variants) => {
                handleAddToCart(selectingProduct, variants);
                setSelectingProduct(null);
              }} 
            />
          </div>
        )}
        
        {showBill && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
               className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl relative"
            >
              <button onClick={() => setShowBill(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24}/>
              </button>
              
              <div id="bill-print" className="p-12 font-sans">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-bakery-main rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-bakery-main mb-1">NiNiBakers Receipt</h3>
                  <p className="text-[10px] uppercase tracking-[4px] font-bold text-bakery-subtitle">A Token of Sweetness</p>
                </div>

                <div className="flex justify-between border-b border-dashed border-slate-200 pb-8 mb-8 text-sm">
                  <div>
                    <p className="text-slate-400 uppercase text-[10px] font-bold mb-1">Customer</p>
                    <p className="font-bold">{showBill.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 uppercase text-[10px] font-bold mb-1">Order Ref</p>
                    <p className="font-mono text-xs">{showBill.id}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {showBill.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-start text-sm">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded bg-bakery-main/10 flex items-center justify-center font-bold text-[10px] text-bakery-main mt-1">
                          {it.quantity}x
                        </span>
                        <div>
                          <p className="font-bold">{it.product.name}</p>
                          <p className="text-[10px] text-bakery-subtitle italic">
                            {[
                              it.selectedVariants?.size?.name,
                              it.selectedVariants?.flavor?.name,
                              it.selectedVariants?.toppings && it.selectedVariants.toppings.length > 0 ? `Extras: ${it.selectedVariants.toppings.map(t => t.name).join(', ')}` : null
                            ].filter(Boolean).join(' | ')}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-bakery-main">{CURRENCY}{calculateItemPrice(it)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-slate-900 dark:border-white pt-8 flex justify-between items-end">
                   <div>
                     <p className="text-[10px] uppercase font-bold text-bakery-subtitle mb-1">Date Issued</p>
                     <p className="text-sm font-bold">{format(new Date(showBill.date), 'MMM dd, yyyy')}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-2xl font-serif font-bold text-bakery-main">Total {CURRENCY}{showBill.total}</p>
                     <p className="text-[8px] uppercase font-bold tracking-widest text-slate-400">All prices inkl. tax</p>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                  <div className="relative w-full h-[50px] bg-slate-50 rounded bg-gradient-to-r from-transparent via-slate-200 to-transparent flex items-center justify-center">
                    <p className="text-[8px] uppercase tracking-[5px] text-slate-400 font-bold">Barcoded | NiNiBakers System</p>
                  </div>
                  <p className="text-[12px] font-script text-2xl text-bakery-main mt-4">Thank you for letting us bake your day!</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-black/20 flex gap-4">
                <button onClick={() => window.print()} className="flex-grow glass-button bg-bakery-main text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2">
                  <Printer size={18}/> Print Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CHAT BOT (Help & Support) */}
      <ChatBot />

    </div>
  );
}

// --- Internal Components ---
function NavLink({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 relative group",
        active ? "text-bakery-main" : "text-slate-400 dark:text-slate-500 hover:text-bakery-main"
      )}
    >
      <span className={cn("transition-transform group-hover:scale-125", active && "scale-125")}>{icon}</span>
      <span>{label}</span>
      {active && (
        <motion.div layoutId="nav-pill" className="absolute inset-0 bg-bakery-main/10 rounded-full -z-10" />
      )}
    </button>
  );
}

function AnimatedBackground() {
  const icons = [Cake, Cookie, IceCream, Croissant, Candy, Sparkles, Heart, Star];
  
  // Create a stable set of 20 floating items
  const items = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      Icon: icons[i % icons.length],
      size: Math.random() * 40 + 20,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10 dark:opacity-[0.05]">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-bakery-main"
          initial={{ 
            x: 0, 
            y: 0, 
            rotate: item.rotate,
            opacity: 0 
          }}
          animate={{ 
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            rotate: item.rotate + 360,
            opacity: [0, 1, 1, 0],
          }}
          transition={{ 
            duration: item.duration, 
            repeat: Infinity, 
            delay: item.delay,
            ease: "easeInOut"
          }}
          style={{ 
            left: item.left, 
            top: item.top,
          }}
        >
          <item.Icon size={item.size} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi there! Welcome to NiNiBakers support. How can we sweeten your day? 🍰", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Dummy Bot Responses
    setTimeout(() => {
      let botText = "Thank you for reaching out! Our team will get back to you shortly. In the meantime, have you checked our latest Velvet Cake? 🎂";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('price') || lowerInput.includes('cost')) {
        botText = "Our prices are listed on each product card. Remember, bulk orders might get a sweet discount! 🍬";
      } else if (lowerInput.includes('track') || lowerInput.includes('order')) {
        botText = "You can track your active orders in the 'History' tab of your dashboard! 🚚";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botText = "Hello! 👋 Feel free to ask about our ingredients, delivery, or custom cakes.";
      }

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="immersive-glass w-[350px] h-[500px] mb-6 overflow-hidden flex flex-col shadow-2xl border border-bakery-pink/20"
          >
            {/* Header */}
            <div className="bg-bakery-main p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center p-1">
                   <ChefHat size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-sm">NiNi Support</h4>
                   <p className="text-[10px] opacity-80 uppercase tracking-widest">Always Baking Fresh</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide">
              {messages.map(msg => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed relative group",
                    msg.sender === 'user' 
                      ? "bg-bakery-main text-white self-end rounded-tr-none" 
                      : "bg-white/40 dark:bg-black/30 self-start rounded-tl-none border border-bakery-pink/10"
                  )}
                >
                  {msg.text}
                  <span className={cn(
                    "text-[8px] absolute -bottom-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                    msg.sender === 'user' ? "right-0 text-bakery-main" : "left-0 text-bakery-subtitle"
                  )}>
                    {msg.time}
                  </span>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-bakery-pink/10 bg-white/20 dark:bg-black/20 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..." 
                className="flex-grow bg-white/40 dark:bg-black/20 border border-bakery-pink/20 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-bakery-pink"
              />
              <button 
                type="submit"
                className="w-10 h-10 bg-bakery-main text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-md shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative",
          isOpen ? "bg-slate-700 -rotate-90" : "bg-bakery-main"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
              <MessageCircle size={28} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-bakery-heart rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">1</div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

function SalesChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SALES_DATA}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FB6F92" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FB6F92" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FB6F92" opacity={0.1} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }}
          />
          <YAxis 
            hide
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              padding: '12px'
            }}
            itemStyle={{ color: '#FB6F92', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#FB6F92" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSales)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="immersive-glass p-8 flex items-center gap-6 group hover:scale-[1.02] transition-transform">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-bakery-main shadow-sm", color)}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-bakery-subtitle mb-1">{label}</p>
        <p className="text-3xl font-accent font-bold group-hover:scale-110 transition-transform origin-left">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, progress }: { label: string, progress: number }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-bakery-subtitle mb-2">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-bakery-pink to-bakery-main rounded-full"
        />
      </div>
    </div>
  );
}

function FormField({ label, name, type = 'text', placeholder }: { label: string, name: string, type?: string, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-subtitle ml-4">{label}</label>
      <input 
        name={name}
        type={type} 
        placeholder={placeholder}
        className="bg-white/20 dark:bg-black/20 border border-bakery-pink/30 rounded-[28px] py-4 px-6 focus:outline-none focus:ring-2 focus:ring-bakery-pink placeholder:text-bakery-subtitle/30" 
      />
    </div>
  );
}

function VariantSelector({ product, onClose, onAdd }: { product: Product, onClose: () => void, onAdd: (v: SelectedVariants) => void }) {
  const [size, setSize] = useState<VariantOption | undefined>(product.variants?.sizes?.[0]);
  const [flavor, setFlavor] = useState<VariantOption | undefined>(product.variants?.flavors?.[0]);
  const [toppings, setToppings] = useState<VariantOption[]>([]);

  const totalPrice = useMemo(() => {
    let extra = 0;
    if (size) extra += size.priceDelta;
    if (flavor) extra += flavor.priceDelta;
    extra += toppings.reduce((sum, t) => sum + t.priceDelta, 0);
    return product.price + extra;
  }, [product, size, flavor, toppings]);

  const toggleTopping = (t: VariantOption) => {
    setToppings(prev => prev.find(o => o.name === t.name) ? prev.filter(o => o.name !== t.name) : [...prev, t]);
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="immersive-glass p-8 w-full max-w-lg flex flex-col gap-8 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img src={product.image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          <div>
            <h3 className="font-serif text-2xl font-bold">{product.name}</h3>
            <p className="text-bakery-subtitle text-sm font-bold uppercase tracking-widest">{product.category}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-bakery-pink/20 rounded-full transition-colors"><X/></button>
      </div>

      <div className="space-y-6">
        {product.variants?.sizes && (
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-bakery-subtitle block mb-3">Choose Size</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.sizes.map(s => (
                <button 
                  key={s.name}
                  onClick={() => setSize(s)}
                  className={cn("px-4 py-2 rounded-full text-sm font-bold transition-all border", 
                    size?.name === s.name ? "bg-bakery-main text-white border-bakery-main" : "bg-white/20 dark:bg-black/20 border-bakery-pink/20"
                  )}
                >
                  {s.name} {s.priceDelta !== 0 && `(+${CURRENCY}${s.priceDelta})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.variants?.flavors && (
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-bakery-subtitle block mb-3">Select Flavor</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.flavors.map(f => (
                <button 
                  key={f.name}
                  onClick={() => setFlavor(f)}
                  className={cn("px-4 py-2 rounded-full text-sm font-bold transition-all border", 
                    flavor?.name === f.name ? "bg-bakery-main text-white border-bakery-main" : "bg-white/20 dark:bg-black/20 border-bakery-pink/20"
                  )}
                >
                  {f.name} {f.priceDelta !== 0 && `(+${CURRENCY}${f.priceDelta})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.variants?.toppings && (
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-bakery-subtitle block mb-3">Add-ons (Multiple)</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.toppings.map(t => (
                <button 
                  key={t.name}
                  onClick={() => toggleTopping(t)}
                  className={cn("px-4 py-2 rounded-full text-sm font-bold transition-all border", 
                    toppings.find(o => o.name === t.name) ? "bg-bakery-main text-white border-bakery-main" : "bg-white/20 dark:bg-black/20 border-bakery-pink/20"
                  )}
                >
                  {t.name} (+{CURRENCY}{t.priceDelta})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-bakery-pink/20 pt-8 mt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-bakery-subtitle">Estimated Price</p>
          <p className="font-serif text-3xl font-bold text-bakery-main">{CURRENCY}{totalPrice}</p>
        </div>
        <button 
          onClick={() => onAdd({ size, flavor, toppings })}
          className="glass-button bg-bakery-main text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2"
        >
          <Plus size={20}/> Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

function App() {
	const [products, setProducts] = useState<any[]>([])
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => {
        console.log("Products:", data)
	setProducts(data)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <h1>Bakery System</h1>
      <h2>Products</h2>

      {products.map((p: any) => (
      <div key={p.id}>
        <h3>{p.name}</h3>
        <p>₹{p.price}</p>
      </div>
    ))}
    </div>
  )
}

export default App
