"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Heart,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Check,
  CheckCircle2,
  XCircle,
  Handshake,
  KeyRound,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Toaster } from "sonner";
import useRegister, { useGenerateRegisterOtp } from "@/src/hooks/useRegister";

// ── Validation helpers (mirrors backend + hooks exactly) ─────────────────────

const EMAIL_REGEX =
  /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.com$/;

const validateName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "Full name is required.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (trimmed.length > 50) return "Name must not exceed 50 characters.";
  if (/\d/.test(trimmed)) return "Name must not contain numbers.";
  if (
    trimmed.length > 1 &&
    !/^[a-zA-Z][a-zA-Z\s'-]*[a-zA-Z]$/.test(trimmed)
  )
    return "Name can only contain letters, spaces, hyphens, or apostrophes.";
  if (/\s{2,}/.test(trimmed)) return "Name must not contain consecutive spaces.";
  return "";
};

const validateEmail = (email: string): string => {
  if (!email) return "Email address is required.";
  if (!EMAIL_REGEX.test(email))
    return "Please enter a valid email ending with .com";
  return "";
};

const validatePassword = (password: string): string => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 32) return "Password must not exceed 32 characters.";
  if (/\s/.test(password)) return "Password must not contain spaces.";
  if (!/[A-Z]/.test(password))
    return "Must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Must contain at least one lowercase letter.";
  if (!/\d/.test(password)) return "Must contain at least one number.";
  if (!/[@$!%*?&_#^()\-+=]/.test(password))
    return "Must contain at least one special character (@$!%*?&_#^()-+=).";
  return "";
};

// ── Password strength ────────────────────────────────────────────────────────

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[@$!%*?&_#^()\-+=]/.test(p),
  },
];

