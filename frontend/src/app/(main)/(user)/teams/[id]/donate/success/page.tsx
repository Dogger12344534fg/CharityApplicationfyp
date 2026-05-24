"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
    Heart, ChevronRight, AlertTriangle, ShieldCheck,
} from "lucide-react";
import { useVerifyTeamEsewaPayment } from "@/src/hooks/useTeam";

const fmtNPR = (n: number) =>
    n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

export default function TeamDonateSuccessPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string;
    const encodedData = searchParams.get("data") ?? "";

    const { data, isLoading, isError } = useVerifyTeamEsewaPayment(encodedData);

    if (isLoading)
        return (
            <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center" style={{ fontFamily: "var(--font-body)" }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="w-16 h-16 rounded-full border-4 border-setu-100 border-t-setu-500 animate-spin absolute" />
                        <Heart className="absolute inset-0 m-auto w-6 h-6 text-setu-500" />
                    </div>
                    <p className="text-[14px] text-setu-600/60 font-medium">Verifying your payment…</p>
                </div>
            </div>
        );

    if (isError || !data?.success)
        return (
            <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-4" style={{ fontFamily: "var(--font-body)" }}>
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-[22px] font-bold text-setu-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Payment Verification Failed
                    </h2>
                    <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                        We couldn't verify your payment. If money was deducted from your account, it will be refunded within 3–5 business days.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link href={`/teams/${id}/donate`} className="flex items-center justify-center gap-2 py-4 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-sm no-underline transition-all">
                            Try Again
                        </Link>
                        <Link href={`/teams/${id}`} className="flex items-center justify-center gap-2 py-3.5 border border-setu-200 text-setu-700 font-semibold rounded-xl text-sm no-underline hover:bg-setu-50 transition-colors">
                            Back to Team
                        </Link>
                    </div>
                </div>
            </div>
        );

    const payment = data.payment;

    return (
        <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-4" style={{ fontFamily: "var(--font-body)" }}>
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-setu-50 border-4 border-setu-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_24px_rgba(21,104,57,0.2)]">
                    <Heart className="w-10 h-10 text-setu-500 fill-setu-200" />
                </div>

                <p className="text-setu-600 text-[11px] font-black uppercase tracking-[0.2em] mb-2">
                    Payment Successful
                </p>
                <h1 className="text-[34px] font-bold text-setu-950 leading-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    Thank you for<br />
                    <em className="italic text-setu-600">your generosity!</em>
                </h1>
                <p className="text-[14px] text-gray-500 leading-relaxed mb-6 max-w-sm mx-auto">
                    Your donation of{" "}
                    <strong className="text-setu-700">{fmtNPR(payment.amount)}</strong>{" "}
                    has been confirmed and credited to the team.
                </p>

                <div className="bg-white rounded-2xl border border-setu-100 p-5 mb-6 text-left space-y-3 shadow-sm">
                    {[
                        { label: "Donation", value: fmtNPR(payment.amount) },
                        { label: "Platform tip", value: fmtNPR(payment.tipAmount) },
                        { label: "Total paid", value: fmtNPR(payment.totalAmount), bold: true },
                        { label: "Transaction ID", value: payment.transactionUuid.slice(0, 16) + "…" },
                        ...(payment.esewaRefId ? [{ label: "eSewa Ref ID", value: payment.esewaRefId }] : []),
                    ].map(({ label, value, bold }: any) => (
                        <div key={label} className="flex justify-between text-[13px]">
                            <span className="text-gray-400 font-medium">{label}</span>
                            <span className={bold ? "font-black text-setu-900" : "font-semibold text-setu-800"}>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-2 mb-6 text-[12px] text-setu-600 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    Payment verified by eSewa
                </div>

                <div className="flex flex-col gap-3">
                    <Link href={`/teams/${id}`} className="flex items-center justify-center gap-2 py-4 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-sm no-underline transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)]">
                        Back to Team <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link href="/teams" className="flex items-center justify-center gap-2 py-3.5 border border-setu-200 text-setu-700 font-semibold rounded-xl text-sm no-underline hover:bg-setu-50 transition-colors">
                        Browse More Teams
                    </Link>
                </div>
            </div>
        </div>
    );
}