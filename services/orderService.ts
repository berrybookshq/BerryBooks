import { supabase } from "@/lib/supabase";

export type OrderStatus = 
  | "Received" 
  | "Designing" 
  | "Ready for Print" 
  | "Printing" 
  | "Packed"
  | "Shipped" 
  | "Delivered";

export interface OrderData {
  id?: string;
  customer_name: string;
  customer_email?: string;
  customer_id?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  size: "A4" | "A5" | string;
  pages: number;
  photosCount: number;
  photo_urls?: string[];
  upload_session_id?: string;
  photos_deleted?: boolean;
  total_price?: number;
  coupon_code?: string;
  discount_applied?: number;
  status: OrderStatus;
  createdAt: string;
}

/**
 * Creates a real order in Supabase
 */
export async function createOrder(data: Omit<OrderData, "status" | "createdAt">): Promise<string> {
  const customId = data.id || `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const payload: any = {
    order_id: customId,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_id: data.customer_id,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    product_id: data.size,
    pages: data.pages,
    photo_count: data.photosCount,
    photo_urls: data.photo_urls || [],
    upload_session_id: data.upload_session_id,
    total_price: data.total_price,
    coupon_code: data.coupon_code,
    discount_applied: data.discount_applied,
    status: 'Received'
  };

  const { data: newOrder, error } = await supabase
    .from('orders')
    .insert(payload)
    .select()
    .single();

  if (error) {
    // If the error is about missing columns, retry without the new features
    if (error.message.includes('upload_session_id') || error.message.includes('photo_urls')) {
      console.warn("DB schema mismatch, retrying without curation columns...");
      const fallbackPayload = { ...payload };
      delete fallbackPayload.upload_session_id;
      delete fallbackPayload.photo_urls;

      const { data: retryData, error: retryError } = await supabase
        .from('orders')
        .insert(fallbackPayload)
        .select()
        .single();

      if (retryError) throw new Error(`Order failed: ${retryError.message}`);
      return retryData.order_id;
    }

    console.error("Supabase Error Message:", error.message);
    throw new Error(`Order failed: ${error.message}`);
  }

  return newOrder.order_id;
}

/**
 * Fetches an order by ID from Supabase
 */
export async function getOrder(id: string): Promise<OrderData | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.order_id,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    size: data.product_id,
    pages: data.pages,
    photosCount: data.photo_count,
    photo_urls: data.photo_urls,
    upload_session_id: data.upload_session_id,
    photos_deleted: data.photos_deleted,
    total_price: data.total_price,
    coupon_code: data.coupon_code,
    discount_applied: data.discount_applied,
    status: data.status as OrderStatus,
    createdAt: data.created_at,
  };
}

/**
 * Fetches all orders for the current user
 */
export async function getUserOrders(userId: string): Promise<OrderData[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];

  return data.map(item => ({
    id: item.order_id,
    customer_name: item.customer_name,
    customer_email: item.customer_email,
    phone: item.phone,
    address: item.address,
    city: item.city,
    state: item.state,
    pincode: item.pincode,
    size: item.product_id,
    pages: item.pages,
    photosCount: item.photo_count,
    status: item.status as OrderStatus,
    createdAt: item.created_at,
  }));
}

export async function checkIsAdmin(email?: string): Promise<boolean> {
  if (!email) return false;
  
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .maybeSingle(); // maybeSingle is safer than single() when dealing with potential errors

    if (error) {
      console.warn("Admin check warning (non-critical):", error.message);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Admin check failed (network/auth issue):", err);
    return false;
  }
}

/**
 * Fetches ALL orders for administrators
 */
export async function getAllOrders(): Promise<OrderData[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fetch all orders error:", error);
    return [];
  }

  return data.map(item => ({
    id: item.order_id,
    customer_name: item.customer_name,
    customer_email: item.customer_email,
    customer_id: item.customer_id,
    phone: item.phone,
    address: item.address,
    city: item.city,
    state: item.state,
    pincode: item.pincode,
    size: item.product_id,
    pages: item.pages,
    photosCount: item.photo_count,
    photo_urls: item.photo_urls,
    upload_session_id: item.upload_session_id,
    photos_deleted: item.photos_deleted,
    total_price: item.total_price,
    coupon_code: item.coupon_code,
    discount_applied: item.discount_applied,
    status: item.status as OrderStatus,
    createdAt: item.created_at,
  }));
}

/**
 * Updates order status in Supabase
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('order_id', id);

  return !error;
}

/**
 * Marks an order's photos as permanently deleted in Supabase
 */
export async function markPhotosDeleted(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ photos_deleted: true })
    .eq('order_id', id);

  return !error;
}
