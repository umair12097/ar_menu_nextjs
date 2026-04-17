import Link from "next/link";
import {
  Scan,
  QrCode,
  Smartphone,
  Utensils,
  ChevronRight,
  Star,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-950 to-slate-950 text-white">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/30">
              <Scan className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ARMenu</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] rounded-full bg-purple-600/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700/50 bg-brand-900/40 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-sm font-medium text-brand-300">
              Now supporting Augmented Reality — no app required
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            See Your Food in{" "}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              3D Before
            </span>{" "}
            You Order
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl">
            Give every table an AR-powered menu. Customers scan a QR code,
            browse dishes in augmented reality and order instantly — no app
            download needed.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 hover:scale-105"
            >
              Start For Free
              <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur md:grid-cols-3">
          {[
            { value: "3D AR", label: "Immersive food previews" },
            { value: "+32%", label: "Average order value increase" },
            { value: "4.9★", label: "Customer satisfaction score" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="mb-1 text-4xl font-extrabold text-white">{value}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mt-3 text-slate-400">
            From setup to first order in under 5 minutes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Utensils,
              step: "01",
              title: "Build Your Menu",
              desc: "Log in to the dashboard, add your dishes with photos, prices and optional 3D models. Organise them into categories.",
              color: "from-brand-500 to-brand-700",
            },
            {
              icon: QrCode,
              step: "02",
              title: "Print Your QR Code",
              desc: "A unique QR code is auto-generated for your restaurant. Print it and place it on every table.",
              color: "from-purple-500 to-purple-700",
            },
            {
              icon: Smartphone,
              step: "03",
              title: "Customers Scan & Order",
              desc: "Guests scan the code, browse your full menu in AR, tap a dish to see it on their table, then place the order.",
              color: "from-pink-500 to-pink-700",
            },
          ].map(({ icon: Icon, step, title, desc, color }) => (
            <div
              key={step}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:bg-white/10"
            >
              <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${color} p-3 shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="mb-2 text-xs font-bold tracking-widest text-slate-500">
                STEP {step}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything You Need
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Scan, title: "WebAR — No App Needed", desc: "Works in Safari and Chrome on iOS and Android via WebXR and Scene Viewer." },
            { icon: ShieldCheck, title: "Secure & Reliable", desc: "JWT authentication, encrypted passwords, HTTPS-ready deployment." },
            { icon: TrendingUp, title: "Real-time Order Board", desc: "Watch orders arrive live. Update statuses from pending to delivered in one click." },
            { icon: Star, title: "Customer Ratings", desc: "Guests rate dishes after ordering. Ratings are shown on the menu to build trust." },
            { icon: QrCode, title: "Instant QR Generation", desc: "Every restaurant gets a unique QR code, regeneratable at any time." },
            { icon: Utensils, title: "Multi-category Menus", desc: "Organise your menu into Starters, Mains, Desserts, Drinks — anything you like." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
            >
              <Icon className="mb-4 h-6 w-6 text-brand-400" />
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-purple-600 p-16 text-center shadow-2xl">
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
            Ready to Wow Your Customers?
          </h2>
          <p className="mb-8 text-brand-100">
            Join hundreds of restaurants using ARMenu to boost engagement and orders.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-lg transition hover:bg-brand-50 hover:scale-105"
          >
            Create Your Menu — Free <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ARMenu. All rights reserved.
      </footer>
    </div>
  );
}
