import { supabase } from "@/lib/supabase";

export interface CouponData {
  name: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  restricted_to?: string; // Optional: 'a4' or 'a5'
}

/**
 * Validates a coupon code against the Supabase database.
 * Returns coupon data if valid and conditions match, otherwise returns null.
 */
export const validateCoupon = async (name: string, productId?: string): Promise<CouponData | null> => {
  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("name, discount_type, discount_value, restricted_to")
      .eq("name", name.toUpperCase().trim())
      .eq("status", "valid")
      .single();

    if (error || !data) {
      return null;
    }

    // Check if coupon is restricted to a specific product
    if (data.restricted_to && productId && data.restricted_to !== productId) {
      console.log(`Coupon ${name} is restricted to ${data.restricted_to}, but product is ${productId}`);
      return null;
    }

    return data as CouponData;
  } catch (err) {
    console.error("Error in validateCoupon:", err);
    return null;
  }
};
