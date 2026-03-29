"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Package,
  Zap,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Wheat,
  Shirt,
  Pill,
  Tent,
  CheckCircle,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  Gift,
} from "lucide-react";

const urgentCampaigns = [
  {
    id: "1",
    title: "Koshi Flood Relief 2024",
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80&auto=format&fit=crop",
    raised: 362000,
    goal: 500000,
    daysLeft: 8,
    location: "Eastern Nepal",
  },
  {
    id: "7",
    title: "Jajarkot Earthquake Homes",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80&auto=format&fit=crop",
    raised: 290000,
    goal: 600000,
    daysLeft: 5,
    location: "Jajarkot",
  },
  {
    id: "2",
    title: "Help Sunita Beat Cancer",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80&auto=format&fit=crop",
    raised: 145000,
    goal: 275000,
    daysLeft: 14,
    location: "Kathmandu",
  },
];

const goodsItems = [
  {
    icon: Wheat,
    label: "Rice & Food",
    desc: "50kg rice bags, lentils, cooking oil",
  },
  { icon: Shirt, label: "Clothing", desc: "Warm clothes, blankets, footwear" },
  { icon: Pill, label: "Medicine", desc: "First aid kits, basic medications" },
  { icon: Tent, label: "Shelter", desc: "Tarpaulins, tents, sleeping bags" },
];

const paymentMethods = [
  { icon: CreditCard, label: "Card", sub: "Visa, Mastercard" },
  { icon: Smartphone, label: "eSewa / Khalti", sub: "Digital wallets" },
  { icon: Building2, label: "Bank Transfer", sub: "Direct transfer" },
];

const presetAmounts = [500, 1000, 2500, 5000, 10000];

