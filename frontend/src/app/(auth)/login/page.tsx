"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Heart,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Handshake,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import useLogin from "@/src/hooks/useLogin";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const loginMutation = useLogin();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <>
      <Toaster
        position="top-right"
        expand={false}
        richColors={false}
        duration={4000}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: [
              "flex items-start gap-3",
              "w-[340px] px-4 py-3.5",
              "bg-white border border-setu-100",
              "rounded-2xl",
              "shadow-[0_8px_32px_rgba(21,104,57,0.12),0_2px_8px_rgba(0,0,0,0.06)]",
              "font-sans",
              "data-[type=success]:border-l-4 data-[type=success]:border-l-setu-500",
              "data-[type=error]:border-l-4 data-[type=error]:border-l-red-400",
            ].join(" "),
            title: "text-[14px] font-semibold text-setu-950 leading-snug",
            description: "text-[12px] text-gray-500 mt-0.5 leading-relaxed",
            icon: "flex-shrink-0 mt-0.5",
            actionButton:
              "mt-2 px-3 py-1.5 bg-setu-700 text-white text-xs font-bold rounded-full hover:bg-setu-600 transition-colors",
            cancelButton:
              "mt-2 px-3 py-1.5 border border-setu-200 text-setu-700 text-xs font-bold rounded-full hover:bg-setu-50 transition-colors",
          },
        }}
        icons={{
          success: (
            <div className="w-7 h-7 rounded-full bg-setu-50 border border-setu-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-setu-600" />
            </div>
          ),
          error: (
            <div className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
          ),
        }}
      />

      <div className="min-h-screen flex bg-setu-950">
        <div className="hidden lg:block lg:w-[58%] relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1400&q=90&auto=format&fit=crop"
            alt="Helping hands — donate on Setu"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-setu-950 via-setu-950/55 to-setu-950/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-setu-950/25" />

          <div className="absolute top-10 left-10 z-10">
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline flex-shrink-0 group"
            >
              <div
                className={[
                  "relative w-9 h-9 rounded-[10px] flex items-center justify-center",
                  "bg-setu-100 group-hover:bg-setu-200",
                  "shadow-[0_4px_12px_rgba(21,104,57,0.15)]",
                  "transition-all duration-200",
                ].join(" ")}
              >
                <Heart
                  className="w-8 h-8 text-setu-700"
                  strokeWidth={1.6}
                  fill="none"
                />
                <Handshake
                  className="absolute w-5 h-5 text-setu-700"
                  strokeWidth={1.6}
                />
              </div>
              <span
                className="text-[1.5rem] font-bold text-setu-950 leading-none tracking-[-0.3px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Setu
              </span>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
            <p className="text-setu-300 text-sm font-semibold uppercase tracking-[0.15em] mb-4">
              Nepal's Donation Platform
            </p>
            <h2
              className="text-5xl font-bold text-white leading-[1.08] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every rupee you give
              <br />
              <em className="italic text-setu-300">changes a life.</em>
            </h2>
            <p className="text-white/55 text-base leading-relaxed max-w-sm mb-8">
              Join 18,000+ donors building a kinder Nepal — one campaign at a
              time.
            </p>

            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 max-w-sm mb-8">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://i.pravatar.cc/48?img=8"
                  alt="Donor"
                  className="w-10 h-10 rounded-full border-2 border-setu-400 object-cover"
                />
                <div>
                  <p className="text-white text-sm font-semibold">
                    Ramesh Shrestha
                  </p>
                  <p className="text-setu-300 text-xs">Top Donor · Kathmandu</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white/75 text-sm leading-relaxed italic">
                "Setu made it so simple to help flood victims. I could see
                exactly where my money went. This platform is a true bridge."
              </p>
            </div>

            <div className="flex items-center gap-8">
              {[
                { n: "NPR 2.4Cr+", l: "Raised" },
                { n: "1,200+", l: "Campaigns" },
                { n: "18K+", l: "Donors" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {n}
                  </p>
                  <p className="text-xs text-setu-400 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-cream relative overflow-y-auto">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-setu-700 via-setu-400 to-setu-600" />

          <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 max-w-[440px] mx-auto w-full">
            <div className="lg:hidden mb-10 w-full">
              <Link href="/" className="flex items-center gap-2.5 no-underline">
                <div className="w-9 h-9 rounded-xl bg-setu-700 flex items-center justify-center shadow-[0_4px_12px_rgba(26,110,57,0.35)]">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <span
                  className="text-2xl font-bold text-setu-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Setu
                </span>
              </Link>
            </div>

            <div className="w-full mb-9">
              <p className="text-setu-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">
                Welcome back
              </p>
              <h1
                className="text-4xl font-bold text-setu-950 leading-tight mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Sign in to
                <br />
                <em className="italic text-setu-700">your account</em>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div>
                <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                  Email Address
                </label>
                <div
                  className={`relative rounded-xl transition-all duration-200 ${focused === "email" ? "ring-2 ring-setu-500/30" : ""}`}
                >
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "email" ? "text-setu-600" : "text-gray-400"}`}
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-setu-800 uppercase tracking-[0.1em]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-setu-600 hover:text-setu-500 no-underline font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div
                  className={`relative rounded-xl transition-all duration-200 ${focused === "password" ? "ring-2 ring-setu-500/30" : ""}`}
                >
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "password" ? "text-setu-600" : "text-gray-400"}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-setu-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  id="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-setu-300 text-setu-600 focus:ring-setu-500 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-500 cursor-pointer select-none"
                >
                  Keep me signed in for 5 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_8px_24px_rgba(26,110,57,0.35)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none active:translate-y-0"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Setu</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Don't have one?{" "}
                <Link
                  href="/register"
                  className="text-setu-700 font-semibold hover:text-setu-600 transition-colors no-underline"
                >
                  Create free account →
                </Link>
              </p>
            </form>

            <div className="w-full flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-setu-100" />
              <span className="text-xs text-gray-400 font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-setu-100" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-setu-200 hover:border-setu-300 hover:bg-setu-50 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-150 shadow-sm hover:shadow"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-[18px] h-[18px] flex-shrink-0"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="w-full mt-8 flex items-center justify-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-setu-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span className="text-xs text-gray-400">
                256-bit SSL encrypted · Your data is safe
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
