"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Package, ArrowRight, CheckCircle, Shirt, Wheat, Heart,
  Tent, BookOpen, Baby, Plus, Minus, Truck, ShieldCheck,
  Clock, Users, Loader2, MapPin, ChevronDown,
} from "lucide-react";
import { MapPicker } from "@/src/components/mapPicker";
import {
  useCreateGoodsDonation,
  type GoodsCategory,
  type GoodsUnit,
  type GoodsCondition,
  type DeliveryMethod,
} from "@/src/hooks/useGoodsDonation";
import { useGetAllCampaigns } from "@/src/hooks/useCampaign";

// ── Category config ───────────────────────────────────────────
const goodsCategories = [
  { id: "food", icon: Wheat, label: "Food & Grains", color: "amber", items: ["Rice", "Lentils", "Flour", "Cooking Oil", "Salt", "Sugar"] },
  { id: "clothing", icon: Shirt, label: "Clothing", color: "blue", items: ["Men's Clothes", "Women's Clothes", "Children's Clothes", "Blankets", "Jackets", "Footwear"] },
  { id: "medical", icon: Heart, label: "Medical Supplies", color: "red", items: ["First Aid Kits", "Medicines", "Bandages", "Sanitizers", "Masks", "ORS Packets"] },
  { id: "shelter", icon: Tent, label: "Shelter & Bedding", color: "green", items: ["Tents", "Tarpaulins", "Sleeping Bags", "Mats", "Pillows", "Mosquito Nets"] },
  { id: "education", icon: BookOpen, label: "Education", color: "purple", items: ["Notebooks", "Pens & Pencils", "School Bags", "Textbooks", "Crayons", "Geometry Boxes"] },
  { id: "baby", icon: Baby, label: "Baby & Child", color: "pink", items: ["Diapers", "Baby Food", "Baby Clothes", "Milk Powder", "Toys", "Baby Soap"] },
];

// Map UI category id → backend enum
const categoryToBackend: Record<string, GoodsCategory> = {
  food: "food", clothing: "clothing", medical: "medical",
  shelter: "shelter", education: "education", baby: "other",
};

// Default unit per category
const defaultUnit: Record<string, GoodsUnit> = {
  food: "kg", clothing: "pieces", medical: "pieces",
  shelter: "pieces", education: "pieces", baby: "pieces",
};

// Estimated value per item (NPR) — rough defaults for form
const defaultValue: Record<string, number> = {
  "Rice": 180, "Lentils": 250, "Flour": 120, "Cooking Oil": 300, "Salt": 50, "Sugar": 150,
  "Men's Clothes": 500, "Women's Clothes": 500, "Children's Clothes": 350,
  "Blankets": 800, "Jackets": 1200, "Footwear": 600,
  "First Aid Kits": 1500, "Medicines": 500, "Bandages": 200,
  "Sanitizers": 150, "Masks": 100, "ORS Packets": 50,
  "Tents": 8000, "Tarpaulins": 1200, "Sleeping Bags": 2000,
  "Mats": 500, "Pillows": 400, "Mosquito Nets": 600,
  "Notebooks": 100, "Pens & Pencils": 50, "School Bags": 800,
  "Textbooks": 300, "Crayons": 120, "Geometry Boxes": 150,
  "Diapers": 800, "Baby Food": 600, "Baby Clothes": 400,
  "Milk Powder": 1200, "Toys": 300, "Baby Soap": 150,
};

