"use client";

import { useState } from "react";
import { MapPicker, MapSelectResult } from "@/src/components/mapPicker";
import {
  Package,
  ArrowRight,
  CheckCircle,
  Shirt,
  Wheat,
  Heart,
  Tent,
  BookOpen,
  Baby,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";

const goodsCategories = [
  {
    id: "food",
    icon: Wheat,
    label: "Food & Grains",
    color: "amber",
    items: ["Rice", "Lentils", "Flour", "Cooking Oil", "Salt", "Sugar"],
  },
  {
    id: "clothing",
    icon: Shirt,
    label: "Clothing",
    color: "blue",
    items: [
      "Men's Clothes",
      "Women's Clothes",
      "Children's Clothes",
      "Blankets",
      "Jackets",
      "Footwear",
    ],
  },
  {
    id: "medical",
    icon: Heart,
    label: "Medical Supplies",
    color: "red",
    items: [
      "First Aid Kits",
      "Medicines",
      "Bandages",
      "Sanitizers",
      "Masks",
      "ORS Packets",
    ],
  },
  {
    id: "shelter",
    icon: Tent,
    label: "Shelter & Bedding",
    color: "green",
    items: [
      "Tents",
      "Tarpaulins",
      "Sleeping Bags",
      "Mats",
      "Pillows",
      "Mosquito Nets",
    ],
  },
  {
    id: "education",
    icon: BookOpen,
    label: "Education",
    color: "purple",
    items: [
      "Notebooks",
      "Pens & Pencils",
      "School Bags",
      "Textbooks",
      "Crayons",
      "Geometry Boxes",
    ],
  },
  {
    id: "baby",
    icon: Baby,
    label: "Baby & Child",
    color: "pink",
    items: [
      "Diapers",
      "Baby Food",
      "Baby Clothes",
      "Milk Powder",
      "Toys",
      "Baby Soap",
    ],
  },
];

const colorMap: Record<
  string,
  { bg: string; light: string; text: string; border: string; icon: string }
> = {
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: "text-amber-600",
  },
  blue: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: "text-blue-600",
  },
  red: {
    bg: "bg-red-500",
    light: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: "text-red-600",
  },
  green: {
    bg: "bg-setu-600",
    light: "bg-setu-50",
    text: "text-setu-700",
    border: "border-setu-200",
    icon: "text-setu-600",
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: "text-purple-600",
  },
  pink: {
    bg: "bg-pink-500",
    light: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    icon: "text-pink-600",
  },
};

