"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllOrders, updateOrderStatus, type OrderData, type OrderStatus } from "@/services/orderService";
import { 
  X, 
  LogOut, 
  ShoppingBag, 
  HelpCircle, 
  Package, 
  ChevronRight,
  User as UserIcon,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Search,
  Phone,
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  Edit3,
  Box,
  Layers,
  Tag
} from "lucide-react";
import { PRODUCTS, WHATSAPP_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; icon: any }> = {
  "Received": { color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", icon: Clock },
  "Designing": { color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", icon: Edit3 },
  "Ready for Print": { color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", icon: Layers },
  "Printing": { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", icon: Printer },
  "Packed": { color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20", icon: Box },
  "Shipped": { color: "text-indigo-400", bg: "bg-indigo-400/10 border-indigo-400/20", icon: Truck },
  "Delivered": { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle2 },
};

const ORDER_STATUS_LIST: OrderStatus[] = [
  "Received", "Designing", "Ready for Print", "Printing", "Packed", "Shipped", "Delivered"
];

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, loading: authLoading, isAdmin, signInWithGoogle, signOut } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFetchingOrders(true);
      if (isAdmin) {
        getAllOrders().then((data) => {
          setOrders(data);
          setFetchingOrders(false);
        });
      } else {
        import("@/services/orderService").then(m => m.getUserOrders(user.id)).then(data => {
            setOrders(data);
            setFetchingOrders(false);
        });
      }
    } else {
      setOrders([]);
    }
  }, [user, isAdmin, isOpen]);

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    const s = search.toLowerCase();
    return orders.filter(o => 
      o.id?.toLowerCase().includes(s) || 
      o.customer_name.toLowerCase().includes(s) ||
      o.customer_email?.toLowerCase().includes(s) ||
      o.phone.includes(s)
    );
  }, [orders, search]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
    setUpdatingId(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Content */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full sm:max-w-xl bg-gradient-to-b from-[#181818] to-[#0c0c0c] border-t sm:border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden flex flex-col h-[92vh] sm:h-[85vh] shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
        >
          {/* Top Bar Indicator (Mobile) */}
          <div className="sm:hidden w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />

          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between shrink-0 border-b border-white/5">
            <div className="flex items-center gap-4">
               {selectedOrder && (
                 <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-105 active:scale-95">
                   <ArrowLeft size={18} />
                 </button>
               )}
               <div>
                  <h3 className="text-xl font-serif font-black text-white leading-none">
                    {selectedOrder ? "Order Details" : isAdmin ? "Control Panel" : "My Account"}
                  </h3>
                  {!selectedOrder && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1.5">BerryBooks Portal</p>
                  )}
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            {authLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-white/40 gap-4">
                <Loader2 className="animate-spin text-cherry-light" size={40} />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Syncing Identity</span>
              </div>
            ) : !user ? (
              /* LOGGED OUT STATE */
              <div className="p-10 text-center h-full flex flex-col justify-center">
                <div className="w-24 h-24 bg-cherry-light/10 border border-cherry-light/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-cherry-light shadow-xl shadow-cherry/10">
                  <UserIcon size={48} />
                </div>
                <h4 className="text-4xl font-serif font-black mb-4">Welcome Home</h4>
                <p className="text-white/40 text-sm mb-12 max-w-[300px] mx-auto leading-relaxed font-medium">
                  Verify your identity to unlock your photobook history and premium member services.
                </p>

                <button
                  onClick={() => signInWithGoogle()}
                  className="w-full h-16 flex items-center justify-center gap-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/5"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Login with Google
                </button>
              </div>
            ) : selectedOrder ? (
              /* DETAIL VIEW */
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 space-y-10"
              >
                {/* Header Info */}
                <div className="bg-[#1e1e1e] border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                   <div className="flex items-center justify-between mb-8">
                       <span className="font-mono text-sm font-black text-cherry-light">{selectedOrder.id}</span>
                       <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_CONFIG[selectedOrder.status].bg} ${STATUS_CONFIG[selectedOrder.status].color}`}>
                        {selectedOrder.status}
                      </div>
                   </div>

                   <div className="space-y-8">
                      {/* Vertical Progress Tracker - CUSTOMER ONLY */}
                      {!isAdmin && (
                        <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                          <h5 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-8 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-cherry-light" />
                             Order Progress
                          </h5>
                          
                          <div className="relative space-y-8 pl-4">
                             <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-white/5" />
                             {ORDER_STATUS_LIST.map((s, idx) => {
                               const currentIndex = ORDER_STATUS_LIST.indexOf(selectedOrder.status);
                               const isCompleted = idx < currentIndex;
                               const isActive = idx === currentIndex;
                               return (
                                 <div key={s} className="relative flex items-start gap-6">
                                    <div className={`
                                      relative z-10 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                      ${isCompleted || isActive ? "bg-cherry-light border-cherry-light" : "bg-[#181818] border-white/10"}
                                    `}>
                                       {isCompleted ? <CheckCircle2 size={12} className="text-white" /> : <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-white/10"}`} />}
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                       <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-white" : isCompleted ? "text-white/60" : "text-white/20"}`}>
                                          {s}
                                       </p>
                                    </div>
                                 </div>
                               );
                             })}
                          </div>
                        </div>
                      )}

                      {/* ADMIN DOSSIER */}
                      {isAdmin && (
                        <div className="space-y-4">
                           <div className="bg-[#252525] border border-white/10 rounded-3xl p-5 space-y-5">
                              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                 <h6 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Customer Details</h6>
                                 <span className="text-[10px] font-black text-cherry-light">{selectedOrder.customer_email || "NO-EMAIL"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/60">
                                       <UserIcon size={20} />
                                    </div>
                                    <span className="font-bold text-base">{selectedOrder.customer_name}</span>
                                 </div>
                                 <a href={`tel:${selectedOrder.phone}`} className="w-12 h-12 bg-cherry-light text-white rounded-2xl flex items-center justify-center shadow-lg shadow-cherry/20">
                                    <Phone size={20} />
                                 </a>
                              </div>
                           </div>

                           <div className="bg-[#252525] border border-white/10 rounded-3xl p-5">
                              <h6 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">Specifications</h6>
                              <div className="grid grid-cols-3 gap-3">
                                 {[
                                   { l: "Variant", v: selectedOrder.size },
                                   { l: "Pages", v: selectedOrder.pages },
                                   { l: "Photos", v: selectedOrder.photosCount },
                                 ].map((spec, i) => (
                                    <div key={i} className="bg-white/5 p-4 rounded-2xl text-center">
                                       <p className="text-[8px] font-black text-white/20 uppercase mb-1">{spec.l}</p>
                                       <p className="text-xs font-bold text-white/80">{spec.v}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="bg-[#252525] border border-white/10 rounded-3xl p-6">
                              <h6 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1 shadow-lg bg-emerald-500/10 text-emerald-500 inline-block px-3 py-1 rounded-lg">Financial Overview</h6>
                               <div className="flex items-end justify-between mt-3">
                                  <p className="text-2xl font-black text-white leading-none">₹{(selectedOrder.total_price || getOrderPrice(selectedOrder.size, selectedOrder.pages)).toLocaleString("en-IN")}</p>
                                  {selectedOrder.coupon_code && (
                                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Applied: {selectedOrder.coupon_code}</span>
                                  )}
                               </div>
                           </div>

                           <div className="bg-[#252525] border border-white/10 rounded-3xl p-6">
                              <h6 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">Delivery Coordinate</h6>
                              <p className="text-base font-bold text-white/90 leading-relaxed mb-6 italic">
                                 {selectedOrder.address}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                 {[selectedOrder.city, selectedOrder.state, selectedOrder.pincode].map((tag, i) => (
                                    <span key={i} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white/60">
                                       {tag}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                      )}

                      {!isAdmin && (
                        <>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5">
                                 <Package size={24} className="text-white/20" />
                                 <div>
                                   <p className="text-[10px] uppercase font-black text-white/30">Variant</p>
                                   <p className="text-sm font-bold">{selectedOrder.size}</p>
                                 </div>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5">
                                 <Layers size={24} className="text-white/20" />
                                 <div>
                                   <p className="text-[10px] uppercase font-black text-white/30">Length</p>
                                   <p className="text-sm font-bold">{selectedOrder.pages} Pgs</p>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
                                 <Tag size={24} className="text-cherry-light mt-1" />
                                 <div className="flex-1">
                                   <p className="text-[10px] uppercase font-black text-white/30 mb-2">Order Value</p>
                                   <div className="flex items-end justify-between">
                                      <p className="text-2xl font-black text-white leading-none">₹{(selectedOrder.total_price || getOrderPrice(selectedOrder.size, selectedOrder.pages)).toLocaleString("en-IN")}</p>
                                      {selectedOrder.coupon_code && (
                                         <span className="text-[9px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20 uppercase">
                                            {selectedOrder.coupon_code} Applied
                                         </span>
                                      )}
                                   </div>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <MapPin size={24} className="text-cherry-light mt-1" />
                                 <div>
                                   <p className="text-[10px] uppercase font-black text-white/30 mb-2">Delivery Address</p>
                                   <p className="text-sm text-white/90 italic leading-relaxed">
                                     {selectedOrder.address},<br/>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                                   </p>
                                 </div>
                              </div>
                           </div>
                        </>
                      )}
                   </div>
                </div>

                {isAdmin && (
                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Actionable States</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {ORDER_STATUS_LIST.map((s) => (
                        <button
                          key={s}
                          disabled={updatingId === selectedOrder.id}
                          onClick={() => handleStatusUpdate(selectedOrder.id!, s)}
                          className={`
                            px-4 py-4 rounded-2xl text-[10px] font-black border transition-all uppercase tracking-widest
                            ${selectedOrder.status === s 
                              ? "bg-cherry-light text-white border-cherry-light shadow-lg shadow-cherry/20" 
                              : "bg-[#1e1e1e] text-white/40 border-white/5 hover:border-white/20"}
                            disabled:opacity-50
                          `}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 mb-12">
                   <button 
                     onClick={() => {
                        const msg = encodeURIComponent(`Hi ${selectedOrder.customer_name}, I'm reaching out about your BerryBooks order #${selectedOrder.id}`);
                        window.open(`https://wa.me/91${selectedOrder.phone}?text=${msg}`, '_blank');
                     }}
                     className="w-full h-16 flex items-center justify-center gap-4 bg-[#25D366] text-white font-black uppercase tracking-widest text-xs rounded-3xl shadow-2xl shadow-green-950/20 active:scale-95 transition-all"
                   >
                     <ShoppingBag size={20} />
                     Support via WhatsApp
                   </button>
                </div>
              </motion.div>
            ) : (
              /* DASHBOARD VIEW */
              <div className="p-8 space-y-10">
                {/* User Identity Header */}
                <div className="flex items-center gap-6 p-6 bg-[#1e1e1e] border border-white/10 rounded-[2.5rem] shadow-xl">
                   <div className="relative">
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-[1.25rem] object-cover border-2 border-cherry-light/40"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#1e1e1e] rounded-full" />
                   </div>
                   <div>
                      <h4 className="text-xl font-serif font-black text-white leading-tight">
                        Hi, {user.user_metadata.full_name?.split(' ')[0] || "Member"}
                      </h4>
                      <p className="text-xs font-medium text-white/30 truncate max-w-[180px]">
                        {user.email}
                      </p>
                   </div>
                </div>

                {isAdmin && (
                  <div className="space-y-4">
                    <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cherry-light transition-colors" size={20} />
                      <input 
                        type="text" 
                        placeholder="Search Feed..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-white/5 rounded-3xl px-14 py-5 text-sm focus:outline-none focus:border-cherry-light/30 transition-all font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                   <div className="flex items-center justify-between mb-8 px-2">
                      <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                         {isAdmin ? "Global Stream" : "History Track"}
                      </h5>
                      {isAdmin && <span className="text-[10px] bg-cherry-light/10 text-cherry-light px-3 py-1 rounded-full font-black">MASTER ACTIVE</span>}
                   </div>

                   {fetchingOrders ? (
                      <div className="py-24 flex flex-col items-center justify-center gap-4 text-white/10">
                        <Loader2 size={40} className="animate-spin" />
                      </div>
                   ) : filteredOrders.length > 0 ? (
                      <div className="space-y-4">
                        {filteredOrders.map((order) => {
                          const config = STATUS_CONFIG[order.status];
                          const StatusIcon = config.icon;
                          const finalVal = order.total_price || getOrderPrice(order.size, order.pages);
                          return (
                            <div 
                              key={order.id} 
                              onClick={() => setSelectedOrder(order)}
                              className="bg-[#1e1e1e] border border-white/5 rounded-[2rem] p-6 hover:bg-[#252525] hover:border-white/10 transition-all cursor-pointer group active:scale-95"
                            >
                               <div className="flex items-center gap-5">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${config.bg} ${config.color} shadow-lg shadow-black/20`}>
                                    <StatusIcon size={24} strokeWidth={2.5} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] font-black text-cherry-light tracking-tighter">{order.id}</span>
                                        <span className="text-[10px] font-black text-white/40">₹{finalVal.toLocaleString("en-IN")}</span>
                                      </div>
                                      <span className="text-[9px] font-black uppercase text-white/20">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h6 className="text-white text-base font-bold truncate leading-none mb-2">
                                      {isAdmin ? order.customer_name : `${order.size} Book`}
                                    </h6>
                                    <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${config.color}`}>
                                       {order.status}
                                    </p>
                                  </div>
                                  <ChevronRight size={18} className="text-white/10 group-hover:text-cherry-light group-hover:translate-x-1 transition-all" />
                               </div>
                            </div>
                          );
                        })}
                      </div>
                   ) : (
                      /* EMPTY STATE */
                      <div className="text-center py-24 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
                        <Box size={48} className="mx-auto mb-6 text-white/5" strokeWidth={1} />
                        <h6 className="text-white font-serif text-xl font-bold mb-2">No Memories Yet</h6>
                        <p className="text-white/20 text-xs mb-10 max-w-[200px] mx-auto">Start your first premium collection today.</p>
                        <button 
                          onClick={() => { onClose(); window.location.href = "/product"; }}
                          className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-full hover:scale-105 transition-all shadow-xl shadow-white/5"
                        >
                          Begin Journey
                        </button>
                      </div>
                   )}
                </div>

                {/* Footer Buttons */}
                <div className="space-y-4 pt-8 border-t border-white/5">
                   {isAdmin && (
                    <Link 
                      href="/admin"
                      onClick={onClose}
                      className="w-full h-16 flex items-center justify-between px-6 bg-cherry-light text-white rounded-[1.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cherry/30"
                    >
                      <div className="flex items-center gap-4">
                        <ShieldCheck size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Master Dashboard</span>
                      </div>
                      <ExternalLink size={18} />
                    </Link>
                  )}

                  <a 
                    href={WHATSAPP_URL}
                    className="w-full h-16 flex items-center justify-between px-6 bg-[#1e1e1e] border border-white/5 rounded-[1.5rem] hover:bg-[#252525] transition-all"
                   >
                     <div className="flex items-center gap-4">
                       <HelpCircle size={20} className="text-white/30" />
                       <span className="text-sm font-bold text-white/70">Support Access</span>
                     </div>
                     <ExternalLink size={16} className="text-white/10" />
                   </a>
                   <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-4 px-6 py-8 text-red-500/40 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
                   >
                     <LogOut size={18} />
                     Secure Sign Out
                   </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