export default function DonatePage() {
  const [donationType, setDonationType] = useState<"money" | "goods">("money");
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedGoods, setSelectedGoods] = useState<string[]>([]);
  const [recurring, setRecurring] = useState(false);

  const toggleGoods = (label: string) => {
    setSelectedGoods((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  };

  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── HERO ── */}
      <section className="bg-white border-b border-setu-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
            Make a Difference
          </div>
          <h1
            className="text-[clamp(34px,4vw,54px)] font-bold text-setu-950 leading-tight tracking-[-1px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every Rupee
            <br />
            <em className="italic text-setu-600">Changes a Life.</em>
          </h1>
          <p className="text-[16px] text-setu-800/55 leading-[1.75] max-w-lg">
            Choose to donate money or goods. Every contribution reaches verified
            campaigns with full transparency.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
            {/* ── LEFT: Donation form ── */}
            <div>
              {/* Type toggle */}
              <div className="flex gap-3 mb-8">
                {[
                  {
                    key: "money",
                    icon: Heart,
                    label: "Donate Money",
                    sub: "Instant, secure transfer",
                  },
                  {
                    key: "goods",
                    icon: Package,
                    label: "Donate Goods",
                    sub: "Physical relief items",
                  },
                ].map(({ key, icon: Icon, label, sub }) => (
                  <button
                    key={key}
                    onClick={() => setDonationType(key as "money" | "goods")}
                    className={[
                      "flex-1 flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer",
                      donationType === key
                        ? "border-setu-600 bg-setu-50 shadow-[0_0_0_4px_rgba(21,104,57,0.08)]"
                        : "border-setu-100 bg-white hover:border-setu-300",
                    ].join(" ")}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${donationType === key ? "bg-setu-700" : "bg-setu-100"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${donationType === key ? "text-white" : "text-setu-600"}`}
                      />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-setu-900">
                        {label}
                      </p>
                      <p className="text-[12px] text-setu-600/60">{sub}</p>
                    </div>
                    {donationType === key && (
                      <CheckCircle className="w-5 h-5 text-setu-600 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {donationType === "money" ? (
                <div className="bg-white rounded-2xl border border-setu-100 p-7 shadow-[0_2px_12px_rgba(21,104,57,0.06)]">
                  <h2
                    className="text-[20px] font-bold text-setu-950 mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Choose Amount
                  </h2>

                  {/* Preset amounts */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount("");
                        }}
                        className={[
                          "py-3 rounded-xl text-[14px] font-bold border-2 transition-all",
                          selectedAmount === amt && !customAmount
                            ? "border-setu-600 bg-setu-700 text-white shadow-[0_4px_14px_rgba(21,104,57,0.3)]"
                            : "border-setu-100 bg-setu-50 text-setu-700 hover:border-setu-400",
                        ].join(" ")}
                      >
                        NPR {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-setu-600">
                      NPR
                    </span>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      className="w-full pl-16 pr-4 py-3.5 border-2 border-setu-100 focus:border-setu-500 rounded-xl text-[15px] font-semibold text-setu-900 placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/20 transition-all"
                    />
                  </div>

                  {/* Recurring toggle */}
                  <div className="flex items-center justify-between p-4 bg-setu-50 rounded-xl border border-setu-100 mb-6">
                    <div>
                      <p className="text-[14px] font-bold text-setu-900">
                        Make it monthly
                      </p>
                      <p className="text-[12px] text-setu-600/60 mt-0.5">
                        Sustain causes with recurring support
                      </p>
                    </div>
                    <button
                      onClick={() => setRecurring((v) => !v)}
                      className={[
                        "relative w-12 h-6 rounded-full transition-colors duration-200",
                        recurring ? "bg-setu-600" : "bg-setu-200",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200",
                          recurring ? "left-6" : "left-0.5",
                        ].join(" ")}
                      />
                    </button>
                  </div>

                  {/* Payment methods */}
                  <p className="text-[13px] font-semibold text-setu-700 mb-3">
                    Pay with
                  </p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {paymentMethods.map(({ icon: Icon, label, sub }) => (
                      <button
                        key={label}
                        className="flex flex-col items-center gap-1.5 p-3.5 bg-setu-50 border border-setu-100 hover:border-setu-400 rounded-xl transition-all cursor-pointer"
                      >
                        <Icon className="w-5 h-5 text-setu-600" />
                        <span className="text-[12px] font-bold text-setu-800">
                          {label}
                        </span>
                        <span className="text-[10px] text-setu-600/50">
                          {sub}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button className="w-full py-4 bg-setu-700 hover:bg-setu-600 text-white text-[15px] font-bold rounded-full transition-all shadow-[0_8px_24px_rgba(21,104,57,0.35)] hover:shadow-[0_12px_32px_rgba(21,104,57,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 fill-white" />
                    Donate NPR {customAmount || selectedAmount.toLocaleString()}
                    {recurring && "/mo"}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-[12px] text-setu-600/50">
                    <ShieldCheck className="w-4 h-4" />
                    256-bit SSL encrypted · Your data is never stored
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-setu-100 p-7 shadow-[0_2px_12px_rgba(21,104,57,0.06)]">
                  <h2
                    className="text-[20px] font-bold text-setu-950 mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Select Goods to Donate
                  </h2>
                  <p className="text-[14px] text-setu-600/60 mb-6">
                    We'll coordinate pickup or drop-off of your donations.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {goodsItems.map(({ icon: Icon, label, desc }) => (
                      <button
                        key={label}
                        onClick={() => toggleGoods(label)}
                        className={[
                          "p-5 rounded-2xl border-2 text-left transition-all cursor-pointer",
                          selectedGoods.includes(label)
                            ? "border-setu-600 bg-setu-50 shadow-[0_0_0_4px_rgba(21,104,57,0.08)]"
                            : "border-setu-100 bg-white hover:border-setu-300",
                        ].join(" ")}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selectedGoods.includes(label) ? "bg-setu-700" : "bg-setu-100"}`}
                        >
                          <Icon
                            className={`w-5 h-5 ${selectedGoods.includes(label) ? "text-white" : "text-setu-600"}`}
                          />
                        </div>
                        <p className="text-[14px] font-bold text-setu-900">
                          {label}
                        </p>
                        <p className="text-[12px] text-setu-600/60 mt-1">
                          {desc}
                        </p>
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/donations/goods"
                    className="w-full py-4 bg-setu-700 hover:bg-setu-600 text-white text-[15px] font-bold rounded-full transition-all shadow-[0_8px_24px_rgba(21,104,57,0.35)] hover:-translate-y-0.5 flex items-center justify-center gap-2 no-underline"
                  >
                    <Package className="w-5 h-5" />
                    Schedule Goods Donation <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* ── RIGHT: Urgent campaigns ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <h3
                  className="text-[16px] font-bold text-setu-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Urgent Campaigns
                </h3>
              </div>

              {urgentCampaigns.map((c) => {
                const pct = Math.min(
                  Math.round((c.raised / c.goal) * 100),
                  100,
                );
                return (
                  <Link
                    key={c.id}
                    href={`/campaigns/${c.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_12px_32px_rgba(21,104,57,0.12)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={c.img}
                        alt={c.title}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Urgent
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-orange-600 font-semibold">
                            <Clock className="w-3 h-3" />
                            {c.daysLeft}d left
                          </span>
                        </div>
                        <h4 className="text-[13px] font-bold text-setu-950 leading-snug mb-2 line-clamp-2 group-hover:text-setu-700 transition-colors">
                          {c.title}
                        </h4>
                        <div className="h-1 bg-setu-100 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-setu-700 font-bold">
                            NPR {c.raised.toLocaleString()}
                          </span>
                          <span className="text-setu-600 font-bold">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Impact summary */}
              <div className="bg-setu-950 rounded-2xl p-6 mt-6">
                <p className="text-[12px] font-bold uppercase tracking-wide text-setu-400 mb-4">
                  Your Impact
                </p>
                {[
                  { icon: Users, label: "Families helped", n: "500+" },
                  { icon: TrendingUp, label: "NPR raised today", n: "2.4Cr+" },
                  { icon: Gift, label: "Goods delivered", n: "4,800+" },
                ].map(({ icon: Icon, label, n }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0"
                  >
                    <div className="flex items-center gap-2.5 text-[13px] text-white/60 font-medium">
                      <Icon className="w-4 h-4 text-setu-400" />
                      {label}
                    </div>
                    <strong className="text-[14px] text-white font-bold">
                      {n}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