export default function GoodsDonationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("food");
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(
    {},
  );
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [pickupNote, setPickupNote] = useState("");
  const [location, setLocation] = useState<MapSelectResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activeCategory = goodsCategories.find(
    (c) => c.id === selectedCategory,
  )!;
  const colors = colorMap[activeCategory.color];

  const updateItem = (item: string, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[item] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [item]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item]: next };
    });
  };

  const totalItems = Object.values(selectedItems).reduce((a, b) => a + b, 0);
  const selectedKeys = Object.keys(selectedItems);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#f5f7f4] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-setu-100 p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-setu-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-setu-600" />
          </div>
          <h2
            className="text-[26px] font-bold text-setu-950 mb-3 tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Donation Submitted!
          </h2>
          <p className="text-[14px] text-setu-600/80 leading-[1.75] mb-6">
            Thank you, <strong>{donorName}</strong>. Our team will contact you
            within 24 hours to arrange goods pickup from your location.
          </p>
          <div className="bg-setu-50 rounded-2xl p-4 mb-8 text-left">
            <p className="text-[12px] font-bold uppercase tracking-widest text-setu-600 mb-3">
              Donation Summary
            </p>
            {selectedKeys.map((item) => (
              <div
                key={item}
                className="flex justify-between text-[13px] text-setu-800 py-1 border-b border-setu-100 last:border-0"
              >
                <span>{item}</span>
                <span className="font-bold">×{selectedItems[item]}</span>
              </div>
            ))}
            {location && (
              <p className="text-[12px] text-setu-600/70 mt-3">
                📍 {location.name}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedItems({});
              setDonorName("");
              setDonorPhone("");
              setDonorEmail("");
              setPickupNote("");
              setLocation(null);
            }}
            className="w-full py-3 bg-setu-700 hover:bg-setu-600 text-white font-bold text-[14px] rounded-xl transition-colors cursor-pointer border-none"
          >
            Donate More Goods
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7f4] min-h-screen text-setu-950">
      <section className="bg-setu-900 pt-14 pb-12 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(42,165,88,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-setu-400 animate-pulse flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
              Beyond money — donate essentials
            </span>
          </div>
          <h1
            className="text-[clamp(30px,5vw,50px)] font-bold text-white leading-[1.08] tracking-[-1.5px] mb-4 "
            style={{ fontFamily: "var(--font-display)" }}
          >
            Donate <em className="italic text-setu-400">Goods</em> to Those in
            Need
          </h1>
          <p className="text-[15px] text-white/55 leading-[1.75] max-w-md mx-auto">
            Send rice, clothes, medicine, and relief supplies directly to
            communities across Nepal. We handle the logistics.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-5 mb-10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Truck, label: "Free pickup from your door" },
            { icon: ShieldCheck, label: "Verified delivery" },
            { icon: Clock, label: "48hr dispatch guarantee" },
            { icon: Users, label: "4,800+ goods donated" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="bg-white border border-setu-100 rounded-2xl py-4 px-4 flex items-center gap-3 shadow-sm"
            >
              <div className="w-9 h-9 bg-setu-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-setu-700" />
              </div>
              <p className="text-[12px] font-semibold text-setu-800 leading-snug">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 1 — Choose a category
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {goodsCategories.map((cat) => {
                    const c = colorMap[cat.color];
                    const active = selectedCategory === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={[
                          "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer",
                          active
                            ? `${c.light} ${c.border} shadow-sm`
                            : "bg-gray-50 border-transparent hover:bg-setu-50 hover:border-setu-200",
                        ].join(" ")}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? c.bg : "bg-white border border-gray-200"}`}
                        >
                          <Icon
                            className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`}
                          />
                        </div>
                        <span
                          className={`text-[10px] font-bold text-center leading-tight ${active ? c.text : "text-gray-500"}`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-1">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 2 — Select items &amp; quantities
                </div>
                <p className="text-[12px] text-setu-600/60 mb-5">
                  Choose what you'd like to donate from{" "}
                  {activeCategory.label.toLowerCase()}.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCategory.items.map((item) => {
                    const qty = selectedItems[item] ?? 0;
                    return (
                      <div
                        key={item}
                        className={[
                          "flex items-center justify-between p-4 rounded-2xl border transition-all duration-150",
                          qty > 0
                            ? `${colors.light} ${colors.border}`
                            : "bg-gray-50 border-gray-200",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${qty > 0 ? colors.bg : "bg-white border border-gray-200"}`}
                          >
                            <Package
                              className={`w-4 h-4 ${qty > 0 ? "text-white" : "text-gray-400"}`}
                            />
                          </div>
                          <span
                            className={`text-[13px] font-semibold ${qty > 0 ? colors.text : "text-gray-600"}`}
                          >
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateItem(item, -1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer transition-all ${qty > 0 ? `${colors.bg} border-transparent text-white hover:opacity-80` : "bg-white border-gray-200 text-gray-400"}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            className={`w-6 text-center text-[13px] font-bold ${qty > 0 ? colors.text : "text-gray-400"}`}
                          >
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItem(item, 1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer transition-all ${colors.bg} border-transparent text-white hover:opacity-80`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 3 — Pickup location
                </div>
                <MapPicker
                  onSelect={(data) => setLocation(data)}
                  selectedLat={location?.lat}
                  selectedLng={location?.lng}
                />
                {location && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-setu-50 border border-setu-200 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-setu-600 flex-shrink-0" />
                    <p className="text-[13px] font-semibold text-setu-700">
                      {location.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-setu-100 p-6 sticky top-24">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Your details
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Ramesh Shrestha"
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">
                      Pickup Note
                    </label>
                    <textarea
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      placeholder="Best time to pick up, building details, etc."
                      rows={3}
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-setu-100 pt-4 mb-5">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-setu-600 mb-3">
                    Donation Summary
                  </p>
                  {selectedKeys.length === 0 ? (
                    <p className="text-[13px] text-gray-400 italic">
                      No items selected yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedKeys.map((item) => (
                        <div
                          key={item}
                          className="flex justify-between items-center text-[13px]"
                        >
                          <span className="text-setu-700">{item}</span>
                          <span className="font-bold text-setu-900 bg-setu-50 px-2 py-0.5 rounded-lg">
                            ×{selectedItems[item]}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t border-setu-100 text-[13px] font-bold text-setu-900">
                        <span>Total items</span>
                        <span className="bg-setu-700 text-white px-2.5 py-0.5 rounded-lg">
                          {totalItems}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    totalItems === 0 || !donorName || !donorPhone || !location
                  }
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-setu-700 hover:bg-setu-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[14px] font-bold rounded-xl transition-colors cursor-pointer border-none"
                >
                  Submit Donation Request
                  <ArrowRight className="w-4 h-4" />
                </button>

                {(totalItems === 0 ||
                  !donorName ||
                  !donorPhone ||
                  !location) && (
                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    {totalItems === 0
                      ? "Select at least one item"
                      : !location
                        ? "Pin your pickup location"
                        : "Fill in required fields"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
