// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import {
//   Save,
//   Loader2,
//   QrCode,
//   Download,
//   RefreshCcw,
//   Upload,
//   Store,
//   ExternalLink,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { restaurantApi, uploadApi } from "@/lib/api";
// import { Restaurant } from "@/lib/types";
// import { API_URL } from "@/lib/api";

// export default function SettingsPage() {
//   const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
//   const [form, setForm] = useState({
//     name: "", description: "", address: "", phone: "", email: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [regenerating, setRegenerating] = useState(false);
//   const [isNew, setIsNew] = useState(false);

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await restaurantApi.getMy();
//         if (res.data.length > 0) {
//           const r: Restaurant = res.data[0];
//           setRestaurant(r);
//           setForm({
//             name: r.name ?? "",
//             description: r.description ?? "",
//             address: r.address ?? "",
//             phone: r.phone ?? "",
//             email: r.email ?? "",
//           });
//         } else {
//           setIsNew(true);
//         }
//       } catch {
//         toast.error("Failed to load settings");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       if (isNew) {
//         const res = await restaurantApi.create(form);
//         setRestaurant(res.data);
//         setIsNew(false);
//         toast.success("Restaurant created! Your QR code is ready.");
//       } else if (restaurant) {
//         const res = await restaurantApi.update(restaurant.id, form);
//         setRestaurant(res.data);
//         toast.success("Settings saved");
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.detail ?? "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file || !restaurant) return;
//     try {
//       const res = await uploadApi.uploadRestaurantLogo(restaurant.id, file);
//       setRestaurant({ ...restaurant, logo_url: res.data.url });
//       toast.success("Logo updated");
//     } catch {
//       toast.error("Failed to upload logo");
//     }
//   }

//   async function regenerateQR() {
//     if (!restaurant) return;
//     setRegenerating(true);
//     try {
//       const res = await restaurantApi.regenerateQR(restaurant.id);
//       setRestaurant(res.data);
//       toast.success("QR code regenerated");
//     } catch {
//       toast.error("Failed to regenerate QR");
//     } finally {
//       setRegenerating(false);
//     }
//   }

//   function downloadQR() {
//     if (!restaurant?.qr_code_url) return;
//     const a = document.createElement("a");
//     a.href = `${API_URL}${restaurant.qr_code_url}`;
//     a.download = `${restaurant.name}-qr-code.png`;
//     a.click();
//   }

//   if (loading) {
//     return (
//       <div className="flex h-96 items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 max-w-3xl">
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900">Restaurant Settings</h1>
//         <p className="text-sm text-slate-500">
//           Manage your restaurant profile and download your QR code.
//         </p>
//       </div>

//       <div className="grid gap-8 lg:grid-cols-5">
//         {/* Form */}
//         <div className="lg:col-span-3">
//           <div className="card p-6">
//             <div className="mb-5 flex items-center gap-3">
//               <Store className="h-5 w-5 text-brand-600" />
//               <h2 className="font-semibold text-slate-800">
//                 {isNew ? "Create Your Restaurant" : "Restaurant Details"}
//               </h2>
//             </div>

//             <form onSubmit={handleSave} className="space-y-4">
//               {/* Logo */}
//               {restaurant && (
//                 <div className="flex items-center gap-4">
//                   <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
//                     {restaurant.logo_url ? (
//                       <Image
//                         src={`${API_URL}${restaurant.logo_url}`}
//                         alt="Logo"
//                         fill
//                         className="object-cover"
//                       />
//                     ) : (
//                       <Store className="m-auto mt-4 h-8 w-8 text-slate-300" />
//                     )}
//                   </div>
//                   <label className="btn-secondary cursor-pointer text-sm">
//                     <Upload className="h-4 w-4" />
//                     Upload Logo
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleLogoUpload}
//                     />
//                   </label>
//                 </div>
//               )}

//               <div>
//                 <label className="label">Restaurant Name *</label>
//                 <input
//                   type="text"
//                   className="input"
//                   required
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   placeholder="My Restaurant"
//                 />
//               </div>

//               <div>
//                 <label className="label">Description</label>
//                 <textarea
//                   className="input resize-none"
//                   rows={2}
//                   value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   placeholder="A brief description..."
//                 />
//               </div>

//               <div>
//                 <label className="label">Address</label>
//                 <input
//                   type="text"
//                   className="input"
//                   value={form.address}
//                   onChange={(e) => setForm({ ...form, address: e.target.value })}
//                   placeholder="123 Main St, City"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="label">Phone</label>
//                   <input
//                     type="tel"
//                     className="input"
//                     value={form.phone}
//                     onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                     placeholder="+1 555 0100"
//                   />
//                 </div>
//                 <div>
//                   <label className="label">Email</label>
//                   <input
//                     type="email"
//                     className="input"
//                     value={form.email}
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                     placeholder="info@restaurant.com"
//                   />
//                 </div>
//               </div>

//               <button type="submit" disabled={saving} className="btn-primary w-full py-2.5">
//                 {saving ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Save className="h-4 w-4" />
//                 )}
//                 {isNew ? "Create Restaurant" : "Save Changes"}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* QR Code Panel */}
//         <div className="lg:col-span-2">
//           <div className="card p-6 text-center">
//             <div className="mb-4 flex items-center justify-center gap-2">
//               <QrCode className="h-5 w-5 text-brand-600" />
//               <h2 className="font-semibold text-slate-800">Your QR Code</h2>
//             </div>

