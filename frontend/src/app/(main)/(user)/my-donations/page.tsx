"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart, MapPin, Calendar, ArrowRight, Trophy,
  TrendingUp, Download, ExternalLink, AlertTriangle,
  Package, Truck, CheckCircle, Clock,
} from "lucide-react";
import { useGetMyPayments } from "@/src/hooks/usePayment";
import { useGetMyGoodsDonations } from "@/src/hooks/useGoodsDonation";

const fmtNPR = (n: number) =>
  n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });

const paymentStatusMap: Record<string, { label: string; color: string; dot: string }> = {
  completed: { label: "Completed", color: "text-setu-700 bg-setu-50 border-setu-200", dot: "bg-setu-500" },
  initiated: { label: "Initiated", color: "text-gray-600 bg-gray-50 border-gray-200", dot: "bg-gray-400" },
  pending: { label: "Pending", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  failed: { label: "Failed", color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-400" },
  refunded: { label: "Refunded", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-400" },
};

const goodsStatusMap: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: "Pending Review", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  verified: { label: "Verified", color: "text-setu-700 bg-setu-50 border-setu-200", dot: "bg-setu-500" },
  scheduled: { label: "Pickup Scheduled", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  collected: { label: "Collected", color: "text-purple-700 bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  delivered: { label: "Delivered", color: "text-indigo-700 bg-indigo-50 border-indigo-200", dot: "bg-indigo-500" },
  completed: { label: "Completed", color: "text-setu-700 bg-setu-50 border-setu-200", dot: "bg-setu-600" },
  cancelled: { label: "Cancelled", color: "text-gray-600 bg-gray-50 border-gray-200", dot: "bg-gray-400" },
  rejected: { label: "Rejected", color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
};

const GOODS_STEPS = ["pending", "verified", "scheduled", "collected", "delivered", "completed"];
const GOODS_LABELS = ["Review", "Verified", "Scheduled", "Collected", "Delivered", "Done"];

type TabKey = "all" | "money" | "goods";

const LIMIT = 10;

export default function MyDonationsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [moneyPage, setMoneyPage] = useState(1);
  const [goodsPage, setGoodsPage] = useState(1);

  const { data: moneyData, isLoading: moneyLoading, isError: moneyError } =
    useGetMyPayments({ page: moneyPage, limit: LIMIT });

    console.log("Money Donations Data:", moneyData); // Debug log for money donations

  const { data: goodsData, isLoading: goodsLoading, isError: goodsError } =
    useGetMyGoodsDonations({ page: goodsPage, limit: LIMIT });

  const payments = moneyData?.payments ?? [];
  const goodsDonations = goodsData?.donations ?? [];

  const moneyTotal = moneyData?.pagination?.total ?? 0;
  const moneyPages = moneyData?.pagination?.totalPages ?? 1;
  const goodsTotal = goodsData?.pagination?.total ?? 0;
  const goodsPages = goodsData?.pagination?.totalPages ?? 1;

  const completedPayments = payments.filter(p => p.status === "completed");
  const totalMoneyDonated = completedPayments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const totalGoodsItems = goodsDonations.reduce((s, g) => s + (g.totalItems ?? 0), 0);
  const uniqueCampaigns = new Set([
    ...payments.map(p => p.campaign?._id || p.team?._id),
    ...goodsDonations.map(g => g.campaign?._id),
  ].filter(Boolean)).size;

  const isLoading = moneyLoading || goodsLoading;
  const isError = moneyError || goodsError;

  return (
    <div className="min-h-screen bg-cream py-12 max-w-7xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
      <div className="">

        <div className="mb-8">
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-2">
            <div className="w-5 h-[2px] bg-setu-500 rounded" />
            Account
          </div>
          <h1 className="text-[clamp(28px,4vw,38px)] font-bold text-setu-950 tracking-[-0.5px]" style={{ fontFamily: "var(--font-display)" }}>
            My Donations
          </h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Heart, label: "Money Donated", value: isLoading ? "—" : fmtNPR(totalMoneyDonated), color: "text-red-500", bg: "bg-red-50" },
            { icon: Package, label: "Goods Items", value: isLoading ? "—" : totalGoodsItems, color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Trophy, label: "Causes Helped", value: isLoading ? "—" : uniqueCampaigns, color: "text-blue-600", bg: "bg-blue-50" },
            { icon: TrendingUp, label: "Total Donations", value: isLoading ? "—" : moneyTotal + goodsTotal, color: "text-setu-600", bg: "bg-setu-50" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-setu-100 p-5 shadow-[0_2px_8px_rgba(21,104,57,0.05)]">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-[20px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "all", label: "All Donations" },
            { key: "money", label: `Money (${moneyTotal})` },
            { key: "goods", label: `Goods (${goodsTotal})` },
          ] as { key: TabKey; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={["px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 cursor-pointer",
                tab === t.key
                  ? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
                  : "bg-white text-setu-700 border-setu-200 hover:border-setu-400 hover:bg-setu-50",
              ].join(" ")}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-14 h-14">
              <div className="w-14 h-14 rounded-full border-4 border-setu-100 border-t-setu-500 animate-spin absolute" />
              <Heart className="absolute inset-0 m-auto w-5 h-5 text-setu-500" />
            </div>
            <p className="text-[14px] text-setu-600/60 font-medium">Loading your donations…</p>
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-[15px] font-bold text-setu-950">Failed to load donations</p>
            <p className="text-[13px] text-gray-400">Please try refreshing the page.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* ──── MONEY DONATIONS ──── */}
            {(tab === "all" || tab === "money") && (
              <div className="mb-10">
                {tab === "all" && payments.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <h2 className="text-[16px] font-bold text-setu-950">Money Donations</h2>
                    <span className="text-[12px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{moneyTotal}</span>
                  </div>
                )}

                {payments.length === 0 && tab === "money" && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-2xl border border-setu-100">
                    <Heart className="w-8 h-8 text-setu-200" />
                    <p className="text-[14px] font-bold text-setu-800">No money donations yet</p>
                    <Link href="/campaigns" className="text-[13px] text-setu-600 font-semibold no-underline hover:underline">Browse campaigns →</Link>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {payments.map(payment => {
                    const S = paymentStatusMap[payment.status] ?? paymentStatusMap.pending;
                    const campaign = payment.campaign;
                    const team = payment.team;
                    const imageUrl = campaign?.images?.url || team?.avatar?.url;
                    const title = campaign?.title || team?.name || "Donation";
                    const isTeam = !!team;
                    return (
                      <div key={payment._id}
                        className="bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] overflow-hidden hover:shadow-[0_6px_24px_rgba(21,104,57,0.1)] hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex">
                          <div className="w-1.5 bg-red-400 flex-shrink-0" />
                          {imageUrl && (
                            <div className="w-24 flex-shrink-0 hidden sm:block">
                              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-200">
                                    <Heart className="w-2.5 h-2.5" /> Money
                                  </span>
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-setu-100 text-setu-700">
                                    {payment.gateway === "esewa" ? "eSewa" 

                                    ///added new lines for khalti and manual payment gateway display
                                     : payment.gateway === "khalti"
    ? "Khalti"
    : payment.gateway === "manual"
    ? "Manual": payment.gateway}

                                  </span>
                                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${S.color}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${S.dot}`} />
                                    {S.label}
                                  </span>
                                  {payment.anonymous && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">Anonymous</span>
                                  )}
                                </div>
                                <h3 className="text-[15px] font-bold text-setu-950 leading-snug">{title}</h3>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-[16px] font-bold text-setu-700" style={{ fontFamily: "var(--font-display)" }}>
                                  {fmtNPR(payment.amount)}
                                </p>
                                {payment.tipAmount > 0 && (
                                  <p className="text-[11px] text-gray-400">+{fmtNPR(payment.tipAmount)} tip</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-4 text-[12px] text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {payment.paidAt ? fmtDate(payment.paidAt) : fmtDate(payment.createdAt)}
                                </span>
                                {payment.esewaRefId && (
                                  <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">Ref: {payment.esewaRefId}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {payment.status === "completed" && (
                                  <button
                                    onClick={() => {
                                      const content = ["SETU DONATION RECEIPT", "====================",
                                        isTeam ? `Team: ${title}` : `Campaign: ${title}`,
                                        `Amount: NPR ${payment.amount.toLocaleString()}`,
                                        `Tip: NPR ${payment.tipAmount ?? 0}`,
                                        `Total: NPR ${payment.totalAmount.toLocaleString()}`,
                                        `Payment via: ${payment.gateway}`,
                                        ...(payment.esewaRefId ? [`eSewa Ref: ${payment.esewaRefId}`] : []),
                                        `Transaction ID: ${payment.transactionUuid}`,
                                        `Date: ${payment.paidAt ? fmtDate(payment.paidAt) : fmtDate(payment.createdAt)}`,
                                        "Status: Completed",
                                      ].join("\n");
                                      const blob = new Blob([content], { type: "text/plain" });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = `setu-receipt-${payment.transactionUuid?.slice(0, 8)}.txt`;
                                      a.click();
                                      URL.revokeObjectURL(url);
                                    }}
                                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-setu-600 transition-colors cursor-pointer border-none bg-transparent">
                                    <Download className="w-3.5 h-3.5" /> Receipt
                                  </button>
                                )}
                                {(campaign?._id || team?._id) && (
                                  <Link href={isTeam ? `/teams/${team?._id}` : `/campaigns/${campaign?._id}`}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors">
                                    View <ExternalLink className="w-3 h-3" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {moneyPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <button onClick={() => setMoneyPage(p => Math.max(1, p - 1))} disabled={moneyPage === 1}
                      className="px-4 py-2.5 bg-white border border-setu-200 text-setu-700 text-[13px] font-semibold rounded-xl hover:border-setu-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                      ← Previous
                    </button>
                    <span className="text-[13px] text-gray-500 font-medium">Page {moneyPage} of {moneyPages}</span>
                    <button onClick={() => setMoneyPage(p => Math.min(moneyPages, p + 1))} disabled={moneyPage === moneyPages}
                      className="px-4 py-2.5 bg-white border border-setu-200 text-setu-700 text-[13px] font-semibold rounded-xl hover:border-setu-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ──── GOODS DONATIONS ──── */}
            {(tab === "all" || tab === "goods") && (
              <div className="mb-10">
                {tab === "all" && goodsDonations.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Package className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-[16px] font-bold text-setu-950">Goods Donations</h2>
                    <span className="text-[12px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{goodsTotal}</span>
                  </div>
                )}

                {goodsDonations.length === 0 && tab === "goods" && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-2xl border border-setu-100">
                    <Package className="w-8 h-8 text-amber-200" />
                    <p className="text-[14px] font-bold text-setu-800">No goods donations yet</p>
                    <Link href="/donations/goods" className="text-[13px] text-setu-600 font-semibold no-underline hover:underline">Donate goods →</Link>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {goodsDonations.map(donation => {
                    const S = goodsStatusMap[donation.status] ?? goodsStatusMap.pending;
                    const campaign = donation.campaign;
                    const currentStepIdx = GOODS_STEPS.indexOf(donation.status);
                    const isActive = !["rejected", "cancelled"].includes(donation.status);
                    return (
                      <div key={donation._id}
                        className="bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] overflow-hidden hover:shadow-[0_6px_24px_rgba(21,104,57,0.1)] hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex">
                          <div className="w-1.5 bg-amber-400 flex-shrink-0" />
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
                                    <Package className="w-2.5 h-2.5" /> Goods
                                  </span>
                                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${S.color}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${S.dot}`} />
                                    {S.label}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 capitalize">
                                    {donation.deliveryMethod}
                                  </span>
                                </div>
                                <h3 className="text-[15px] font-bold text-setu-950 leading-snug">{campaign?.title ?? "Campaign"}</h3>
                                <p className="text-[12px] text-gray-500 mt-1">
                                  {donation.items.slice(0, 3).map(item => `${item.name} ×${item.quantity}`).join(" · ")}
                                  {donation.items.length > 3 && ` · +${donation.items.length - 3} more`}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-[15px] font-bold text-amber-700">{donation.totalItems} items</p>
                                <p className="text-[11px] text-gray-400">Est. {fmtNPR(donation.totalEstimatedValue)}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-4 text-[12px] text-gray-500 flex-wrap">
                                {donation.pickupLocation?.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> {donation.pickupLocation.city}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" /> {fmtDate(donation.createdAt)}
                                </span>
                                {donation.scheduledPickupDate && (
                                  <span className="flex items-center gap-1 text-blue-600 font-semibold">
                                    <Truck className="w-3.5 h-3.5" /> Pickup: {fmtDate(donation.scheduledPickupDate)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {donation.status === "rejected" && donation.rejectionReason && (
                                  <span className="text-[11px] text-red-500 font-semibold max-w-[130px] truncate" title={donation.rejectionReason}>
                                    {donation.rejectionReason}
                                  </span>
                                )}
                                {campaign?._id && (
                                  <Link href={`/campaigns/${campaign._id}`}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors">
                                    View <ExternalLink className="w-3 h-3" />
                                  </Link>
                                )}
                              </div>
                            </div>

                            {/* Progress tracker */}
                            {isActive && (
                              <div className="mt-4 pt-3 border-t border-gray-50">
                                <div className="flex items-start gap-0">
                                  {GOODS_STEPS.map((s, i, arr) => {
                                    const isDone = i <= currentStepIdx;
                                    const isNow = i === currentStepIdx;
                                    return (
                                      <div key={s} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${isDone ? (isNow ? "bg-setu-600 ring-2 ring-setu-200" : "bg-setu-500") : "bg-gray-200"}`}>
                                            {isDone && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                          </div>
                                          <span className={`text-[9px] font-semibold whitespace-nowrap ${isNow ? "text-setu-700" : isDone ? "text-setu-500" : "text-gray-300"}`}>
                                            {GOODS_LABELS[i]}
                                          </span>
                                        </div>
                                        {i < arr.length - 1 && (
                                          <div className={`h-0.5 flex-1 mx-1 mb-3.5 ${i < currentStepIdx ? "bg-setu-400" : "bg-gray-200"}`} />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {goodsPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <button onClick={() => setGoodsPage(p => Math.max(1, p - 1))} disabled={goodsPage === 1}
                      className="px-4 py-2.5 bg-white border border-setu-200 text-setu-700 text-[13px] font-semibold rounded-xl hover:border-setu-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                      ← Previous
                    </button>
                    <span className="text-[13px] text-gray-500 font-medium">Page {goodsPage} of {goodsPages}</span>
                    <button onClick={() => setGoodsPage(p => Math.min(goodsPages, p + 1))} disabled={goodsPage === goodsPages}
                      className="px-4 py-2.5 bg-white border border-setu-200 text-setu-700 text-[13px] font-semibold rounded-xl hover:border-setu-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Empty — all tab, nothing */}
            {tab === "all" && payments.length === 0 && goodsDonations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl border border-setu-100">
                <div className="w-16 h-16 bg-setu-50 border-2 border-setu-100 rounded-full flex items-center justify-center">
                  <Heart className="w-7 h-7 text-setu-300" />
                </div>
                <p className="text-[16px] font-bold text-setu-900">No donations yet</p>
                <p className="text-[14px] text-gray-400">Start making a difference today.</p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <Link href="/campaigns"
                    className="flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-full text-sm no-underline transition-all">
                    Donate Money <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/donations/goods"
                    className="flex items-center gap-2 px-6 py-3 border border-setu-200 text-setu-700 font-bold rounded-full text-sm no-underline hover:bg-setu-50 transition-all">
                    Donate Goods <Package className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-10 bg-setu-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-[17px]" style={{ fontFamily: "var(--font-display)" }}>Keep making a difference</p>
            <p className="text-setu-300 text-sm mt-1">Browse campaigns or donate goods today.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/campaigns"
              className="flex items-center gap-2 px-6 py-3.5 bg-setu-500 hover:bg-setu-400 text-white text-sm font-bold rounded-full no-underline transition-all flex-shrink-0">
              Donate Money <Heart className="w-4 h-4" />
            </Link>
            <Link href="/donations/goods"
              className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-full no-underline transition-all flex-shrink-0">
              Donate Goods <Package className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}