"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Box,
  Star,
  Clock,
  Loader2,
  Search,
  Tag,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { menuApi, restaurantApi, uploadApi } from "@/lib/api";
import { Category, MenuItem, Restaurant } from "@/lib/types";
import { API_URL } from "@/lib/api";

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function ItemModal({
  restaurantId,
  categories,
  editing,
  onClose,
  onSaved,
}: {
  restaurantId: number;
  categories: Category[];
  editing: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: editing?.name ?? "",
    description: editing?.description ?? "",
    price: String(editing?.price ?? ""),
    category_id: String(editing?.category_id ?? ""),
    preparation_time: String(editing?.preparation_time ?? "15"),
    calories: String(editing?.calories ?? ""),
    is_featured: editing?.is_featured ?? false,
    is_available: editing?.is_available ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        category_id: form.category_id ? parseInt(form.category_id) : undefined,
        preparation_time: parseInt(form.preparation_time),
        calories: form.calories ? parseInt(form.calories) : undefined,
        is_featured: form.is_featured,
        is_available: form.is_available,
      };

      if (editing) {
        await menuApi.updateItem(editing.id, payload);
        toast.success("Item updated");
      } else {
        await menuApi.createItem(restaurantId, payload);
        toast.success("Item created");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {editing ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Name *</label>
              <input
                className="input"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Classic Burger"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the dish..."
              />
            </div>
            <div>
              <label className="label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="9.99"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Prep Time (min)</label>
              <input
                type="number"
                min="1"
                className="input"
                value={form.preparation_time}
                onChange={(e) => setForm({ ...form, preparation_time: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Calories (kcal)</label>
              <input
                type="number"
                min="0"
                className="input"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="featured" className="text-sm text-slate-700">
                Featured item
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="available"
                checked={form.is_available}
                onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="available" className="text-sm text-slate-700">
                Available
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Menu Item Card ────────────────────────────────────────────────────────────
function MenuItemCard({
  item,
  restaurantId,
  onEdit,
  onDelete,
  onRefresh,
}: {
  item: MenuItem;
  restaurantId: number;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadApi.uploadMenuItemImage(item.id, file);
      toast.success("Image uploaded");
      onRefresh();
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleModelUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "glb" && ext !== "gltf") {
      toast.error("Please upload a .glb or .gltf file");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      await uploadApi.uploadMenuItemModel(item.id, file);
      toast.success("3D model uploaded");
      onRefresh();
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Failed to upload model";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card group overflow-hidden transition hover:shadow-card-md">
      {/* Image */}
      <div className="relative h-44 w-full bg-slate-100">
        {item.image_url ? (
          <Image
            src={`${API_URL}${item.image_url}`}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Tag className="h-10 w-10" />
          </div>
        )}
        {item.is_featured && (
          <span className="absolute left-2 top-2 badge bg-amber-400 text-amber-900">
            ⭐ Featured
          </span>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
          <span className="shrink-0 text-lg font-bold text-brand-600">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="mb-3 line-clamp-2 text-sm text-slate-500">{item.description}</p>
        )}

        <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
          {item.rating_count > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {item.rating.toFixed(1)} ({item.rating_count})
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.preparation_time} min
          </span>
          {item.category && (
            <span className="badge bg-slate-100 text-slate-600">
              {item.category.name}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="btn-secondary flex-1 text-xs py-2"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <label className={`btn-secondary cursor-pointer py-2 text-xs ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload className="h-3.5 w-3.5" />
            Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          <label
            title="Upload .glb / .gltf 3D model"
            className={`btn-secondary cursor-pointer py-2 text-xs ${item.model_3d_url ? "border-brand-300 text-brand-600" : ""} ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Box className="h-3.5 w-3.5" />
            3D
            <input
              type="file"
              accept=".glb,.gltf"
              className="hidden"
              onChange={handleModelUpload}
              disabled={uploading}
            />
          </label>

          <button
            onClick={() => onDelete(item.id)}
            className="btn-ghost py-2 text-xs text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCatName, setNewCatName] = useState("");

  const loadData = useCallback(async () => {
    try {
      const rRes = await restaurantApi.getMy();
      if (!rRes.data.length) return;
      const r = rRes.data[0] as Restaurant;
      setRestaurant(r);
      const [iRes, cRes] = await Promise.all([
        menuApi.getItems(r.id),
        menuApi.getCategories(r.id),
      ]);
      setItems(iRes.data);
      setCategories(cRes.data);
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function deleteItem(id: number) {
    if (!confirm("Delete this menu item?")) return;
    try {
      await menuApi.deleteItem(id);
      toast.success("Item deleted");
      loadData();
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function addCategory() {
    if (!newCatName.trim() || !restaurant) return;
    try {
      await menuApi.createCategory(restaurant.id, { name: newCatName.trim(), sort_order: categories.length });
      setNewCatName("");
      loadData();
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  }

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === null || i.category_id === filterCat;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-slate-300" />
        <p className="text-slate-500">
          Please create your restaurant first in{" "}
          <a href="/dashboard/settings" className="text-brand-600 underline">
            Settings
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
          <p className="text-sm text-slate-500">{items.length} items total</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowModal(true); }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Categories bar */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setFilterCat(null)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${filterCat === null ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${filterCat === c.id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {c.name}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <input
              type="text"
              className="input w-36 py-1.5 text-sm"
              placeholder="+ New category"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <button onClick={addCategory} className="btn-secondary py-1.5 text-sm">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          className="input pl-10"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200">
          <AlertCircle className="h-10 w-10 text-slate-300" />
          <p className="text-slate-500">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              restaurantId={restaurant.id}
              onEdit={(i) => { setEditingItem(i); setShowModal(true); }}
              onDelete={deleteItem}
              onRefresh={loadData}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ItemModal
          restaurantId={restaurant.id}
          categories={categories}
          editing={editingItem}
          onClose={() => setShowModal(false)}
          onSaved={loadData}
        />
      )}
    </div>
  );
}