//             {restaurant?.qr_code_url ? (
//               <>
//                 <div className="mb-4 overflow-hidden rounded-xl border border-slate-100">
//                   <Image
//                     src={`${API_URL}${restaurant.qr_code_url}`}
//                     alt="QR Code"
//                     width={240}
//                     height={240}
//                     className="mx-auto"
//                   />
//                 </div>
//                 <p className="mb-4 text-xs text-slate-500">
//                   Print and place on every table. Points to:
//                   <br />
//                   <a
//                     href={`/menu/${restaurant.id}`}
//                     target="_blank"
//                     className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline"
//                   >
//                     Customer Menu <ExternalLink className="h-3 w-3" />
//                   </a>
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={downloadQR}
//                     className="btn-primary flex-1 text-sm"
//                   >
//                     <Download className="h-4 w-4" />
//                     Download
//                   </button>
//                   <button
//                     onClick={regenerateQR}
//                     disabled={regenerating}
//                     className="btn-secondary text-sm"
//                   >
//                     <RefreshCcw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="py-8 text-slate-400">
//                 <QrCode className="mx-auto mb-3 h-16 w-16 text-slate-200" />
//                 <p className="text-sm">
//                   Save your restaurant details first to generate a QR code.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Save, Loader2, QrCode, Download, RefreshCcw, Upload, Store, ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { restaurantApi, uploadApi } from "@/lib/api";
import { Restaurant } from "@/lib/types";
import { API_URL } from "@/lib/api";

// ✅ Helper: base64 URLs are used as-is, file paths get API_URL prepended
function resolveUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("data:")) return url;        // base64 — use as-is
  if (url.startsWith("http")) return url;          // absolute URL — use as-is
  return `${API_URL}${url}`;                       // relative path — prepend API_URL
}

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", address: "", phone: "", email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await restaurantApi.getMy();
        if (res.data.length > 0) {
          const r: Restaurant = res.data[0];
          setRestaurant(r);
          setForm({
            name: r.name ?? "",
            description: r.description ?? "",
            address: r.address ?? "",
            phone: r.phone ?? "",
            email: r.email ?? "",
          });
        } else {
          setIsNew(true);
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        const res = await restaurantApi.create(form);
        setRestaurant(res.data);
        setIsNew(false);
        toast.success("Restaurant created! Your QR code is ready.");
      } else if (restaurant) {
        const res = await restaurantApi.update(restaurant.id, form);
        setRestaurant(res.data);
        toast.success("Settings saved");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !restaurant) return;
    try {
      const res = await uploadApi.uploadRestaurantLogo(restaurant.id, file);
      setRestaurant({ ...restaurant, logo_url: res.data.url });
      toast.success("Logo updated");
    } catch {
      toast.error("Failed to upload logo");
    }
  }

  async function regenerateQR() {
    if (!restaurant) return;
    setRegenerating(true);
    try {
      const res = await restaurantApi.regenerateQR(restaurant.id);
      setRestaurant(res.data);
      toast.success("QR code regenerated");
    } catch {
      toast.error("Failed to regenerate QR");
    } finally {
      setRegenerating(false);
    }
  }

  function downloadQR() {
    if (!restaurant?.qr_code_url) return;
    const url = resolveUrl(restaurant.qr_code_url);

    // ✅ Handle base64 download properly
    if (restaurant.qr_code_url.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${restaurant.name}-qr-code.png`;
      a.click();
    } else {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `${restaurant.name}-qr-code.png`;
          a.click();
        });
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Restaurant Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your restaurant profile and download your QR code.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <Store className="h-5 w-5 text-brand-600" />
              <h2 className="font-semibold text-slate-800">
                {isNew ? "Create Your Restaurant" : "Restaurant Details"}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Logo */}
              {restaurant && (
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    {restaurant.logo_url ? (
                      // ✅ Use <img> instead of Next <Image> to support base64
                      <img
                        src={resolveUrl(restaurant.logo_url)}
                        alt="Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="m-auto mt-4 h-8 w-8 text-slate-300" />
                    )}
                  </div>
                  <label className="btn-secondary cursor-pointer text-sm">
                    <Upload className="h-4 w-4" />
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
              )}

              <div>
                <label className="label">Restaurant Name *</label>
                <input
                  type="text"
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="My Restaurant"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A brief description..."
                />
              </div>

              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  className="input"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="123 Main St, City"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 555 0100"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="info@restaurant.com"
                  />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-2.5">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isNew ? "Create Restaurant" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* QR Code Panel */}
        <div className="lg:col-span-2">
          <div className="card p-6 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-brand-600" />
              <h2 className="font-semibold text-slate-800">Your QR Code</h2>
            </div>

            {restaurant?.qr_code_url ? (
              <>
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-100">
                  {/* ✅ Use <img> instead of Next <Image> to support base64 */}
                  <img
                    src={resolveUrl(restaurant.qr_code_url)}
                    alt="QR Code"
                    width={240}
                    height={240}
                    className="mx-auto"
                  />
                </div>
                <p className="mb-4 text-xs text-slate-500">
                  Print and place on every table. Points to:
                  <br />
                  
                    href={`/menu/${restaurant.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline"
                  >
                    Customer Menu <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
                <div className="flex gap-2">
                  <button onClick={downloadQR} className="btn-primary flex-1 text-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={regenerateQR}
                    disabled={regenerating}
                    className="btn-secondary text-sm"
                  >
                    <RefreshCcw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-slate-400">
                <QrCode className="mx-auto mb-3 h-16 w-16 text-slate-200" />
                <p className="text-sm">
                  Save your restaurant details first to generate a QR code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
