"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { XCircle } from "lucide-react";

export default function TeamDonateFailedPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div
            className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-4"
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2
                    className="text-[26px] font-bold text-setu-950 mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    Payment Cancelled
                </h2>
                <p className="text-[14px] text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
                    Your payment was cancelled or could not be processed. No money has
                    been deducted from your account.
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href={`/teams/${id}/donate`}
                        className="flex items-center justify-center gap-2 py-4 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-sm no-underline transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)]"
                    >
                        Try Again
                    </Link>
                    <Link
                        href={`/teams/${id}`}
                        className="flex items-center justify-center gap-2 py-3.5 border border-setu-200 text-setu-700 font-semibold rounded-xl text-sm no-underline hover:bg-setu-50 transition-colors"
                    >
                        Back to Team
                    </Link>
                </div>
            </div>
        </div>
    );
}