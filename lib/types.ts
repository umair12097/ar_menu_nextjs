export interface User {
  id: number;
  email: string;
  name: string;
  role: "owner" | "staff";
  created_at: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  qr_code_url?: string;
  owner_id: number;
  is_active: boolean;
  created_at: string;
  menu_items?: MenuItem[];
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
  restaurant_id: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  model_3d_url?: string;
  category_id?: number;
  category?: Category;
  restaurant_id: number;
  rating: number;
  rating_count: number;
  is_available: boolean;
  is_featured: boolean;
  preparation_time: number;
  calories?: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  notes?: string;
  menu_item?: MenuItem;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  order_number: string;
  restaurant_id: number;
  table_number?: string;
  customer_name?: string;
  customer_phone?: string;
  status: OrderStatus;
  total_price: number;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}
