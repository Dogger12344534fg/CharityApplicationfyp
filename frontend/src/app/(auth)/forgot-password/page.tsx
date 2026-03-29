"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Heart,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Handshake,
} from "lucide-react";
import axios from "axios";
import useGenerateOtp from "@/src/hooks/useGenerateOtp";
import useVerifyOtp from "@/src/hooks/useVerifyOtp";

type Step = "email" | "otp" | "password" | "done";

export default function ForgotPasswordPage() {
  const generateOtpMutation = useGenerateOtp();
  const verifyOtpMutation = useVerifyOtp();

  const [step, setStep] = useState<Step>("email");
  const [resending, setResending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpRequestedId, setOtpRequestedId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    generateOtpMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          setOtpRequestedId(data.otpRequested);
          setStep("otp");
        },
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.data?.message || "Failed to send OTP. Try again.",
            );
          } else {
            setError("Something went wrong. Please try again.");
          }
        },
      },
    );
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    generateOtpMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          setOtpRequestedId(data.otpRequested);
          setOtpDigits(["", "", "", "", "", ""]);
          otpRefs.current[0]?.focus();
          setResending(false);
        },
        onError: () => {
          setError("Failed to resend OTP.");
          setResending(false);
        },
      },
    );
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpDigits];
    next[i] = val.slice(-1);
    setOtpDigits(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setStep("password");
    setError("");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    verifyOtpMutation.mutate(
      { otpRequested: otpRequestedId, otp: otpDigits.join(""), newPassword },
      {
        onSuccess: () => setStep("done"),
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.data?.message ||
                "Invalid OTP or expired. Please try again.",
            );
          } else {
            setError("Something went wrong.");
          }
          setStep("otp");
        },
      },
    );
  };

  const otpFilled = otpDigits.every((d) => d !== "");

  const leftContent = {
    email: {
      label: "Password Reset",
      heading: (
        <>
          Back in minutes,
          <br />
          <em className="italic text-setu-300">giving in seconds.</em>
        </>
      ),
      sub: "We'll send a 6-digit OTP to your inbox. Your campaigns and donor history are safe.",
      steps: [
        "Enter your registered email address",
        "Enter the 6-digit OTP from your inbox",
        "Set your new password and sign in",
      ],
    },
    otp: {
      label: "OTP Sent",
      heading: (
        <>
          Check your
          <br />
          <em className="italic text-setu-300">inbox now.</em>
        </>
      ),
      sub: "A 6-digit OTP has been sent. It expires in 15 minutes — check spam if needed.",
      steps: [
        "✓ Email address confirmed",
        "Enter the 6-digit OTP from your inbox",
        "Set your new password and sign in",
      ],
    },
    password: {
      label: "Almost there",
      heading: (
        <>
          Set your new
          <br />
          <em className="italic text-setu-300">password.</em>
        </>
      ),
      sub: "Choose a strong password you haven't used before to keep your account secure.",
      steps: [
        "✓ Email address confirmed",
        "✓ OTP verified successfully",
        "Set your new password and sign in",
      ],
    },
    done: {
      label: "All done",
      heading: (
        <>
          Password
          <br />
          <em className="italic text-setu-300">updated!</em>
        </>
      ),
      sub: "Your account is secure. Sign in with your new password to continue donating.",
      steps: [
        "✓ Email address confirmed",
        "✓ OTP verified successfully",
        "✓ Password updated successfully",
      ],
    },
  };

  const lc = leftContent[step];

  return (
    <div className="min-h-screen flex bg-setu-950">
      <div className="hidden lg:block lg:w-[58%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=356&q=85&auto=format&fit=crop"
          alt="Annapurna Himalaya Nepal mountain landscape"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-setu-950 via-setu-950/60 to-setu-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-setu-950/30" />

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
              className="text-[1.5rem] font-bold text-white leading-none tracking-[-0.3px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Setu
            </span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
          <p className="text-setu-300 text-sm font-semibold uppercase tracking-[0.15em] mb-4">
            {lc.label}
          </p>
          <h2
            className="text-5xl font-bold text-white leading-[1.08] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lc.heading}
          </h2>
          <p className="text-white/55 text-base leading-relaxed max-w-sm mb-10">
            {lc.sub}
          </p>

          <div className="flex flex-col gap-4 max-w-sm">
            {lc.steps.map((label, i) => {
              const done = label.startsWith("✓");
              const active =
                !done &&
                ((step === "email" && i === 0) ||
                  (step === "otp" && i === 1) ||
                  (step === "password" && i === 2));
              return (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={[
                      "w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      done
                        ? "bg-setu-600 border-setu-500"
                        : active
                          ? "bg-setu-700/80 border-setu-400"
                          : "bg-white/10 border-white/20",
                    ].join(" ")}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <span
                        className="text-xs font-bold text-setu-300"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm transition-colors ${done ? "text-setu-300 line-through" : active ? "text-white font-medium" : "text-white/50"}`}
                  >
                    {label.replace("✓ ", "")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-cream relative overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-setu-700 via-setu-400 to-setu-600" />

        <div
          className="absolute top-1 left-0 h-0.5 bg-setu-500/30 transition-all duration-500"
          style={{
            width:
              step === "email"
                ? "25%"
                : step === "otp"
                  ? "50%"
                  : step === "password"
                    ? "75%"
                    : "100%",
          }}
        />

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 max-w-[440px] mx-auto w-full">
          <div className="lg:hidden mb-10 w-full">
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

          {step === "email" && (
            <>
              <div className="w-full mb-8">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
                  Back to Sign In
                </Link>
              </div>

              <div className="w-full mb-9">
                <div className="w-12 h-12 bg-setu-50 border border-setu-200 rounded-2xl flex items-center justify-center mb-5">
                  <Mail className="w-5 h-5 text-setu-600" />
                </div>
                <p className="text-setu-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">
                  Step 1 of 3
                </p>
                <h1
                  className="text-4xl font-bold text-setu-950 leading-tight mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Forgot your
                  <br />
                  <em className="italic text-setu-700">password?</em>
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Enter your email and we'll send a 6-digit OTP to reset it.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="w-full space-y-5">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    We'll send a one-time password to this address.
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={generateOtpMutation.isPending}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_8px_24px_rgba(26,110,57,0.35)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {generateOtpMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP…</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Remembered it?{" "}
                  <Link
                    href="/login"
                    className="text-setu-700 font-semibold hover:text-setu-600 transition-colors no-underline"
                  >
                    Back to Sign In →
                  </Link>
                </p>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="w-full mb-8">
                <button
                  onClick={() => {
                    setStep("email");
                    setError("");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-setu-600 hover:text-setu-500 transition-colors group border-none bg-transparent cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
                  Change email
                </button>
              </div>

              <div className="w-full mb-9">
                <div className="w-12 h-12 bg-setu-50 border border-setu-200 rounded-2xl flex items-center justify-center mb-5">
                  <KeyRound className="w-5 h-5 text-setu-600" />
                </div>
                <p className="text-setu-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">
                  Step 2 of 3
                </p>
                <h1
                  className="text-4xl font-bold text-setu-950 leading-tight mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Enter the
                  <br />
                  <em className="italic text-setu-700">6-digit OTP</em>
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We sent a code to{" "}
                  <span className="font-semibold text-setu-700">{email}</span>.
                  It expires in 15 minutes.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
                <div>
                  <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-4">
                    One-Time Password
                  </label>
                  <div
                    className="flex gap-3 justify-between"
                    onPaste={handleOtpPaste}
                  >
                    {otpDigits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={[
                          "w-12 h-14 text-center text-[22px] font-bold rounded-xl border transition-all duration-150 focus:outline-none",
                          d
                            ? "border-setu-500 bg-setu-50 text-setu-900"
                            : "border-setu-200 bg-white text-setu-900",
                          "focus:border-setu-500 focus:ring-2 focus:ring-setu-500/25",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-400">
                      Paste your code or type each digit
                    </p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="flex items-center gap-1.5 text-xs font-semibold text-setu-600 hover:text-setu-500 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`}
                      />
                      {resending ? "Resending…" : "Resend OTP"}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!otpFilled}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_8px_24px_rgba(26,110,57,0.35)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>Verify OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <div className="w-full mb-8">
                <button
                  onClick={() => {
                    setStep("otp");
                    setError("");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-setu-600 hover:text-setu-500 transition-colors group border-none bg-transparent cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
                  Back to OTP
                </button>
              </div>

              <div className="w-full mb-9">
                <div className="w-12 h-12 bg-setu-50 border border-setu-200 rounded-2xl flex items-center justify-center mb-5">
                  <Lock className="w-5 h-5 text-setu-600" />
                </div>
                <p className="text-setu-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">
                  Step 3 of 3
                </p>
                <h1
                  className="text-4xl font-bold text-setu-950 leading-tight mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Set your new
                  <br />
                  <em className="italic text-setu-700">password</em>
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="w-full space-y-5">
                <div>
                  <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                    New Password
                  </label>
                  <div
                    className={`relative rounded-xl transition-all duration-200 ${focused === "new" ? "ring-2 ring-setu-500/30" : ""}`}
                  >
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "new" ? "text-setu-600" : "text-gray-400"}`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setFocused("new")}
                      onBlur={() => setFocused(null)}
                      placeholder="At least 8 characters"
                      className="w-full pl-11 pr-12 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-setu-600 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                    Confirm Password
                  </label>
                  <div
                    className={[
                      "relative rounded-xl transition-all duration-200",
                      focused === "confirm" ? "ring-2 ring-setu-500/30" : "",
                      confirmPassword && newPassword !== confirmPassword
                        ? "ring-2 ring-red-400/40"
                        : "",
                      confirmPassword && newPassword === confirmPassword
                        ? "ring-2 ring-setu-500/30"
                        : "",
                    ].join(" ")}
                  >
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${confirmPassword && newPassword !== confirmPassword ? "text-red-400" : focused === "confirm" ? "text-setu-600" : "text-gray-400"}`}
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocused("confirm")}
                      onBlur={() => setFocused(null)}
                      placeholder="Re-enter your password"
                      className={[
                        "w-full pl-11 pr-12 py-3.5 bg-white rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none transition-colors border",
                        confirmPassword && newPassword !== confirmPassword
                          ? "border-red-300"
                          : "border-setu-200 focus:border-setu-500",
                      ].join(" ")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-setu-600 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 font-medium mt-1.5">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    verifyOtpMutation.isPending ||
                    (!!confirmPassword && newPassword !== confirmPassword)
                  }
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_8px_24px_rgba(26,110,57,0.35)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {verifyOtpMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating password…</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === "done" && (
            <div className="w-full text-center">
              <div className="w-16 h-16 bg-setu-50 border-2 border-setu-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-setu-600" />
              </div>
              <p className="text-setu-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">
                All done!
              </p>
              <h1
                className="text-4xl font-bold text-setu-950 leading-tight mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Password reset
                <br />
                <em className="italic text-setu-700">successfully.</em>
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Your account is secure. Sign in with your new password.
              </p>
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-4 bg-setu-700 hover:bg-setu-600 rounded-xl text-sm font-bold text-white no-underline transition-all duration-200 hover:shadow-[0_8px_24px_rgba(26,110,57,0.35)] hover:-translate-y-0.5"
              >
                Sign In to Setu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="w-full mt-10 flex items-center justify-center gap-2">
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
  );
}
