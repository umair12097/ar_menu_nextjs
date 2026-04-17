"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  ClipboardList,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { restaurantApi, orderApi } from "@/lib/api";
import { Restaurant, Order } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready:     "bg-emerald-100 text-emerald-700",
  delivered: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};

function StatCard({
  label,
  value,
  icon: Icon,
  colour,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  colour: string;
  sub?: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`rounded-xl p-3 ${colour}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const rRes = await restaurantApi.getMy();
        setRestaurants(rRes.data);
        if (rRes.data.length > 0) {
          const oRes = await orderApi.getRestaurantOrders(rRes.data[0].id);
          setOrders(oRes.data);
        }
      } catch {
        /* No restaurant yet */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const restaurant = restaurants[0];

  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString()
  );
  const pendingOrders = orders.filter((o) =>
    ["pending", "confirmed", "preparing"].includes(o.status)
  );
  const totalRevenue = orders.reduce((s, o) => s + o.total_price, 0);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good day, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your restaurant today.
          </p>
        </div>
      </div>

      {/* No restaurant banner */}
      {!restaurant && (
        <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-10 text-center">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-brand-400" />
          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            Set up your restaurant
          </h2>
          <p className="mt-2 text-slate-500">
            Create your restaurant profile to generate a QR code and start
            adding menu items.
          </p>
          <Link href="/dashboard/settings" className="btn-primary mt-6 inline-flex">
            <Plus className="h-4 w-4" />
            Create Restaurant
          </Link>
        </div>
      )}

      {restaurant && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Menu Items"
              value={restaurant.menu_items?.length ?? 0}
              icon={UtensilsCrossed}
              colour="bg-brand-100 text-brand-600"
            />
            <StatCard
              label="Today's Orders"
              value={todayOrders.length}
              icon={ClipboardList}
              colour="bg-emerald-100 text-emerald-600"
            />
            <StatCard
              label="Pending Orders"
              value={pendingOrders.length}
              icon={Clock}
              colour="bg-amber-100 text-amber-600"
              sub="Requires attention"
            />
            <StatCard
              label="Total Revenue"
              value={`$${totalRevenue.toFixed(2)}`}
              icon={TrendingUp}
              colour="bg-purple-100 text-purple-600"
            />
          </div>

          {/* Recent orders */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-800">Recent Orders</h2>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-slate-500">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {orders.slice(0, 8).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-bold text-sm">
                        #{order.order_number.slice(-4)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {order.customer_name || "Walk-in Customer"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Table {order.table_number || "—"} ·{" "}
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`badge capitalize ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
