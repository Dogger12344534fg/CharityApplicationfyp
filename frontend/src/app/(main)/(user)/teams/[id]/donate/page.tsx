"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
    ArrowLeft, Shield, Heart, Check, Lock,
    Sparkles, Loader2, Smartphone, QrCode,
} from "lucide-react";
import { useGetTeamById, useInitiateTeamEsewaPayment } from "@/src/hooks/useTeam";
import type { InitiateTeamDonationResponse } from "@/src/hooks/useTeam";

// ── eSewa form submitter ──────────────────────────────────────
// Builds a hidden HTML form and submits to eSewa URL
function submitEsewaForm(url: string, payload: InitiateTeamDonationResponse["esewaPayload"]) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
}

const QUICK_AMOUNTS = [
    { value: 500, label: "NPR 500" },
    { value: 1000, label: "NPR 1,000" },
    { value: 2000, label: "NPR 2,000", suggested: true },
    { value: 5000, label: "NPR 5,000" },
    { value: 10000, label: "NPR 10,000" },
    { value: 25000, label: "NPR 25,000" },
];

const FIXED_TIP_PCT = 5;

type PayMethod = "esewa" | "khalti";
const PAY_METHODS = [
    { key: "esewa" as const, label: "eSewa", desc: "Pay with your eSewa wallet", color: "#60C153", logo: "E" },
];

const fmtNPR = (n: number) =>
    n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