const colorMap: Record<string, { bg: string; light: string; text: string; border: string }> = {
  amber: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  blue: { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  red: { bg: "bg-red-500", light: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  green: { bg: "bg-setu-600", light: "bg-setu-50", text: "text-setu-700", border: "border-setu-200" },
  purple: { bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  pink: { bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
};

// ── Status badge helper ───────────────────────────────────────
const goodsStatusMap: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: "Pending Review", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  verified: { label: "Verified", color: "text-setu-700 bg-setu-50 border-setu-200", dot: "bg-setu-500" },
  scheduled: { label: "Scheduled", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  collected: { label: "Collected", color: "text-purple-700 bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  delivered: { label: "Delivered", color: "text-indigo-700 bg-indigo-50 border-indigo-200", dot: "bg-indigo-500" },
  completed: { label: "Completed", color: "text-setu-700 bg-setu-50 border-setu-200", dot: "bg-setu-600" },
  cancelled: { label: "Cancelled", color: "text-gray-600 bg-gray-50 border-gray-200", dot: "bg-gray-400" },
  rejected: { label: "Rejected", color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
};

// ─────────────────────────────────────────────────────────────
function GoodsDonationPageInner() {
  const searchParams = useSearchParams();
  const prefilledCampaignId = searchParams.get("campaign") ?? "";

  const { mutate: createGoodsDonation, isPending: submitting } = useCreateGoodsDonation();
  const { data: campaignsData, isLoading: campaignsLoading } = useGetAllCampaigns({ status: "active", limit: 50 });

  const [selectedCategory, setSelectedCategory] = useState("food");
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [campaignId, setCampaignId] = useState(prefilledCampaignId);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [pickupTime, setPickupTime] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorNotes, setDonorNotes] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; items: Record<string, number>; location?: string } | null>(null);

  const activeCategory = goodsCategories.find(c => c.id === selectedCategory)!;
  const colors = colorMap[activeCategory.color];

  // Prefill campaign from URL
  useEffect(() => {
    if (prefilledCampaignId) setCampaignId(prefilledCampaignId);
  }, [prefilledCampaignId]);

  const updateItem = (item: string, delta: number) => {
    setSelectedItems(prev => {
      const current = prev[item] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) { const { [item]: _, ...rest } = prev; return rest; }
      return { ...prev, [item]: next };
    });
  };

  const totalItems = Object.values(selectedItems).reduce((a, b) => a + b, 0);
  const selectedKeys = Object.keys(selectedItems);

  const totalEstimatedValue = selectedKeys.reduce((sum, name) => {
    return sum + (defaultValue[name] ?? 200) * selectedItems[name];
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalLocation = location;
    if (deliveryMethod !== "pickup") {
      finalLocation = { lat: 27.7172, lng: 85.3240, name: "Setu Foundation Hub, Kathmandu, Nepal" };
    }
    if (!finalLocation) { return; }

    // Build items array for backend
    const items = selectedKeys.map(name => ({
      name,
      category: categoryToBackend[selectedCategory] as GoodsCategory,
      quantity: selectedItems[name],
      unit: defaultUnit[selectedCategory] as GoodsUnit,
      estimatedValue: (defaultValue[name] ?? 200) * selectedItems[name],
      condition: "good" as GoodsCondition,
    }));

    createGoodsDonation(
      {
        campaignId,
        items,
        pickupLocation: {
          name: finalLocation.name,
          address: finalLocation.name,
          city: finalLocation.name.split(",")[1]?.trim() ?? finalLocation.name,
          country: "Nepal",
          coordinates: [finalLocation.lng, finalLocation.lat],
        },
        deliveryMethod,
        contactInfo: {
          phone: donorPhone,
          email: donorEmail || undefined,
          preferredContactMethod: "phone",
        },
        preferredPickupTime: pickupTime || undefined,
        donorNotes: donorNotes || undefined,
      },
      {
        onSuccess: () => {
          setSubmittedData({ name: donorName, items: { ...selectedItems }, location: finalLocation?.name });
          setSubmitted(true);
        },
      },
    );
  };

  // ── Success screen ────────────────────────────────────────
  if (submitted && submittedData) {
    return (
      <div className="bg-[#f5f7f4] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-setu-100 p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-setu-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-setu-600" />
          </div>
          <h2 className="text-[26px] font-bold text-setu-950 mb-3 tracking-[-0.5px]" style={{ fontFamily: "var(--font-display)" }}>
            Donation Submitted!
          </h2>
          <p className="text-[14px] text-setu-600/80 leading-[1.75] mb-6">
            Thank you, <strong>{submittedData.name}</strong>. Our team will contact you within 24 hours to arrange goods pickup from your location.
          </p>
          <div className="bg-setu-50 rounded-2xl p-4 mb-8 text-left">
            <p className="text-[12px] font-bold uppercase tracking-widest text-setu-600 mb-3">Donation Summary</p>
            {Object.keys(submittedData.items).map(item => (
              <div key={item} className="flex justify-between text-[13px] text-setu-800 py-1 border-b border-setu-100 last:border-0">
                <span>{item}</span>
                <span className="font-bold">×{submittedData.items[item]}</span>
              </div>
            ))}
            {submittedData.location && (
              <p className="text-[12px] text-setu-600/70 mt-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {submittedData.location}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setSubmitted(false); setSelectedItems({}); setDonorName(""); setDonorPhone(""); setDonorEmail(""); setDonorNotes(""); setLocation(null); setPickupTime(""); }}
              className="w-full py-3 bg-setu-700 hover:bg-setu-600 text-white font-bold text-[14px] rounded-xl transition-colors cursor-pointer border-none">
              Donate More Goods
            </button>
            <Link href="/my-donations"
              className="w-full py-3 border border-setu-200 text-setu-700 font-semibold text-[14px] rounded-xl hover:bg-setu-50 transition-colors no-underline text-center">
              View My Donations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7f4] min-h-screen text-setu-950">
      {/* Hero */}
      <section className="bg-setu-900 pt-14 pb-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(42,165,88,0.18) 0%, transparent 70%)" }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-setu-400 animate-pulse flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">Beyond money — donate essentials</span>
          </div>
          <h1 className="text-[clamp(30px,5vw,50px)] font-bold text-white leading-[1.08] tracking-[-1.5px] mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Donate <em className="italic text-setu-400">Goods</em> to Those in Need
          </h1>
          <p className="text-[15px] text-white/55 leading-[1.75] max-w-md mx-auto">
            Send rice, clothes, medicine, and relief supplies directly to communities across Nepal. We handle the logistics.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-4 -mt-5 mb-10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Truck, label: "Free pickup from your door" },
            { icon: ShieldCheck, label: "Verified delivery" },
            { icon: Clock, label: "48hr dispatch guarantee" },
            { icon: Users, label: "4,800+ goods donated" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white border border-setu-100 rounded-2xl py-4 px-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 bg-setu-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-setu-700" />
              </div>
              <p className="text-[12px] font-semibold text-setu-800 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Step 0 — Select campaign */}
              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 1 — Choose a campaign
                </div>
                {prefilledCampaignId ? (
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-setu-50 border border-setu-200 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-setu-600 flex-shrink-0" />
                    <p className="text-[13px] font-semibold text-setu-700">Campaign pre-selected from the campaign page.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[12px] text-setu-600/60 mb-3">Select which active campaign you'd like to donate goods to.</p>
                    <div className="relative">
                      <select
                        required
                        value={campaignId}
                        onChange={e => setCampaignId(e.target.value)}
                        className="w-full px-4 py-3.5 text-[13px] bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none focus:border-setu-400 focus:bg-white transition-colors cursor-pointer text-setu-900">
                        <option value="">— Select a campaign —</option>
                        {campaignsLoading ? (
                          <option disabled>Loading campaigns…</option>
                        ) : (
                          (campaignsData?.campaigns ?? []).map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                          ))
                        )}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </>
                )}
              </div>

              {/* Step 1 — Category */}
              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 2 — Choose a category
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {goodsCategories.map(cat => {
                    const c = colorMap[cat.color];
                    const active = selectedCategory === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button key={cat.id} type="button" onClick={() => { setSelectedCategory(cat.id); setSelectedItems({}); }}
                        className={["flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer", active ? `${c.light} ${c.border} shadow-sm` : "bg-gray-50 border-transparent hover:bg-setu-50 hover:border-setu-200"].join(" ")}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? c.bg : "bg-white border border-gray-200"}`}>
                          <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <span className={`text-[10px] font-bold text-center leading-tight ${active ? c.text : "text-gray-500"}`}>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 — Items */}
              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-1">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 3 — Select items &amp; quantities
                </div>
                <p className="text-[12px] text-setu-600/60 mb-5">Choose what you'd like to donate from {activeCategory.label.toLowerCase()}.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCategory.items.map(item => {
                    const qty = selectedItems[item] ?? 0;
                    return (
                      <div key={item} className={["flex items-center justify-between p-4 rounded-2xl border transition-all duration-150", qty > 0 ? `${colors.light} ${colors.border}` : "bg-gray-50 border-gray-200"].join(" ")}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${qty > 0 ? colors.bg : "bg-white border border-gray-200"}`}>
                            <Package className={`w-4 h-4 ${qty > 0 ? "text-white" : "text-gray-400"}`} />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[13px] font-semibold block ${qty > 0 ? colors.text : "text-gray-600"}`}>{item}</span>
                            {defaultValue[item] && <span className="text-[11px] text-gray-400">~NPR {defaultValue[item]}/unit</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button type="button" onClick={() => updateItem(item, -1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer transition-all ${qty > 0 ? `${colors.bg} border-transparent text-white hover:opacity-80` : "bg-white border-gray-200 text-gray-400"}`}>
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className={`w-6 text-center text-[13px] font-bold ${qty > 0 ? colors.text : "text-gray-400"}`}>{qty}</span>
                          <button type="button" onClick={() => updateItem(item, 1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer transition-all ${colors.bg} border-transparent text-white hover:opacity-80`}>
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 — Delivery method */}
              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 4 — Delivery method
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { key: "pickup", label: "Pickup", desc: "We come to you" },
                    { key: "drop-off", label: "Drop-off", desc: "You bring it to us" },
                    { key: "courier", label: "Courier", desc: "Send via courier" },
                  ] as { key: DeliveryMethod; label: string; desc: string }[]).map(m => (
                    <button key={m.key} type="button" onClick={() => setDeliveryMethod(m.key)}
                      className={["flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all cursor-pointer", deliveryMethod === m.key ? "bg-setu-50 border-setu-400" : "bg-gray-50 border-gray-200 hover:border-setu-200"].join(" ")}>
                      <Truck className={`w-5 h-5 ${deliveryMethod === m.key ? "text-setu-600" : "text-gray-400"}`} />
                      <span className={`text-[13px] font-bold ${deliveryMethod === m.key ? "text-setu-700" : "text-gray-600"}`}>{m.label}</span>
                      <span className="text-[11px] text-gray-400 text-center">{m.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Preferred pickup time */}
                <div className="mt-4">
                  <label className="block text-[12px] font-bold text-setu-800 mb-1.5">
                    Preferred pickup time <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input type="datetime-local" value={pickupTime} onChange={e => setPickupTime(e.target.value)}
                    className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors" />
                </div>
              </div>

              {/* Step 4 — Delivery details */}
              <div className="bg-white rounded-3xl border border-setu-100 p-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Step 5 — {deliveryMethod === "pickup" ? "Pickup location" : "Delivery instructions"}
                </div>
                {deliveryMethod === "pickup" ? (
                  <>
                    <MapPicker onSelect={data => setLocation(data)} selectedLat={location?.lat} selectedLng={location?.lng} />
                    {location ? (
                      <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-setu-50 border border-setu-200 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-setu-600 flex-shrink-0" />
                        <p className="text-[13px] font-semibold text-setu-700">{location.name}</p>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] text-gray-400">Click the map or use "Locate me" to pin where we should pick up the goods.</p>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-setu-50 border border-setu-100 rounded-xl">
                    <p className="text-[13px] font-bold text-setu-900 mb-1">Send your items to:</p>
                    <p className="text-[13px] text-setu-700 mb-2 font-mono">
                      Setu Foundation Hub<br/>
                      123 Relief Street, Kathmandu, Nepal<br/>
                      Contact: 9800000000
                    </p>
                    <p className="text-[11px] text-setu-600/70">
                      Our team will contact you once the goods are received to verify your donation.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-setu-100 p-6 sticky top-24">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-4">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  Your details
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input type="text" required value={donorName} onChange={e => setDonorName(e.target.value)}
                      placeholder="Ramesh Shrestha"
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                    <input type="tel" required value={donorPhone} onChange={e => setDonorPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors" />
                    {donorPhone && !/^(98|97)\d{8}$/.test(donorPhone) && (
                      <p className="text-[11px] text-red-500 mt-1.5 font-medium">Please enter a valid 10-digit number starting with 98 or 97.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">Email</label>
                    <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-setu-800 mb-1.5">Pickup Note</label>
                    <textarea value={donorNotes} onChange={e => setDonorNotes(e.target.value)}
                      placeholder="Best time to pick up, building details, etc."
                      rows={3}
                      className="w-full px-4 py-3 text-[13px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-setu-400 focus:bg-white transition-colors resize-none" />
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t border-setu-100 pt-4 mb-5">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-setu-600 mb-3">Donation Summary</p>
                  {selectedKeys.length === 0 ? (
                    <p className="text-[13px] text-gray-400 italic">No items selected yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedKeys.map(item => (
                        <div key={item} className="flex justify-between items-center text-[13px]">
                          <span className="text-setu-700">{item}</span>
                          <span className="font-bold text-setu-900 bg-setu-50 px-2 py-0.5 rounded-lg">×{selectedItems[item]}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t border-setu-100 text-[13px] font-bold text-setu-900">
                        <span>Total items</span>
                        <span className="bg-setu-700 text-white px-2.5 py-0.5 rounded-lg">{totalItems}</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px] text-gray-500">
                        <span>Est. value</span>
                        <span>NPR {totalEstimatedValue.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit"
                  disabled={submitting || totalItems === 0 || !donorName || !/^(98|97)\d{8}$/.test(donorPhone) || (!location && deliveryMethod === "pickup") || !campaignId}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-setu-700 hover:bg-setu-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[14px] font-bold rounded-xl transition-colors cursor-pointer border-none">
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting…</span></>
                  ) : (
                    <><span>Submit Donation Request</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                {(totalItems === 0 || !donorName || !/^(98|97)\d{8}$/.test(donorPhone) || (!location && deliveryMethod === "pickup") || !campaignId) && !submitting && (
                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    {!campaignId ? "Select a campaign first" :
                      totalItems === 0 ? "Select at least one item" :
                        (!location && deliveryMethod === "pickup") ? "Pin your pickup location on the map" :
                          (!/^(98|97)\d{8}$/.test(donorPhone)) ? "Enter a valid phone number" :
                          "Fill in required fields"}
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

export default function GoodsDonationPage() {
  return (
    <Suspense>
      <GoodsDonationPageInner />
    </Suspense>
  );
}
