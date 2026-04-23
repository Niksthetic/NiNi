/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef, useMemo, type ReactNode, type FormEvent } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
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
  id: string;
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
  { id: '1', name: 'Velvet Dream Cake', price: 1250, image: '[images.unsplash.com](https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800)', category: 'Cakes', 
    variants: {
      sizes: [{ name: 'Half KG', priceDelta: 0 }, { name: '1 KG', priceDelta: 800 }, { name: '2 KG', priceDelta: 1800 }],
      flavors: [{ name: 'Classic Red', priceDelta: 0 }, { name: 'Chocolate Velvet', priceDelta: 150 }]
    }
  },
  { id: '2', name: 'Cloud Macarons', price: 450, image: '[images.unsplash.com](https://images.unsplash.com/photo-1569864358642-9d1619702661?q=80&w=800)', category: 'Treats',
    variants: {
      flavors: [{ name: 'Vanilla', priceDelta: 0 }, { name: 'Pistachio', priceDelta: 50 }, { name: 'Rose', priceDelta: 50 }]
    }
  },
  { id: '3', name: 'Golden Croissants', price: 180, image: '[images.unsplash.com](https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800)', category: 'Pastry',
    variants: {
      toppings: [{ name: 'Extra Butter', priceDelta: 40 }, { name: 'Almond Flakes', priceDelta: 60 }]
    }
  },
  { id: '4', name: 'Berry Bliss Tart', price: 650, image: '[images.unsplash.com](https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800)', category: 'Pastry' },
  { id: '5', name: 'Strawberry Cheesecake', price: 850, image: '[images.unsplash.com](https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800)', category: 'Cakes',
    variants: {
      sizes: [{ name: 'Slice', priceDelta: 0 }, { name: 'Full Cake', priceDelta: 2400 }]
    }
  },
  { id: '6', name: 'Chocolate Lava Cake', price: 350, image: '[images.unsplash.com](https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800)', category: 'Cakes' },
  { id: '7', name: 'Rainbow Cupcakes', price: 120, image: '[images.unsplash.com](https://images.unsplash.com/photo-1576618148400-f54499d485e9?q=80&w=800)', category: 'Treats' },
  { id: '8', name: 'Blueberry Muffins', price: 150, image: '[images.unsplash.com](https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?q=80&w=800)', category: 'Pastry' },
  { id: '9', name: 'Classic Fudge Brownie', price: 200, image: '[images.unsplash.com](https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800)', category: 'Treats' },
  { id: '10', name: 'Artisan Sourdough', price: 280, image: '[images.unsplash.com](https://images.unsplash.com/photo-1585478259715-876a6a81b344?q=80&w=800)', category: 'Pastry' },
  { id: '11', name: 'Nutella Donuts', price: 90, image: '[images.unsplash.com](https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800)', category: 'Treats' },
  { id: '12', name: 'Tiramisu Cup', price: 550, image: '[images.unsplash.com](https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800)', category: 'Treats' },
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
      image: `[picsum.photos](https://picsum.photos/seed/${Date.now()}/400/400)`,
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

  // --- Render the complete UI (all views, components, etc.) ---
  return (
    <div className={cn("min-h-screen relative overflow-x-hidden transition-colors duration-500", theme === 'dark' ? 'bg-[#121212] text-slate-100' : 'bg-bakery-bg text-slate-900')}>
      {/* Complete JSX from the original main App component continues here... */}
      {/* (All the JSX from nav, main views, footer, modals, ChatBot, etc. remains exactly the same) */}
      
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

      {/* ... rest of the complete JSX from the original file ... */}
    </div>
  );
}

// --- All internal components remain exactly the same ---
function NavLink({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  // ... component code unchanged
}

function AnimatedBackground() {
  // ... component code unchanged
}

function ChatBot() {
  // ... component code unchanged
}

function SalesChart() {
  // ... component code unchanged
}

function MetricCard({ icon, label, value, color }: { icon: ReactNode, label: string, value: string, color: string }) {
  // ... component code unchanged
}

function ProgressBar({ label, progress }: { label: string, progress: number }) {
  // ... component code unchanged
}

function FormField({ label, name, type = 'text', placeholder }: { label: string, name: string, type?: string, placeholder?: string }) {
  // ... component code unchanged
}

function VariantSelector({ product, onClose, onAdd }: { product: Product, onClose: () => void, onAdd: (v: SelectedVariants) => void }) {
  // ... component code unchanged
}
