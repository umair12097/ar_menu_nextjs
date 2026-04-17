"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react";
import toast from "react-hot-toast";
import { orderApi, restaurantApi } from "@/lib/api";
import { Order, OrderStatus, Restaurant } from "@/lib/types";

const STATUS_OPTIONS: { value: string; label: string; colour: string }[] = [
  { value: "pending",   label: "Pending",   colour: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "confirmed", label: "Confirmed", colour: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "preparing", label: "Preparing", colour: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "ready",     label: "Ready",     colour: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "delivered", label: "Delivered", colour: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "cancelled", label: "Cancelled", colour: "bg-red-100 text-red-700 border-red-200" },
];

function statusColour(s: string) {
  return STATUS_OPTIONS.find((o) => o.value === s)?.colour ?? "";
}

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: () => void }) {
  const [updating, setUpdating] = useState(false);

  async function changeStatus(status: string) {
    setUpdating(true);
    try {
      await orderApi.updateStatus(order.id, status);
      toast.success(`Order #${order.order_number} marked as ${status}`);
      onStatusChange();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            #{order.order_number.slice(-4)}
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              {order.customer_name || "Walk-in Customer"}
            </p>
            <p className="text-xs text-slate-400">
              Table {order.table_number || "—"} ·{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-slate-900">
            ${order.total_price.toFixed(2)}
          </span>
          <span className={`badge border capitalize ${statusColour(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                {item.quantity}
              </span>
              <span className="text-slate-700">
                {item.menu_item?.name ?? `Item #${item.menu_item_id}`}
              </span>
              {item.notes && (
                <span className="text-xs text-slate-400 italic">"{item.notes}"</span>
              )}
            </div>
            <span className="font-medium text-slate-700">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        {order.notes && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            📝 {order.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-slate-100 flex items-center gap-2 px-5 py-3.5 bg-slate-50">
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <>
            {order.status !== "ready" && (
              <button
                disabled={updating}
                onClick={() => {
                  const nextMap: Record<string, string> = {
                    pending: "confirmed",
                    confirmed: "preparing",
                    preparing: "ready",
                  };
                  const next = nextMap[order.status];
                  if (next) changeStatus(next);
                }}
                className="btn-primary text-sm py-2"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {{
                  pending:   "Confirm",
                  confirmed: "Start Preparing",
                  preparing: "Mark Ready",
                }[order.status]}
              </button>
            )}
            {order.status === "ready" && (
              <button
                disabled={updating}
                onClick={() => changeStatus("delivered")}
                className="btn-primary text-sm py-2 bg-emerald-600 hover:bg-emerald-700"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Mark Delivered
              </button>
            )}
            <button
              disabled={updating}
              onClick={() => changeStatus("cancelled")}
              className="btn-secondary text-sm py-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async (restaurantId: number) => {
    const res = await orderApi.getRestaurantOrders(restaurantId);
    setOrders(res.data);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const rRes = await restaurantApi.getMy();
        if (!rRes.data.length) return;
        setRestaurant(rRes.data[0]);
        await loadOrders(rRes.data[0].id);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [loadOrders]);

  // Auto-refresh every 30 s
  useEffect(() => {
    if (!restaurant) return;
    const id = setInterval(() => loadOrders(restaurant.id), 30_000);
    return () => clearInterval(id);
  }, [restaurant, loadOrders]);

  async function refresh() {
    if (!restaurant) return;
    setRefreshing(true);
    await loadOrders(restaurant.id);
    setRefreshing(false);
  }

  const filtered = orders.filter(
    (o) => filterStatus === "all" || o.status === filterStatus
  );

  const counts: Record<string, number> = {};
  orders.forEach((o) => { counts[o.status] = (counts[o.status] ?? 0) + 1; });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">{orders.length} total orders</p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="btn-secondary"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="card overflow-x-auto">
        <div className="flex min-w-max">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition ${filterStatus === "all" ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition ${filterStatus === value ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              {label} {counts[value] ? `(${counts[value]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200">
          <UtensilsCrossed className="h-10 w-10 text-slate-300" />
          <p className="text-slate-500">No orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={() => restaurant && loadOrders(restaurant.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
