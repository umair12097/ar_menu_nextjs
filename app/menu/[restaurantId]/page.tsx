"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Star,
  Clock,
  Flame,
  Box,
  Loader2,
  ChevronLeft,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { restaurantApi, orderApi, menuApi } from "@/lib/api";
import { API_URL } from "@/lib/api";
import { CartItem, Category, MenuItem, Restaurant } from "@/lib/types";
import dynamic from "next/dynamic";

const ARViewer = dynamic(() => import("@/components/ar-viewer"), { ssr: false });

// ── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="flex items-center gap-1 text-sm">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-200 fill-slate-200"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-slate-400">
        {rating.toFixed(1)} ({count})
      </span>
    </span>
  );
}

// ── AR Modal ─────────────────────────────────────────────────────────────────
function ARModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const [rated, setRated] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  async function submitRating(r: number) {
    try {
      await menuApi.rateItem(item.id, r);
      setRated(true);
      toast.success("Thanks for your rating!");
    } catch {
      toast.error("Could not submit rating");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <span className="font-medium text-white truncate mx-4">{item.name}</span>
        <span className="text-lg font-bold text-brand-400">${item.price.toFixed(2)}</span>
      </div>

      {item.model_3d_url ? (
        <div className="flex-1">
          <ARViewer
            src={`${API_URL}${item.model_3d_url}`}
            poster={item.image_url ? `${API_URL}${item.image_url}` : undefined}
            alt={item.name}
          />
        </div>
      ) : (
        <div className="relative flex-1">
          {item.image_url ? (
            <Image
              src={`${API_URL}${item.image_url}`}
              alt={item.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-600">
              No image available
            </div>
          )}
        </div>
      )}

      {/* Rating bar */}
      <div className="bg-black/80 px-4 py-4 backdrop-blur-sm text-center">
        {!rated ? (
          <>
            <p className="mb-2 text-sm text-slate-300">Rate this dish:</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHoverStar(i)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => submitRating(i)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    className={`h-7 w-7 ${
                      i <= hoverStar
                        ? "fill-amber-400 text-amber-400"
                        : "fill-white/10 text-white/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-emerald-400 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" /> Rating submitted. Thank you!
          </p>
        )}
      </div>
    </div>
  );
}

// ── Cart Sheet ────────────────────────────────────────────────────────────────
function CartSheet({
  cart,
  restaurantId,
  onClose,
  onOrderPlaced,
  onRemove,
  onQtyChange,
}: {
  cart: CartItem[];
  restaurantId: number;
  onClose: () => void;
  onOrderPlaced: () => void;
  onRemove: (id: number) => void;
  onQtyChange: (id: number, qty: number) => void;
}) {
  const [form, setForm] = useState({ name: "", table: "", phone: "", notes: "" });
  const [placing, setPlacing] = useState(false);
  const total = cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      await orderApi.create({
        restaurant_id: restaurantId,
        table_number: form.table || undefined,
        customer_name: form.name || undefined,
        customer_phone: form.phone || undefined,
        notes: form.notes || undefined,
        items: cart.map((c) => ({
          menu_item_id: c.menuItem.id,
          quantity: c.quantity,
          notes: c.notes,
        })),
      });
      toast.success("Order placed! The kitchen will start soon. 🍽️");
      onOrderPlaced();
    } catch (err: any) {
      toast.error(err.response?.data?.detail ?? "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Your Order ({cart.reduce((s, c) => s + c.quantity, 0)})
          </h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.map(({ menuItem, quantity }) => (
            <div key={menuItem.id} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {menuItem.image_url && (
                  <Image
                    src={`${API_URL}${menuItem.image_url}`}
                    alt={menuItem.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{menuItem.name}</p>
                <p className="text-sm font-semibold text-brand-600">
                  ${(menuItem.price * quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onQtyChange(menuItem.id, quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => onQtyChange(menuItem.id, quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onRemove(menuItem.id)}
                  className="ml-1 text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total & form */}
        <div className="border-t px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Total</span>
            <span className="text-xl font-bold text-slate-900">${total.toFixed(2)}</span>
          </div>

          <form onSubmit={placeOrder} className="space-y-3">
            <input
              className="input text-sm"
              placeholder="Your name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input text-sm"
              placeholder="Table number"
              value={form.table}
              onChange={(e) => setForm({ ...form, table: e.target.value })}
            />
            <input
              className="input text-sm"
              placeholder="Phone number (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              className="input resize-none text-sm"
              rows={2}
              placeholder="Special requests..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <button
              type="submit"
              disabled={placing || cart.length === 0}
              className="btn-primary w-full py-3 text-base"
            >
              {placing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Place Order
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Menu Item Card (customer) ─────────────────────────────────────────────────
function MenuCard({
  item,
  onAddToCart,
  onView3D,
}: {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onView3D: (item: MenuItem) => void;
}) {
  return (
    <div className={`card overflow-hidden transition hover:shadow-card-md ${!item.is_available ? "opacity-60" : ""}`}>
      {/* Image */}
      <div className="relative h-40 w-full bg-slate-100">
        {item.image_url ? (
          <Image
            src={`${API_URL}${item.image_url}`}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            🍽️
          </div>
        )}
        {item.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-900">
            ⭐ Featured
          </span>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <span className="shrink-0 text-base font-bold text-brand-600">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="mb-2 line-clamp-2 text-xs text-slate-500">{item.description}</p>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {item.rating_count > 0 && <StarRating rating={item.rating} count={item.rating_count} />}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.preparation_time} min
          </span>
          {item.calories && (
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-400" />
              {item.calories} kcal
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {(item.model_3d_url || item.image_url) && (
            <button
              onClick={() => onView3D(item)}
              className="btn-secondary flex-1 text-xs py-2 border-brand-200 text-brand-700 hover:bg-brand-50"
            >
              <Box className="h-3.5 w-3.5" />
              {item.model_3d_url ? "AR View" : "View"}
            </button>
          )}
          <button
            disabled={!item.is_available}
            onClick={() => onAddToCart(item)}
            className="btn-primary flex-1 text-xs py-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CustomerMenuPage({ params }: { params: { restaurantId: string } }) {
  const restaurantId = parseInt(params.restaurantId);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [arItem, setArItem] = useState<MenuItem | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const rRes = await restaurantApi.getById(restaurantId);
        setRestaurant(rRes.data);
        setItems(rRes.data.menu_items ?? []);
        setCategories(rRes.data.categories ?? []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [restaurantId]);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    toast.success(`${item.name} added to order`);
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== id));
  }

  function updateQty(id: number, qty: number) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === id ? { ...c, quantity: qty } : c))
    );
  }

  const filtered = items.filter(
    (i) => activeCategory === null || i.category_id === activeCategory
  );

  const cartTotal = cart.reduce((s, c) => s + c.quantity, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center px-6">
        <AlertCircle className="h-16 w-16 text-slate-300" />
        <h1 className="text-xl font-bold text-slate-700">Restaurant not found</h1>
        <p className="text-slate-500">This QR code may be invalid or the restaurant is unavailable.</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Placed!</h1>
          <p className="mt-2 text-slate-500">
            Your order has been received. We&apos;ll start preparing it shortly.
          </p>
        </div>
        <button
          onClick={() => { setOrderPlaced(false); setCart([]); }}
          className="btn-primary"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* ── Restaurant header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-brand-900 px-5 pb-8 pt-12 text-white">
        <div className="mx-auto max-w-2xl text-center">
          {restaurant.logo_url && (
            <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl shadow-xl border-2 border-white/20">
              <Image
                src={`${API_URL}${restaurant.logo_url}`}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-2xl font-extrabold">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="mt-1 text-sm text-slate-300">{restaurant.description}</p>
          )}
          {restaurant.address && (
            <p className="mt-1 text-xs text-slate-400">📍 {restaurant.address}</p>
          )}
        </div>
      </div>

      {/* ── Category tabs ── */}
      {categories.length > 0 && (
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-2xl">
            <div className="flex overflow-x-auto px-4 py-3 gap-2 scrollbar-thin">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === null
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    activeCategory === c.id
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Menu items ── */}
      <div className="mx-auto max-w-2xl px-4 pt-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <AlertCircle className="h-12 w-12 text-slate-200" />
            <p className="text-slate-500">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onView3D={setArItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Floating cart button ── */}
      {cartTotal > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 px-4">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-3 rounded-2xl bg-brand-600 px-6 py-4 text-white shadow-2xl shadow-brand-600/40 transition hover:bg-brand-700 hover:scale-105"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-600 text-sm font-bold">
              {cartTotal}
            </div>
            <span className="font-semibold">View Order</span>
            <span className="font-bold text-brand-200">
              ${cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0).toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* ── AR Viewer ── */}
      {arItem && (
        <ARModal item={arItem} onClose={() => setArItem(null)} />
      )}

      {/* ── Cart sheet ── */}
      {showCart && (
        <CartSheet
          cart={cart}
          restaurantId={restaurantId}
          onClose={() => setShowCart(false)}
          onOrderPlaced={() => { setShowCart(false); setOrderPlaced(true); }}
          onRemove={removeFromCart}
          onQtyChange={updateQty}
        />
      )}
    </div>
  );
}
