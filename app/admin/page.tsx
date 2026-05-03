"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllOrders, updateOrderStatus, markPhotosDeleted, type OrderData, type OrderStatus } from "@/services/orderService";
import { PRODUCTS } from "@/lib/constants";
import { 
  Package, 
  Search, 
  Phone, 
  MapPin, 
  Layers,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  Edit3,
  Loader2,
  ShieldAlert,
  Mail,
  Box,
  X,
  Copy,
  Check,
  RefreshCw,
  Users,
  LayoutDashboard,
  Filter,
  Eye,
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart,
  CalendarDays,
  Tag,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string }> = {
  "Received": { color: "text-blue-400", bg: "bg-blue-400/10" },
  "Designing": { color: "text-purple-400", bg: "bg-purple-400/10" },
  "Ready for Print": { color: "text-orange-400", bg: "bg-orange-400/10" },
  "Printing": { color: "text-amber-400", bg: "bg-amber-400/10" },
  "Packed": { color: "text-pink-400", bg: "bg-pink-400/10" },
  "Shipped": { color: "text-indigo-400", bg: "bg-indigo-400/10" },
  "Delivered": { color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

const ORDER_STATUS_LIST: OrderStatus[] = [
  "Received", "Designing", "Ready for Print", "Printing", "Packed", "Shipped", "Delivered"
];

type FilterType = 'all' | 'new' | 'processing' | 'shipped' | 'delivered';
type AdminTab = 'orders' | 'analytics' | 'admins' | 'coupons';

// Helper to get price
const getOrderPrice = (size: string, pages: number) => {
  const s = size.toLowerCase();
  const product = PRODUCTS.find(p => 
    p.size.toLowerCase() === s || 
    p.name.toLowerCase() === s ||
    p.id.toLowerCase() === s
  );
  const variant = product?.variants.find(v => v.pages === pages);
  return variant?.price || 0;
};

export default function EliteAdminPortal() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentTab, setCurrentTab] = useState<AdminTab>('orders');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [salesRange, setSalesRange] = useState<'today' | 'month' | 'annual' | 'lifetime'>('today');

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      getAllOrders().then(data => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  // ANALYTICS CALCULATIONS
  const analytics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
    const monthOrders = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const annualOrders = orders.filter(o => new Date(o.createdAt).getFullYear() === thisYear);

    const calcRev = (items: OrderData[]) => items.reduce((acc, o) => acc + (o.total_price || getOrderPrice(o.size, o.pages)), 0);

    // Product Mix
    const mixMap: Record<string, { units: number; rev: number }> = {};
    orders.forEach(o => {
      const key = `${o.size} - ${o.pages} Pgs`;
      if (!mixMap[key]) mixMap[key] = { units: 0, rev: 0 };
      mixMap[key].units += 1;
      mixMap[key].rev += (o.total_price || getOrderPrice(o.size, o.pages));
    });

    return {
      today: { count: todayOrders.length, rev: calcRev(todayOrders) },
      month: { count: monthOrders.length, rev: calcRev(monthOrders) },
      annual: { count: annualOrders.length, rev: calcRev(annualOrders) },
      lifetime: { count: orders.length, rev: calcRev(orders) },
      mix: Object.entries(mixMap).sort((a, b) => b[1].rev - a[1].rev)
    };
  }, [orders]);

  const stats = useMemo(() => {
    return {
      new: orders.filter(o => o.status === "Received").length,
      processing: orders.filter(o => ["Designing", "Ready for Print", "Printing", "Packed"].includes(o.status)).length,
      shipped: orders.filter(o => o.status === "Shipped").length,
      delivered: orders.filter(o => o.status === "Delivered").length,
      total: orders.length
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (activeFilter === 'new') result = result.filter(o => o.status === 'Received');
    if (activeFilter === 'processing') result = result.filter(o => ["Designing", "Ready for Print", "Printing", "Packed"].includes(o.status));
    if (activeFilter === 'shipped') result = result.filter(o => o.status === 'Shipped');
    if (activeFilter === 'delivered') result = result.filter(o => o.status === 'Delivered');

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(o => 
        o.id?.toLowerCase().includes(s) || 
        o.customer_name.toLowerCase().includes(s) ||
        o.customer_email?.toLowerCase().includes(s) ||
        o.phone.includes(s)
      );
    }
    return result;
  }, [orders, activeFilter, search]);

  const handleStatusUpdate = async (id: string, s: OrderStatus) => {
    setUpdatingId(id);
    const success = await updateOrderStatus(id, s);
    if (success) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: s } : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status: s } : null);
      }
    }
    setUpdatingId(null);
  };

  const [deletingPhotos, setDeletingPhotos] = useState(false);
  const handleDeletePhotos = async (url: string) => {
    if (!window.confirm("ARE YOU SURE? This will permanently wipe all customer images from the cloud server.")) return;
    setDeletingPhotos(true);
    try {
      const res = await fetch('/api/admin/delete-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (res.ok) {
        // Also mark the order as "wiped" in Supabase to stop curation link from working
        if (selectedOrder?.id) {
          await markPhotosDeleted(selectedOrder.id);
        }
        alert("Privacy Protocol Complete: All photos permanently wiped from cloud.");
        setSelectedOrder(null);
        // Refresh orders list
        getAllOrders().then(setOrders);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setDeletingPhotos(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading) return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center">
      <Loader2 className="animate-spin text-cherry-light" size={48} />
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-6 text-center text-white">
      <div className="max-w-sm">
        <ShieldAlert size={80} className="mx-auto mb-8 text-cherry-light opacity-50" />
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Access Denied</h1>
        <p className="text-white/30 text-sm mb-12">This command center is reserved for BerryBooks administrators.</p>
        <Link href="/" className="bg-cherry-light text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-110 transition-all">Exit to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000] text-[#adb5bd] flex font-sans">
      {/* Interactive Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#191c24] flex-col border-r border-[#2c2e33] shrink-0 pt-12 h-screen sticky top-0">
         <div className="px-6 mb-10">
            <div className="flex items-center gap-3 mb-12">
               <div className="w-10 h-10 rounded-xl bg-cherry-light flex items-center justify-center text-white shadow-lg shadow-cherry-light/20">
                  <LayoutDashboard size={20} />
               </div>
               <div>
                  <h4 className="text-white font-bold leading-none mb-1">Elite Panel</h4>
                  <p className="text-[10px] text-[#6c7293] font-bold tracking-widest uppercase">Admin V2.0</p>
               </div>
            </div>
            
            <nav className="space-y-2">
               {[
                 { id: 'orders', label: 'Order Stream', icon: Box },
                 { id: 'analytics', label: 'Sales & Growth', icon: BarChart3 },
                 { id: 'admins', label: 'Admin Access', icon: Users, disabled: true },
                 { id: 'coupons', label: 'Promo Engine', icon: Tag, disabled: true },
               ].map((item) => (
                 <button
                   key={item.id}
                   disabled={item.disabled}
                   onClick={() => setCurrentTab(item.id as AdminTab)}
                   className={`
                     w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-bold text-sm
                     ${currentTab === item.id 
                       ? 'bg-cherry-light text-white shadow-lg shadow-cherry-light/20' 
                       : item.disabled 
                         ? 'opacity-20 cursor-not-allowed'
                         : 'text-[#6c7293] hover:bg-white/5 hover:text-white'}
                   `}
                 >
                   <item.icon size={18} />
                   {item.label}
                 </button>
               ))}
            </nav>

            <div className="mt-20 p-6 bg-[#0f1015] rounded-2xl border border-[#2c2e33]">
                <p className="text-[10px] font-black text-[#6c7293] uppercase tracking-widest mb-3">Today's Pulse</p>
                <div className="flex items-center justify-between">
                   <span className="text-white font-bold">₹{analytics.today.rev.toLocaleString("en-IN")}</span>
                   <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">+{analytics.today.count} Units</span>
                </div>
            </div>
         </div>
      </div>

      <div className="flex-1 pt-12 pb-20 px-6 lg:px-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          
          <AnimatePresence mode="wait">
            {currentTab === 'orders' ? (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* 5 Filter Boxes */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                   {[
                     { id: 'new', label: 'New', count: stats.new, icon: Clock, color: 'text-blue-500' },
                     { id: 'processing', label: 'Processing', count: stats.processing, icon: Edit3, color: 'text-amber-500' },
                     { id: 'shipped', label: 'Shipped', count: stats.shipped, icon: Truck, color: 'text-indigo-500' },
                     { id: 'delivered', label: 'Delivered', count: stats.delivered, icon: CheckCircle2, color: 'text-emerald-500' },
                     { id: 'all', label: 'Total Stream', count: stats.total, icon: Package, color: 'text-cherry-light' },
                   ].map((f) => (
                     <button 
                       key={f.id}
                       onClick={() => setActiveFilter(f.id as FilterType)}
                       className={`
                         relative p-6 rounded-3xl bg-[#191c24] border transition-all text-left group
                         ${activeFilter === f.id ? 'border-cherry-light shadow-2xl bg-[#21252e]' : 'border-[#2c2e33] hover:border-white/20'}
                       `}
                     >
                       <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform`}>
                             <f.icon size={24} />
                          </div>
                          <span className="text-3xl font-bold text-white tracking-tighter">{f.count}</span>
                       </div>
                       <p className="text-[10px] font-black uppercase text-[#6c7293] tracking-widest">{f.label}</p>
                       {activeFilter === f.id && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cherry-light shadow-[0_0_10px_#FF2250]" />}
                     </button>
                   ))}
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                  <div className="relative group w-full lg:w-96">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6c7293] group-focus-within:text-cherry-light transition-colors" size={20} />
                     <input 
                       type="text" 
                       placeholder="Filter by customer details..." 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="w-full bg-[#191c24] border border-[#2c2e33] rounded-2xl px-14 py-5 text-sm font-medium text-white focus:outline-none focus:border-cherry-light/40 transition-all placeholder:text-[#6c7293]"
                     />
                  </div>
                  <button onClick={() => { setLoading(true); getAllOrders().then(setOrders).finally(() => setLoading(false)); }} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#6c7293] hover:text-white transition-colors">
                     <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                     Refresh Live Feed
                  </button>
                </div>

                {/* Table */}
                <div className="bg-[#191c24] rounded-[2.5rem] p-8 lg:p-10 border border-[#2c2e33] overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full">
                         <thead>
                            <tr className="text-left border-b border-[#2c2e33]">
                               <th className="pb-8 pl-4 text-[10px] font-black text-[#6c7293] tracking-widest">ORDER TICKET</th>
                               <th className="pb-8 text-[10px] font-black text-[#6c7293] tracking-widest uppercase">Identity</th>
                               <th className="pb-8 text-[10px] font-black text-[#6c7293] tracking-widest uppercase">Value</th>
                               <th className="pb-8 text-[10px] font-black text-[#6c7293] tracking-widest uppercase">Fulfillment</th>
                               <th className="pb-8 text-right pr-4 text-[10px] font-black text-[#6c7293] tracking-widest uppercase">Control</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#2c2e33]">
                            {filteredOrders.map((order) => {
                               const status = STATUS_CONFIG[order.status];
                               const price = getOrderPrice(order.size, order.pages);
                               return (
                                  <tr key={order.id} className="hover:bg-white/[0.03] transition-all group">
                                     <td className="py-12 pl-4">
                                        <div className="text-sm font-bold text-white mb-2 font-mono">#{order.id?.slice(-8)}</div>
                                        <div className="text-[10px] text-[#6c7293] font-black uppercase tracking-widest opacity-60">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                     </td>
                                     <td className="py-12 px-4">
                                        <div className="text-lg font-black text-white mb-1 leading-none">{order.customer_name}</div>
                                        <div className="text-sm text-cherry-light/60 font-medium tracking-tight">{order.phone}</div>
                                     </td>
                                     <td className="py-12 px-4">
                                        <div className="text-base font-black text-white mb-1">₹{(order.total_price || price).toLocaleString("en-IN")}</div>
                                        <div className="text-[10px] text-[#6c7293] font-black uppercase tracking-widest">{order.size} · {order.pages}P</div>
                                     </td>
                                     <td className="py-12 px-4">
                                        <select 
                                          value={order.status}
                                          disabled={updatingId === order.id}
                                          onChange={(e) => handleStatusUpdate(order.id!, e.target.value as OrderStatus)}
                                          className={`
                                            bg-[#0f1015] border border-[#2c2e33] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-cherry-light transition-all cursor-pointer shadow-inner
                                            ${status.color}
                                          `}
                                        >
                                          {ORDER_STATUS_LIST.map(s => <option key={s} value={s} className="bg-[#191c24]">{s}</option>)}
                                        </select>
                                     </td>
                                     <td className="py-12 text-right pr-4">
                                        <button 
                                          onClick={() => setSelectedOrder(order)}
                                          className="bg-white/5 text-white/40 hover:bg-cherry-light hover:text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-xl hover:shadow-cherry-light/20 active:scale-95 border border-white/5"
                                        >
                                          View Details
                                        </button>
                                     </td>
                                  </tr>
                               );
                            })}
                         </tbody>
                      </table>
                   </div>
                </div>
              </motion.div>
            ) : (
              /* SALES DASHBOARD VIEW */
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Revenue Analytics</h2>
                       <p className="text-[#6c7293] font-medium">Real-time financial performance across order cycles.</p>
                    </div>
                    <div className="flex bg-[#191c24] p-1.5 rounded-2xl border border-[#2c2e33]">
                       {(['today', 'month', 'annual', 'lifetime'] as const).map(r => (
                         <button 
                           key={r}
                           onClick={() => setSalesRange(r)}
                           className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${salesRange === r ? 'bg-cherry-light text-white shadow-lg' : 'text-[#6c7293] hover:text-white'}`}
                         >
                           {r}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Top Revenue Cards */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-[#191c24] border border-[#2c2e33] p-10 rounded-[2.5rem] relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-10 text-cherry-light/5 group-hover:text-cherry-light/10 transition-colors">
                          <DollarSign size={160} strokeWidth={1} />
                       </div>
                       <div className="relative">
                          <p className="text-[10px] font-black uppercase text-[#6c7293] tracking-[0.3em] mb-6">Gross Revenue</p>
                          <h3 className="text-6xl font-black text-white tracking-tighter mb-4">
                             ₹{analytics[salesRange].rev.toLocaleString("en-IN")}
                          </h3>
                          <div className="flex items-center gap-3">
                             <TrendingUp size={16} className="text-emerald-500" />
                             <span className="text-xs font-bold text-emerald-500">Master Growth Active</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-[#191c24] border border-[#2c2e33] p-10 rounded-[2.5rem]">
                       <p className="text-[10px] font-black uppercase text-[#6c7293] tracking-[0.3em] mb-6">Units Fulfillment</p>
                       <h3 className="text-6xl font-black text-white tracking-tighter mb-4">
                          {analytics[salesRange].count}
                       </h3>
                       <p className="text-xs font-bold text-[#6c7293]">Successful checkouts in this period</p>
                    </div>

                    <div className="bg-gradient-to-br from-cherry-light to-[#ff4d4d] p-10 rounded-[2.5rem] shadow-2xl shadow-cherry-light/20 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.3em]">Quick Projection</p>
                          <CalendarDays size={24} className="text-white/40" />
                       </div>
                       <div>
                          <p className="text-white/60 text-xs font-bold mb-1">Target Achievement</p>
                          <div className="text-4xl font-black text-white">94.2%</div>
                       </div>
                    </div>
                 </div>

                 {/* Product Mix Distribution */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-[#191c24] border border-[#2c2e33] rounded-[2.5rem] p-10">
                       <div className="flex items-center justify-between mb-10">
                          <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                             <PieChart size={20} className="text-cherry-light" />
                             Product Mix Distribution
                          </h4>
                          <span className="text-[10px] font-black uppercase text-[#6c7293]">By Revenue Contribution</span>
                       </div>

                       <div className="space-y-6">
                          {analytics.mix.map(([name, data], i) => {
                             const percentage = (data.rev / analytics.lifetime.rev) * 100;
                             return (
                               <div key={name} className="space-y-2">
                                  <div className="flex justify-between text-xs font-bold">
                                     <span className="text-white">{name}</span>
                                     <span className="text-white/40">{data.units} Units · ₹{data.rev.toLocaleString("en-IN")}</span>
                                  </div>
                                  <div className="h-2 w-full bg-[#0f1015] rounded-full overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${percentage}%` }}
                                       className="h-full bg-cherry-light rounded-full shadow-[0_0_10px_#FF2250]" 
                                     />
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                    </div>

                    <div className="bg-[#0f1015] border border-[#2c2e33] rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6">
                       <div className="w-20 h-20 rounded-3xl bg-cherry-light/10 flex items-center justify-center text-cherry-light mb-4 border border-cherry-light/20">
                          <Tag size={32} />
                       </div>
                       <h4 className="text-2xl font-black text-white uppercase italic">Coupons Engine</h4>
                       <p className="text-[#6c7293] text-sm max-w-[280px] leading-relaxed">
                          Flexible discount architecture integrated. Ready for scheduled releases of holiday promo codes.
                       </p>
                       <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#6c7293] cursor-not-allowed">
                         Locked for V2.1
                       </button>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Existing Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{scale:0.9, opacity:0}}
              animate={{scale:1, opacity:1}}
              exit={{scale:0.9, opacity:0}}
              className="relative w-full max-w-2xl bg-[#191c24] border border-[#2c2e33] rounded-[2.5rem] overflow-hidden"
            >
               <div className="p-10 border-b border-[#2c2e33] flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedOrder.customer_name}</h2>
                    <p className="text-[10px] font-black uppercase text-cherry-light tracking-[0.3em]">Dispatch Record #{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#6c7293] hover:text-white transition-colors">
                    <X size={24} />
                  </button>
               </div>

               <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-[#6c7293] uppercase tracking-widest">Phone</p>
                        <p className="text-lg font-bold text-white">{selectedOrder.phone}</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-[#6c7293] uppercase tracking-widest">Email</p>
                        <p className="text-lg font-bold text-white truncate">{selectedOrder.customer_email || "N/A"}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest mb-2">Final Revenue</p>
                        <p className="text-2xl font-black text-white">₹{(selectedOrder.total_price || getOrderPrice(selectedOrder.size, selectedOrder.pages)).toLocaleString("en-IN")}</p>
                        {selectedOrder.coupon_code && (
                           <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                              <Tag size={12} /> {selectedOrder.coupon_code} (-₹{selectedOrder.discount_applied})
                           </div>
                        )}
                     </div>
                     <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-center">
                         <div className="text-center">
                            <p className="text-[10px] font-black text-[#6c7293] uppercase tracking-widest mb-1">Payment Method</p>
                            <p className="text-xs font-bold text-white/40">OFFLINE / WHATSAPP</p>
                         </div>
                     </div>
                  </div>

                  <div className="bg-[#0f1015] border border-[#2c2e33] p-8 rounded-3xl">
                     <p className="text-[10px] font-black text-[#6c7293] uppercase tracking-widest mb-4">Shipping Destination</p>
                     <p className="text-xl text-white font-medium leading-relaxed italic mb-8">
                        {selectedOrder.address}
                     </p>
                     <div className="flex flex-wrap gap-3">
                        {[selectedOrder.city, selectedOrder.state, selectedOrder.pincode].map((tag, i) => (
                          <span key={i} className="px-5 py-2 bg-[#191c24] border border-[#2c2e33] rounded-full text-[10px] font-black uppercase text-[#6c7293]">
                            {tag}
                          </span>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { l: "SIZE", v: selectedOrder.size },
                      { l: "PAGES", v: selectedOrder.pages },
                      { l: "PHOTOS", v: selectedOrder.photosCount },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/5 p-5 rounded-2xl text-center">
                        <p className="text-[8px] font-black text-[#6c7293] mb-1">{s.l}</p>
                        <p className="text-sm font-bold text-white">{s.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl space-y-6">
                       <div className="flex items-center gap-3 text-red-500">
                          <ShieldAlert size={20} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Privacy Controls</p>
                       </div>
                       
                       <div className="flex flex-col gap-4">
                          <Link 
                            href={`/order/curate/${selectedOrder.upload_session_id || selectedOrder.id}`} 
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                             <ImageIcon size={16} /> Manage Photos
                          </Link>

                          <button 
                            onClick={() => {
                              const link = `${window.location.origin}/order/curate/${selectedOrder.upload_session_id || selectedOrder.id}`;
                              const msg = `Hi ${selectedOrder.customer_name}! You can manage, add, or delete your photos for Order #${selectedOrder.id?.slice(-8)} here: ${link}`;
                              window.open(`https://wa.me/91${selectedOrder.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="flex-1 flex items-center justify-center gap-3 bg-green-500/10 hover:bg-green-600 text-green-500 hover:text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-green-500/20"
                          >
                             <Phone size={16} /> Share Link
                          </button>
                       </div>

                       <button 
                          onClick={() => handleDeletePhotos(selectedOrder.photo_urls?.[0] || selectedOrder.id || "")}
                            disabled={deletingPhotos}
                            className="w-full flex items-center justify-center gap-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-600/20 disabled:opacity-50"
                          >
                             {deletingPhotos ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                             {deletingPhotos ? "Wiping Data..." : "Permanently Delete All Photos"}
                          </button>
                    </div>

                  <a 
                    href={`https://wa.me/91${selectedOrder.phone}`}
                    className="w-full flex items-center justify-center gap-4 bg-[#25D366] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-950/20 active:scale-98 transition-all"
                  >
                    <Phone size={20} />
                    Contact Customer
                  </a>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