const ESEWA_QR_DATA = "https://esewa.com.np";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ESEWA_QR_DATA)}&bgcolor=ffffff&color=1a1a1a&margin=8&format=png`;

export default function TeamDonatePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string;   // ← this is the teamId

    const { data } = useGetTeamById(id);
    const team = data?.data;
    const { mutate: initiatePayment, isPending: initiating } = useInitiateTeamEsewaPayment();

    // Pre-fill amount passed via ?amount= query param from the team detail page
    const QUICK_VALUES = QUICK_AMOUNTS.map((q) => q.value);
    const { initSel, initCustom } = useMemo(() => {
        const raw = searchParams?.get("amount");
        if (!raw) return { initSel: 2000 as number | null, initCustom: "" };
        const parsed = parseInt(raw, 10);
        if (isNaN(parsed) || parsed <= 0) return { initSel: 2000 as number | null, initCustom: "" };
        if (QUICK_VALUES.includes(parsed)) return { initSel: parsed, initCustom: "" };
        return { initSel: null, initCustom: String(parsed) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [selectedAmt, setSelectedAmt] = useState<number | null>(initSel);
    const [customAmt, setCustomAmt] = useState(initCustom);
    const [payMethod, setPayMethod] = useState<PayMethod>("esewa");
    const [anonymous, setAnonymous] = useState(false);
    const [marketing, setMarketing] = useState(false);
    const [step, setStep] = useState<"amount" | "payment" | "confirm">("amount");

    const donationAmt = selectedAmt ?? (customAmt ? parseInt(customAmt) : 0);
    const tipAmt = Math.round((donationAmt * FIXED_TIP_PCT) / 100);
    const totalAmt = donationAmt;

    const pct = team ? Math.min(Math.round((team.raisedAmount / team.goalAmount) * 100), 100) : 0;
    const remaining = team ? Math.max(0, team.goalAmount - team.raisedAmount) : 0;

    const handleProceed = () => {
        if (step === "amount" && donationAmt >= 10 && donationAmt <= 30000) setStep("payment");
        else if (step === "payment") setStep("confirm");
    };

    const handleDonate = () => {
        if (payMethod !== "esewa") {
            alert("Khalti integration coming soon!");
            return;
        }

        // Send teamId to backend — backend resolves which campaign to use internally
        initiatePayment(
            {
                teamId: id,
                amount: donationAmt - tipAmt,
                tipAmount: tipAmt,
                anonymous,
            },
            {
                onSuccess: (data) => {
                    submitEsewaForm(data.esewaUrl, data.esewaPayload);
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-[#f5f5f0]" style={{ fontFamily: "var(--font-body)" }}>

            {/* Breadcrumb */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[13px]">
                    <Link href={`/teams/${id}`} className="flex items-center gap-1.5 text-setu-600 font-semibold no-underline hover:text-setu-500 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Team
                    </Link>
                    {team && (
                        <>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-500 truncate max-w-[260px]">{team.name}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

                    {/* ── LEFT ── */}
                    <div className="space-y-5">

                        {/* Team strip */}
                        {team && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-setu-100">
                                    {team.avatar?.url ? (
                                        <img src={team.avatar.url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-setu-800 to-setu-950" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-setu-500 mb-0.5">You're donating to</p>
                                    <p className="text-[15px] font-bold text-setu-950 leading-snug line-clamp-2">{team.name}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1">
                                            <div className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-[11px] font-bold text-setu-600 flex-shrink-0">{pct}% funded</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step indicator */}
                        <div className="flex items-center gap-2">
                            {(["amount", "payment", "confirm"] as const).map((s, i) => {
                                const labels = ["Amount", "Payment", "Confirm"];
                                const isDone = ["amount", "payment", "confirm"].indexOf(step) > i;
                                const isActive = step === s;
                                return (
                                    <div key={s} className="flex items-center gap-2 flex-1">
                                        <div className={["w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-all",
                                            isDone ? "bg-setu-600 text-white" :
                                                isActive ? "bg-setu-700 text-white shadow-[0_2px_8px_rgba(21,104,57,0.3)]" :
                                                    "bg-white border-2 border-gray-200 text-gray-400"].join(" ")}>
                                            {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
                                        </div>
                                        <span className={`text-[12px] font-semibold transition-colors ${isActive ? "text-setu-800" : isDone ? "text-setu-600" : "text-gray-400"}`}>
                                            {labels[i]}
                                        </span>
                                        {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Step 1: Amount ── */}
                        {step === "amount" && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-50">
                                    <h2 className="text-[19px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>Enter your donation</h2>
                                    {remaining > 0 && (
                                        <p className="text-[13px] text-gray-500 mt-1">
                                            <span className="font-bold text-setu-700">{fmtNPR(remaining)}</span> still to go — help build momentum
                                        </p>
                                    )}
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {QUICK_AMOUNTS.map(({ value, label, suggested }) => (
                                            <button key={value}
                                                onClick={() => { setSelectedAmt(value); setCustomAmt(""); }}
                                                className={["relative py-3.5 px-2 rounded-xl border-2 text-[13px] font-bold transition-all cursor-pointer",
                                                    selectedAmt === value
                                                        ? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_10px_rgba(21,104,57,0.3)]"
                                                        : "bg-white text-setu-700 border-gray-200 hover:border-setu-300 hover:bg-setu-50"].join(" ")}>
                                                {label}
                                                {suggested && (
                                                    <span className={`absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-black rounded-full border whitespace-nowrap flex items-center gap-1 ${selectedAmt === value ? "bg-setu-400 text-white border-setu-400" : "bg-setu-50 text-setu-600 border-setu-200"}`}>
                                                        <Sparkles className="w-2.5 h-2.5" /> suggested
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">Or enter custom amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400 pointer-events-none">NPR</span>
                                            <input type="number" placeholder="e.g. 3000" value={customAmt} min={10} max={30000}
                                                onChange={(e) => { setCustomAmt(e.target.value); setSelectedAmt(null); }}
                                                className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-[15px] font-bold text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300 placeholder:font-normal"
                                            />
                                        </div>
                                        {donationAmt > 0 && donationAmt < 10 && (
                                            <p className="text-[11px] text-red-500 font-semibold mt-1.5">Minimum donation is NPR 10</p>
                                        )}
                                        {donationAmt > 30000 && (
                                            <p className="text-[11px] text-red-500 font-semibold mt-1.5">Maximum donation amount is NPR 30,000</p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                                        <div className="flex items-start gap-2">
                                            <Heart className="w-4 h-4 text-setu-500 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[13px] font-bold text-setu-800">Tip Setu's services ({FIXED_TIP_PCT}%)</p>
                                                    {donationAmt >= 10 && <span className="text-[13px] font-black text-setu-700">{fmtNPR(tipAmt)}</span>}
                                                </div>
                                                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                                                    Setu has a 0% platform fee for organizers. A small {FIXED_TIP_PCT}% tip from donors keeps Setu running.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleProceed} disabled={donationAmt < 10 || donationAmt > 30000}
                                        className="w-full py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white font-bold rounded-xl text-[15px] transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none cursor-pointer border-none">
                                        Continue →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Step 2: Payment ── */}
                        {step === "payment" && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-50">
                                    <h2 className="text-[19px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>Choose payment method</h2>
                                    <p className="text-[13px] text-gray-400 mt-0.5">All transactions are secure and encrypted</p>
                                </div>
                                <div className="p-6 space-y-3">
                                    {PAY_METHODS.map(({ key, label, desc, color, logo }) => (
                                        <button key={key} onClick={() => setPayMethod(key)}
                                            className={["w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                                                payMethod === key
                                                    ? "border-setu-400 bg-setu-50 shadow-[0_2px_10px_rgba(21,104,57,0.12)]"
                                                    : "border-gray-200 bg-white hover:border-setu-200 hover:bg-gray-50"].join(" ")}>
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[16px] font-black shadow-sm" style={{ backgroundColor: color }}>{logo}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-bold text-setu-950">{label}</p>
                                                <p className="text-[12px] text-gray-400">{desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${payMethod === key ? "border-setu-600 bg-setu-600" : "border-gray-300"}`}>
                                                {payMethod === key && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </button>
                                    ))}

                                    {payMethod === "esewa" && (
                                        <div className="border border-green-100 bg-green-50 rounded-xl p-4 flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[13px] font-black" style={{ backgroundColor: "#60C153" }}>E</div>
                                            <div>
                                                <p className="text-[13px] font-bold text-green-800">Pay with eSewa</p>
                                                <p className="text-[12px] text-green-700 mt-0.5 leading-relaxed">You'll be redirected to eSewa to complete the payment securely.</p>
                                                <p className="text-[11px] text-green-600 mt-1.5 font-semibold">Test — Phone: <strong>9806800001</strong> · MPIN: <strong>1122</strong> · OTP: <strong>112233</strong></p>
                                            </div>
                                        </div>
                                    )}

                                    {payMethod === "khalti" && (
                                        <div className="border border-purple-100 bg-purple-50 rounded-xl p-4 flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[13px] font-black" style={{ backgroundColor: "#5C2D91" }}>K</div>
                                            <div>
                                                <p className="text-[13px] font-bold text-purple-800">Pay with Khalti</p>
                                                <p className="text-[12px] text-purple-700 mt-0.5">Khalti integration coming soon. Please use eSewa for now.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setStep("amount")}
                                            className="flex-1 py-3.5 bg-white border-2 border-gray-200 text-gray-600 text-[14px] font-semibold rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
                                            ← Back
                                        </button>
                                        <button onClick={handleProceed}
                                            className="flex-[2] py-3.5 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-[14px] transition-all shadow-[0_4px_12px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 cursor-pointer border-none">
                                            Review Donation →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Step 3: Confirm ── */}
                        {step === "confirm" && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-50">
                                    <h2 className="text-[19px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>Review & confirm</h2>
                                    <p className="text-[13px] text-gray-400 mt-0.5">Double-check your donation before proceeding</p>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="bg-setu-50 rounded-xl border border-setu-100 divide-y divide-setu-100">
                                        {[
                                            { label: "Donation to team", value: fmtNPR(donationAmt), bold: false },
                                            { label: `Setu tip (${FIXED_TIP_PCT}%)`, value: fmtNPR(tipAmt), bold: false },
                                            { label: "Total due today", value: fmtNPR(totalAmt), bold: true },
                                        ].map(({ label, value, bold }) => (
                                            <div key={label} className="flex justify-between px-4 py-3.5">
                                                <span className={`text-[13px] ${bold ? "font-bold text-setu-950" : "text-gray-500 font-medium"}`}>{label}</span>
                                                <span className={bold ? "text-[16px] font-black text-setu-900" : "text-[13px] font-semibold text-setu-800"}>{value}</span>
                                            </div>
                                        ))}
                                    </div>


                                    <div className="space-y-2">
                                        {anonymous && <div className="flex items-center gap-2 text-[12px] text-gray-500"><Check className="w-3.5 h-3.5 text-setu-500" /> Your name will be hidden</div>}
                                        {marketing && <div className="flex items-center gap-2 text-[12px] text-gray-500"><Check className="w-3.5 h-3.5 text-setu-500" /> You'll receive team updates</div>}
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[12px] font-bold text-blue-800 mb-0.5">Setu Giving Guarantee</p>
                                            <p className="text-[11px] text-blue-600 leading-relaxed">We guarantee a full refund for up to 30 days in the rare case that fraud occurs.</p>
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-gray-400 leading-relaxed">
                                        By clicking Donate, you agree to Setu's{" "}
                                        <Link href="/terms" className="text-setu-600 font-semibold hover:underline">Terms of Service</Link> and{" "}
                                        <Link href="/privacy" className="text-setu-600 font-semibold hover:underline">Privacy Policy</Link>.
                                    </p>

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep("payment")}
                                            className="flex-1 py-3.5 bg-white border-2 border-gray-200 text-gray-600 text-[14px] font-semibold rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
                                            ← Back
                                        </button>
                                        <button onClick={handleDonate} disabled={initiating}
                                            className="flex-[2] py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-400 text-white font-bold rounded-xl text-[15px] transition-all shadow-[0_4px_14px_rgba(21,104,57,0.35)] hover:-translate-y-0.5 disabled:cursor-not-allowed cursor-pointer border-none flex items-center justify-center gap-2">
                                            {initiating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Redirecting to {PAY_METHODS.find(p => p.key === payMethod)?.label}…
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4" />
                                                    Donate {fmtNPR(totalAmt)} via {PAY_METHODS.find(p => p.key === payMethod)?.label}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT sidebar ── */}
                    <div className="hidden lg:block">
                        <div className="sticky top-6 space-y-4">

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.07)] overflow-hidden">
                                <div className="px-5 py-4 bg-setu-950 text-white">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1">Your donation</p>
                                    <p className="text-[32px] font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>
                                        {donationAmt >= 10 ? fmtNPR(donationAmt) : "NPR —"}
                                    </p>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {[
                                        { label: "Donation", value: donationAmt >= 10 ? fmtNPR(donationAmt) : "—" },
                                        { label: `Setu tip (${FIXED_TIP_PCT}%)`, value: donationAmt >= 10 ? fmtNPR(tipAmt) : "—" },
                                        { label: "Total due", value: donationAmt >= 10 ? fmtNPR(totalAmt) : "—", bold: true },
                                    ].map(({ label, value, bold }) => (
                                        <div key={label} className="flex justify-between px-5 py-3.5">
                                            <span className={`text-[13px] ${bold ? "font-bold text-setu-950" : "font-medium text-gray-400"}`}>{label}</span>
                                            <span className={`text-[13px] ${bold ? "font-black text-setu-900" : "font-semibold text-setu-700"}`}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {step === "payment" && payMethod === "esewa" && (
                                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] font-black flex-shrink-0" style={{ backgroundColor: "#60C153" }}>E</div>
                                        <div>
                                            <p className="text-[13px] font-bold text-gray-800">eSewa Test Account</p>
                                            <p className="text-[11px] text-gray-400">Scan to open eSewa app</p>
                                        </div>
                                        <QrCode className="w-4 h-4 text-gray-400 ml-auto" />
                                    </div>
                                    <div className="p-4 flex flex-col items-center">
                                        <div className="bg-white border-2 border-gray-100 rounded-xl p-2 shadow-inner">
                                            <img src={QR_URL} alt="eSewa QR Code" width={180} height={180} className="rounded-lg block" />
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-400">
                                            <Smartphone className="w-3.5 h-3.5" /> Scan with your phone camera
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <Shield className="w-5 h-5 text-setu-600" />
                                    <p className="text-[13px] font-bold text-setu-800">Setu Giving Guarantee</p>
                                </div>
                                <p className="text-[12px] text-gray-500 leading-relaxed">Setu protects your donation. We guarantee a full refund for up to 30 days in the rare case of fraud.</p>
                            </div>


                            <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400 py-1">
                                <Lock className="w-3.5 h-3.5" /> Secured with 256-bit SSL encryption
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}