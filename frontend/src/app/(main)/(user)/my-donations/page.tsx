"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Calendar,
  ArrowRight,
  Trophy,
  TrendingUp,
  Package,
  Download,
  ExternalLink,
} from "lucide-react";

type DonationType = "money" | "goods";

const donations = [
  {
    id: "d1",
    type: "money" as DonationType,
    campaign: "Koshi Flood Relief 2024",
    campaignId: "1",
    location: "Eastern Nepal",
    amount: 5000,
    date: "Nov 12, 2024",
    status: "completed",
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&q=70&auto=format&fit=crop",
  },
  {
    id: "d2",
    type: "goods" as DonationType,
    campaign: "Janakpur Food Bank Initiative",
    campaignId: "4",
    location: "Janakpur",
    items: "Rice 10kg, Blankets ×2",
    date: "Oct 28, 2024",
    status: "delivered",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&q=70&auto=format&fit=crop",
  },
  {
    id: "d3",
    type: "money" as DonationType,
    campaign: "Help Sunita Beat Cancer",
    campaignId: "2",
    location: "Kathmandu",
    amount: 10000,
    date: "Oct 5, 2024",
    status: "completed",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&q=70&auto=format&fit=crop",
  },
  {
    id: "d4",
    type: "money" as DonationType,
    campaign: "School for Dolakha Children",
    campaignId: "3",
    location: "Dolakha",
    amount: 7500,
    date: "Sep 14, 2024",
    status: "completed",
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=200&q=70&auto=format&fit=crop",
  },
  {
    id: "d5",
    type: "goods" as DonationType,
    campaign: "Kathmandu Animal Rescue Shelter",
    campaignId: "6",
    location: "Kathmandu",
    items: "Dog food 5kg, Medicine kit",
    date: "Aug 20, 2024",
    status: "in-transit",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&q=70&auto=format&fit=crop",
  },
];

const statusMap: Record<string, { label: string; color: string; dot: string }> =
  {
    completed: {
      label: "Completed",
      color: "text-setu-700 bg-setu-50 border-setu-200",
      dot: "bg-setu-500",
    },
    delivered: {
      label: "Delivered",
      color: "text-blue-700 bg-blue-50 border-blue-200",
      dot: "bg-blue-500",
    },
    "in-transit": {
      label: "In Transit",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      dot: "bg-amber-500",
    },
  };

const tabs = [
  { key: "all", label: "All" },
  { key: "money", label: "Money" },
  { key: "goods", label: "Goods" },
];

export default function MyDonationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? donations
      : donations.filter((d) => d.type === activeTab);
  const totalMoney = donations
    .filter((d) => d.type === "money")
    .reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div
      className="min-h-screen bg-cream py-12 px-4"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-2">
            <div className="w-5 h-[2px] bg-setu-500 rounded" />
            Account
          </div>
          <h1
            className="text-[clamp(28px,4vw,38px)] font-bold text-setu-950 tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Donations
          </h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Heart,
              label: "Total Donated",
              value: `NPR ${totalMoney.toLocaleString()}`,
              color: "text-red-500",
              bg: "bg-red-50",
            },
            {
              icon: TrendingUp,
              label: "Money Donations",
              value: donations.filter((d) => d.type === "money").length,
              color: "text-setu-600",
              bg: "bg-setu-50",
            },
            {
              icon: Package,
              label: "Goods Donated",
              value: donations.filter((d) => d.type === "goods").length,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              icon: Trophy,
              label: "Campaigns Helped",
              value: new Set(donations.map((d) => d.campaignId)).size,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-setu-100 p-5 shadow-[0_2px_8px_rgba(21,104,57,0.05)]"
            >
              <div
                className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p
                className="text-[20px] font-bold text-setu-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={[
                "px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 cursor-pointer",
                activeTab === key
                  ? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
                  : "bg-white text-setu-700 border-setu-200 hover:border-setu-400 hover:bg-setu-50",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Donation list */}
        <div className="flex flex-col gap-4">
          {filtered.map((d) => {
            const S = statusMap[d.status];
            return (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] overflow-hidden hover:shadow-[0_6px_24px_rgba(21,104,57,0.1)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-28 flex-shrink-0 hidden sm:block">
                    <img
                      src={d.img}
                      alt={d.campaign}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {/* Type badge */}
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${d.type === "money" ? "bg-setu-100 text-setu-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {d.type === "money" ? (
                              <Heart className="w-3 h-3" />
                            ) : (
                              <Package className="w-3 h-3" />
                            )}
                            {d.type === "money" ? "Money" : "Goods"}
                          </span>
                          {/* Status badge */}
                          <span
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${S.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${S.dot}`}
                            />
                            {S.label}
                          </span>
                        </div>
                        <h3 className="text-[15px] font-bold text-setu-950 leading-snug">
                          {d.campaign}
                        </h3>
                      </div>
                      {/* Amount or items */}
                      <div className="text-right flex-shrink-0">
                        {d.type === "money" ? (
                          <p
                            className="text-[16px] font-bold text-setu-700"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            NPR {d.amount?.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-[12px] font-semibold text-amber-700 max-w-[120px] text-right">
                            {d.items}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-[12px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {d.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {d.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.type === "money" && (
                          <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-setu-600 transition-colors cursor-pointer border-none bg-transparent">
                            <Download className="w-3.5 h-3.5" /> Receipt
                          </button>
                        )}
                        <Link
                          href={`/campaigns/${d.campaignId}`}
                          className="flex items-center gap-1 text-[11px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-setu-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p
              className="text-white font-bold text-[17px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Keep making a difference
            </p>
            <p className="text-setu-300 text-sm mt-1">
              Browse verified campaigns and donate today.
            </p>
          </div>
          <Link
            href="/campaigns"
            className="flex items-center gap-2 px-7 py-3.5 bg-setu-500 hover:bg-setu-400 text-white text-sm font-bold rounded-full no-underline transition-all duration-200 flex-shrink-0"
          >
            Browse Campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