function strengthScore(p: string) {
  return passwordRules.filter((r) => r.test(p)).length;
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Strong"];
const strengthColor = [
  "",
  "bg-red-400",
  "bg-amber-400",
  "bg-amber-400",
  "bg-setu-500",
  "bg-setu-500",
];
const strengthText = [
  "",
  "text-red-500",
  "text-amber-500",
  "text-amber-500",
  "text-setu-600",
  "text-setu-600",
];

// ── Inline error component ───────────────────────────────────────────────────

function FieldError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken") ?? "";
  const inviteEmail = searchParams.get("email") ?? "";
  const inviteTeamName = searchParams.get("teamName") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  // ── Field-level errors ────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  // track which fields have been touched (blurred at least once)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ── OTP state ─────────────────────────────────────────────────────────────
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const registerMutation = useRegister();
  const generateOtpMutation = useGenerateRegisterOtp();

  const [form, setForm] = useState({
    name: "",
    email: inviteEmail,
    password: "",
    confirmPassword: "",
    agree: false,
  });

  // Sync email from URL param (runs once on mount)
  useEffect(() => {
    if (inviteEmail) setForm((f) => ({ ...f, email: inviteEmail }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const score = form.password ? strengthScore(form.password) : 0;
  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  // ── Helpers ───────────────────────────────────────────────────────────────

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const touch = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const setError = (field: string, msg: string) =>
    setErrors((e) => ({ ...e, [field]: msg }));

  const clearError = (field: string) =>
    setErrors((e) => ({ ...e, [field]: "" }));

  // validate a single field on blur
  const handleBlur = (field: string) => {
    setFocused(null);
    touch(field);
    switch (field) {
      case "name":
        setError("name", validateName(form.name));
        break;
      case "email":
        setError("email", validateEmail(form.email));
        break;
      case "password":
        setError("password", validatePassword(form.password));
        // re-validate confirmPassword if already touched
        if (touched.confirmPassword) {
          setError(
            "confirmPassword",
            form.confirmPassword && form.password !== form.confirmPassword
              ? "Passwords do not match."
              : "",
          );
        }
        break;
      case "confirmPassword":
        setError(
          "confirmPassword",
          form.confirmPassword && form.password !== form.confirmPassword
            ? "Passwords do not match."
            : "",
        );
        break;
      case "otp":
        setError(
          "otp",
          otp && !/^\d{6}$/.test(otp) ? "OTP must be exactly 6 digits." : "",
        );
        break;
    }
  };

  // validate on change (only if field already touched)
  const handleChange = (field: string, value: string | boolean) => {
    if (field !== "agree") {
      set(field as keyof typeof form, value as string);
    } else {
      set("agree", value as boolean);
    }

    if (!touched[field]) return;

    switch (field) {
      case "name":
        setError("name", validateName(value as string));
        break;
      case "email":
        setError("email", validateEmail(value as string));
        break;
      case "password":
        setError("password", validatePassword(value as string));
        if (touched.confirmPassword) {
          setError(
            "confirmPassword",
            form.confirmPassword && (value as string) !== form.confirmPassword
              ? "Passwords do not match."
              : "",
          );
        }
        break;
      case "confirmPassword":
        setError(
          "confirmPassword",
          (value as string) && form.password !== (value as string)
            ? "Passwords do not match."
            : "",
        );
        break;
    }
  };

  // validate all fields before submit
  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: passwordsMismatch ? "Passwords do not match." : "",
      otp: !otpSent
        ? "Please send and verify your email OTP first."
        : otp.length !== 6
          ? "OTP must be exactly 6 digits."
          : "",
      agree: !form.agree ? "You must agree to the terms to continue." : "",
    };
    setErrors(newErrors);
    // mark everything as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      otp: true,
      agree: true,
    });
    return Object.values(newErrors).every((e) => !e);
  };

  // ── Send / Resend OTP ─────────────────────────────────────────────────────
  const handleSendOtp = () => {
    const emailError = validateEmail(form.email);
    touch("email");
    if (emailError) {
      setError("email", emailError);
      return;
    }
    clearError("email");
    generateOtpMutation.mutate(
      { email: form.email },
      {
        onSuccess: (data) => {
          setOtpId(data.otpId);
          setOtpSent(true);
          setOtp("");
          clearError("otp");
        },
      },
    );
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    registerMutation.mutate({
      name: form.name,
      email: form.email,
      otp: otp.trim(),
      otpId: otpId!,
      password: form.password,
      confirmPassword: form.confirmPassword,
      ...(inviteToken ? { inviteToken } : {}),
    });
  };

  const canSendOtp =
    form.email.length > 4 &&
    EMAIL_REGEX.test(form.email) &&
    !generateOtpMutation.isPending;

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
              "flex items-start gap-3 w-[340px] px-4 py-3.5",
              "bg-white border border-setu-100 rounded-2xl font-sans",
              "shadow-[0_8px_32px_rgba(21,104,57,0.12),0_2px_8px_rgba(0,0,0,0.06)]",
              "data-[type=success]:border-l-4 data-[type=success]:border-l-setu-500",
              "data-[type=error]:border-l-4 data-[type=error]:border-l-red-400",
            ].join(" "),
            title: "text-[14px] font-semibold text-setu-950 leading-snug",
            description: "text-[12px] text-gray-500 mt-0.5 leading-relaxed",
            icon: "flex-shrink-0 mt-0.5",
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
        {/* ── LEFT: Form panel ── */}
        <div className="flex-1 flex flex-col bg-cream relative overflow-y-auto">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-setu-700 via-setu-400 to-setu-600" />

          <div className="flex-1 flex flex-col items-center justify-center px-8 py-14 max-w-[480px] mx-auto w-full">
            {/* Mobile logo */}
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

            {/* ── Invite banner ── */}
            {inviteToken && (
              <div className="w-full mb-6 bg-setu-50 border border-setu-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-setu-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-setu-800">
                    {inviteTeamName
                      ? `You've been invited to join "${inviteTeamName}"`
                      : "You've been invited to join a team on Setu"}
                  </p>
                  <p className="text-[12px] text-setu-600 mt-0.5">
                    Create a free account to accept the invitation and join the team.
                  </p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="w-full mb-8">
              <p className="text-setu-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">
                Get started free
              </p>
              <h1
                className="text-4xl font-bold text-setu-950 leading-tight mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Create your
                <br />
                <em className="italic text-setu-700">Setu account</em>
              </h1>
              <p className="text-gray-500 text-sm">
                Already have one?{" "}
                <Link
                  href={inviteToken ? `/login?next=/teams/invite/${inviteToken}` : "/login"}
                  className="text-setu-700 font-semibold hover:text-setu-600 transition-colors no-underline"
                >
                  Sign in →
                </Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>

              {/* ── Full name ── */}
              <div>
                <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                  Full Name
                </label>
                <div
                  className={[
                    "relative rounded-xl transition-all duration-200",
                    focused === "name" ? "ring-2 ring-setu-500/30" : "",
                    errors.name && touched.name
                      ? "ring-2 ring-red-400/40"
                      : "",
                  ].join(" ")}
                >
                  <User
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      errors.name && touched.name
                        ? "text-red-400"
                        : focused === "name"
                          ? "text-setu-600"
                          : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => handleBlur("name")}
                    placeholder="Ramesh Shrestha"
                    className={[
                      "w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none transition-colors border",
                      errors.name && touched.name
                        ? "border-red-300 focus:border-red-400"
                        : "border-setu-200 focus:border-setu-500",
                    ].join(" ")}
                  />
                </div>
                <FieldError message={touched.name ? errors.name || "" : ""} />
              </div>

              {/* ── Email + Send OTP ── */}
              <div>
                <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <div
                    className={[
                      "relative rounded-xl transition-all duration-200 flex-1",
                      focused === "email" ? "ring-2 ring-setu-500/30" : "",
                      errors.email && touched.email
                        ? "ring-2 ring-red-400/40"
                        : "",
                    ].join(" ")}
                  >
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        errors.email && touched.email
                          ? "text-red-400"
                          : focused === "email"
                            ? "text-setu-600"
                            : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        handleChange("email", e.target.value);
                        if (otpSent) {
                          setOtpSent(false);
                          setOtpId(null);
                          setOtp("");
                        }
                      }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => handleBlur("email")}
                      placeholder="you@example.com"
                      className={[
                        "w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none transition-colors border",
                        errors.email && touched.email
                          ? "border-red-300 focus:border-red-400"
                          : "border-setu-200 focus:border-setu-500",
                      ].join(" ")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!canSendOtp}
                    className={[
                      "flex-shrink-0 flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all border-none cursor-pointer",
                      otpSent
                        ? "bg-setu-50 text-setu-600 hover:bg-setu-100"
                        : "bg-setu-700 text-white hover:bg-setu-600 shadow-[0_4px_12px_rgba(21,104,57,0.3)]",
                      !canSendOtp ? "opacity-50 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {generateOtpMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : otpSent ? (
                      <RefreshCw className="w-3.5 h-3.5" />
                    ) : (
                      <Mail className="w-3.5 h-3.5" />
                    )}
                    {generateOtpMutation.isPending
                      ? "Sending…"
                      : otpSent
                        ? "Resend"
                        : "Send OTP"}
                  </button>
                </div>

                <FieldError message={touched.email ? errors.email || "" : ""} />

                {otpSent && !errors.email && (
                  <p className="text-[11px] text-setu-600 font-semibold mt-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    OTP sent to <strong>{form.email}</strong> — valid for 10
                    minutes
                  </p>
                )}
              </div>

              {/* ── OTP input ── */}
              {otpSent && (
                <div>
                  <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                    Email OTP <span className="text-red-400">*</span>
                  </label>
                  <div
                    className={[
                      "relative rounded-xl transition-all duration-200",
                      focused === "otp" ? "ring-2 ring-setu-500/30" : "",
                      errors.otp && touched.otp
                        ? "ring-2 ring-red-400/40"
                        : "",
                    ].join(" ")}
                  >
                    <KeyRound
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        errors.otp && touched.otp
                          ? "text-red-400"
                          : focused === "otp"
                            ? "text-setu-600"
                            : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setOtp(val);
                        if (touched.otp) {
                          setError(
                            "otp",
                            val.length > 0 && val.length < 6
                              ? "OTP must be exactly 6 digits."
                              : "",
                          );
                        }
                      }}
                      onFocus={() => setFocused("otp")}
                      onBlur={() => handleBlur("otp")}
                      placeholder="Enter 6-digit OTP"
                      className={[
                        "w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none transition-colors tracking-[0.25em] font-mono font-bold border",
                        errors.otp && touched.otp
                          ? "border-red-300 focus:border-red-400"
                          : "border-setu-200 focus:border-setu-500",
                      ].join(" ")}
                    />
                    {otp.length === 6 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-setu-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <FieldError message={touched.otp ? errors.otp || "" : ""} />
                  {!errors.otp && (
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Check your inbox (and spam folder) for the 6-digit code.
                    </p>
                  )}
                </div>
              )}

              {/* ── Password ── */}
              <div>
                <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                  Password
                </label>
                <div
                  className={[
                    "relative rounded-xl transition-all duration-200",
                    focused === "password" ? "ring-2 ring-setu-500/30" : "",
                    errors.password && touched.password
                      ? "ring-2 ring-red-400/40"
                      : "",
                  ].join(" ")}
                >
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      errors.password && touched.password
                        ? "text-red-400"
                        : focused === "password"
                          ? "text-setu-600"
                          : "text-gray-400"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => handleBlur("password")}
                    placeholder="Create a strong password"
                    className={[
                      "w-full pl-11 pr-12 py-3.5 bg-white rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none transition-colors border",
                      errors.password && touched.password
                        ? "border-red-300 focus:border-red-400"
                        : "border-setu-200 focus:border-setu-500",
                    ].join(" ")}
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

                <FieldError
                  message={touched.password ? errors.password || "" : ""}
                />

                {/* Strength meter — show even without error so user can see progress */}
                {form.password && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= score ? strengthColor[score] : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {score > 0 && (
                        <span
                          className={`text-xs font-semibold ${strengthText[score]}`}
                        >
                          {strengthLabel[score]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {passwordRules.map(({ label, test }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              test(form.password)
                                ? "bg-setu-500"
                                : "bg-gray-200"
                            }`}
                          >
                            {test(form.password) && (
                              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                            )}
                          </div>
                          <span
                            className={`text-xs transition-colors ${
                              test(form.password)
                                ? "text-setu-700"
                                : "text-gray-400"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Confirm Password ── */}
              <div>
                <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                  Confirm Password
                </label>
                <div
                  className={[
                    "relative rounded-xl transition-all duration-200",
                    focused === "confirm" ? "ring-2 ring-setu-500/30" : "",
                    errors.confirmPassword && touched.confirmPassword
                      ? "ring-2 ring-red-400/40"
                      : "",
                    passwordsMatch ? "ring-2 ring-setu-500/30" : "",
                  ].join(" ")}
                >
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "text-red-400"
                        : passwordsMatch
                          ? "text-setu-500"
                          : focused === "confirm"
                            ? "text-setu-600"
                            : "text-gray-400"
                    }`}
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Re-enter your password"
                    className={[
                      "w-full pl-11 pr-12 py-3.5 bg-white rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none transition-colors border",
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-300 focus:border-red-400"
                        : passwordsMatch
                          ? "border-setu-400"
                          : "border-setu-200 focus:border-setu-500",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-setu-600 transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* show match / mismatch only when touched */}
                {touched.confirmPassword && form.confirmPassword.length > 0 && (
                  <p
                    className={`text-xs mt-1.5 font-medium flex items-center gap-1.5 ${
                      passwordsMatch ? "text-setu-600" : "text-red-500"
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* ── Terms ── */}
              <div>
                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => {
                      set("agree", e.target.checked);
                      if (touched.agree) {
                        setError(
                          "agree",
                          !e.target.checked
                            ? "You must agree to the terms to continue."
                            : "",
                        );
                      }
                    }}
                    onBlur={() => {
                      touch("agree");
                      setError(
                        "agree",
                        !form.agree
                          ? "You must agree to the terms to continue."
                          : "",
                      );
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-setu-300 text-setu-600 focus:ring-setu-500 cursor-pointer flex-shrink-0"
                  />
                  <label
                    htmlFor="agree"
                    className="text-xs text-gray-500 leading-relaxed cursor-pointer"
                  >
                    I agree to Setu's{" "}
                    <Link
                      href="/terms"
                      className="text-setu-700 hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-setu-700 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    . I understand my donations support verified campaigns in
                    Nepal.
                  </label>
                </div>
                <FieldError
                  message={touched.agree ? errors.agree || "" : ""}
                />
              </div>

              {/* ── OTP not sent warning ── */}
              {!otpSent && touched.otp && (
                <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Please send and verify your email OTP before creating your
                  account.
                </p>
              )}

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_8px_24px_rgba(26,110,57,0.35)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none mt-1"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-setu-100" />
              <span className="text-xs text-gray-400 font-medium">
                or sign up with
              </span>
              <div className="flex-1 h-px bg-setu-100" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`)
              }
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-setu-200 hover:border-setu-300 hover:bg-setu-50 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-150 shadow-sm hover:shadow"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Trust */}
            <div className="w-full mt-8 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5 text-setu-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-xs text-gray-400">
                256-bit SSL · Free forever · No hidden fees
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Image panel ── */}
        <div className="hidden lg:block lg:w-[48%] relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&q=90&auto=format&fit=crop"
            alt="Relief volunteers distributing aid in Nepal"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-setu-950/25 via-setu-950/40 to-setu-950/88" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-setu-950/15" />

          <div className="absolute top-10 right-10 z-10">
             <Link
            href="/"
            className="flex items-center gap-2.5 no-underline flex-shrink-0 group"
          >
            <SetuLogo size={44} />
            <span
              className="text-[1.5rem] font-bold text-white leading-none tracking-[-0.3px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Setu
            </span>
          </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
            <p className="text-setu-300 text-sm font-semibold uppercase tracking-[0.15em] mb-4">Join our community</p>
            <h2 className="text-5xl font-bold text-white leading-[1.08] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Be the bridge<br />
              <em className="italic text-setu-300">Nepal needs.</em>
            </h2>
            <p className="text-white/55 text-base leading-relaxed max-w-sm mb-10">
              Create campaigns, donate goods, join relief teams, and see your impact in real-time.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-10">
              {["🏕️ Emergency Relief", "📦 Goods Donation", "👥 Team Campaigns", "🏆 Hall of Fame", "📊 Impact Tracking"].map((f) => (
                <span key={f} className="px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs font-medium text-white/80">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function SetuLogo({ size = 44 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rounded square background */}
      <rect x="2" y="2" width="52" height="52" rx="13" fill="#e8f7ee" />

      {/* Bridge arch */}
      <path
        d="M10 36 Q28 10 46 36"
        stroke="#1a6e39"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bridge deck */}
      <line
        x1="6"
        y1="36"
        x2="50"
        y2="36"
        stroke="#1a6e39"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Suspension verticals */}
      <line
        x1="20"
        y1="24"
        x2="20"
        y2="36"
        stroke="#4dbf7a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="28"
        y1="19"
        x2="28"
        y2="36"
        stroke="#4dbf7a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="36"
        y1="24"
        x2="36"
        y2="36"
        stroke="#4dbf7a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Heart at apex */}
      <path
        d="M28 31 C28 31 22 26.5 22 23 C22 20.8 24 19 28 22 C32 19 34 20.8 34 23 C34 26.5 28 31 28 31Z"
        fill="#2aa558"
      />

      {/* Pillars */}
      <line
        x1="12"
        y1="36"
        x2="12"
        y2="44"
        stroke="#1a6e39"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <line
        x1="44"
        y1="36"
        x2="44"
        y2="44"
        stroke="#1a6e39"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterPageInner />
    </Suspense>
  );
}
