"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Target,
  Heart,
  Zap,
  Eye,
  ShieldCheck,
  Globe,
  Check,
  Loader2,
  ChevronDown,
  Plus,
  X,
  Camera,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { axiosInstance } from "@/src/services/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";

// ── Step config ──────────────────────────────────────────────
const STEPS = [
  { n: 1, label: "Basic Info" },
  { n: 2, label: "Goal & Focus" },
  { n: 3, label: "Invite Members" },
];

// ── Category options ─────────────────────────────────────────
const categories = [
  {
    key: "emergency",
    label: "Emergency",
    icon: Zap,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    key: "medical",
    label: "Medical",
    icon: Heart,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    key: "education",
    label: "Education",
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    key: "charity",
    label: "Charity",
    icon: Users,
    color: "text-setu-600",
    bg: "bg-setu-50",
    border: "border-setu-200",
  },
  {
    key: "animals",
    label: "Animals",
    icon: ShieldCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    key: "environment",
    label: "Environment",
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

const districts = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Chitwan",
  "Birgunj",
  "Biratnagar",
  "Butwal",
  "Dharan",
  "Janakpur",
  "Nepalgunj",
  "Dhangadhi",
  "Mustang",
  "Humla",
  "Dolakha",
  "Jajarkot",
  "Koshi Zone",
  "Eastern Nepal",
];

export default function CreateTeamPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => router.push("/teams"), 5000);
    return () => clearTimeout(timer);
  }, [done, router]);

  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleBlur = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    privacy: "public",
    category: "",
    goal: "",
    website: "",
    emails: [""],
  });

  const set = (k: keyof typeof form, v: string | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const addEmail = () => set("emails", [...form.emails, ""]);
  const removeEmail = (i: number) =>
    set(
      "emails",
      form.emails.filter((_, idx) => idx !== i),
    );
  const updateEmail = (i: number, v: string) => {
    const next = [...form.emails];
    next[i] = v;
    set("emails", next);
  };

  const canNext1 =
    !!avatarFile &&
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 20 &&
    !!form.location;
    
  const canNext2 = 
    !!form.category && 
    !!form.goal && 
    Number(form.goal) >= 10000 && 
    Number(form.goal) <= 200000;

  const handleSubmit = async () => {

    if (!avatarFile) {
      toast.error("Team photo is required.");
      setStep(1);
      return;
    }

    if (!form.category) {
      toast.error("Please select a primary focus category.");
      setStep(2);
      return;
    }

    const g = Number(form.goal);
    if (!form.goal || g < 10000) {
      toast.error("Please set a fundraising goal of at least NPR 10,000.");
      setStep(2);
      return;
    }
    
    if (g > 200000) {
      toast.error("Fundraising goal cannot be more than NPR 2,00,000.");
      setStep(2);
      return;
    }

    // Filter valid emails
    const validEmails = form.emails
      .map((e) => e.trim())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("privacy", form.privacy);
      formData.append("category", form.category);
      formData.append("goalAmount", String(form.goal));
      if (form.website) formData.append("website", form.website);
      if (validEmails.length > 0) formData.append("inviteEmails", JSON.stringify(validEmails));
      if (avatarFile) formData.append("avatar", avatarFile);

      await axiosInstance.post("/teams", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Team submitted for admin review.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setDone(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create team.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const avatarError = touched.avatar && !avatarFile ? "Team photo is required" : "";
  const nameError = touched.name && form.name.trim().length < 3 ? "Name must be at least 3 characters" : "";
  const descError = touched.desc && form.description.trim().length < 20 ? "Description must be at least 20 characters" : "";
  const locationError = touched.location && !form.location ? "Please select a location" : "";
  const categoryError = touched.category && !form.category ? "Please select a primary focus" : "";
  
  let goalError = "";
  if (touched.goal) {
    const g = Number(form.goal);
    if (!form.goal || g < 10000) goalError = "Minimum goal is NPR 10,000";
    else if (g > 200000) goalError = "Maximum goal is NPR 2,00,000";
  }

  // ── Done screen ──────────────────────────────────────────────
  if (done) {
    return (
      <div
        className="min-h-screen bg-cream flex items-center justify-center px-4"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-setu-50 border-2 border-setu-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_rgba(21,104,57,0.15)]">
            <Check className="w-10 h-10 text-setu-600" />
          </div>
          <p className="text-setu-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Team Created!
          </p>
          <h1
            className="text-[36px] font-bold text-setu-950 leading-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <em className="italic text-setu-700">"{form.name}"</em>
            <br />
            is submitted 🎉
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Your team has been submitted and is currently pending admin review.
            Once approved, it will be live on Setu!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/teams"
              className="flex items-center justify-center gap-2 py-4 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-sm no-underline transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)]"
            >
              View My Team <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/teams"
              className="flex items-center justify-center gap-2 py-3.5 border border-setu-200 text-setu-700 font-semibold rounded-xl text-sm no-underline hover:bg-setu-50 transition-colors"
            >
              Browse All Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Toast ── */}
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

      <div
        className="min-h-screen bg-cream"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Top progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-setu-100">
          <div
            className="h-full bg-gradient-to-r from-setu-700 to-setu-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
          <div className="mb-8">
            <Link
              href="/teams"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
              Back to Teams
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* ── LEFT ── */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="mb-8">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-2">
                  <div className="w-5 h-[2px] bg-setu-500 rounded" />
                  New Team
                </div>
                <h1
                  className="text-[28px] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Create Your
                  <br />
                  <em className="italic text-setu-700">Dream Team</em>
                </h1>
              </div>

              {/* Step nav */}
              <div className="bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] p-5 mb-6">
                <div className="flex flex-col gap-1">
                  {STEPS.map(({ n, label }) => {
                    const isDone = step > n;
                    const isActive = step === n;
                    return (
                      <div
                        key={n}
                        className={[
                          "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150",
                          isActive ? "bg-setu-50" : "",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold transition-all duration-200",
                            isDone
                              ? "bg-setu-600 text-white"
                              : isActive
                                ? "bg-setu-700 text-white shadow-[0_2px_8px_rgba(21,104,57,0.3)]"
                                : "bg-gray-100 text-gray-400",
                          ].join(" ")}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : n}
                        </div>
                        <span
                          className={`text-[13px] font-semibold transition-colors ${isActive ? "text-setu-800" : isDone ? "text-setu-600" : "text-gray-400"}`}
                        >
                          {label}
                        </span>
                        {isDone && (
                          <Check className="w-3.5 h-3.5 text-setu-500 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-setu-900 rounded-2xl p-5">
                <div className="w-8 h-8 bg-setu-700/50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-4 h-4 text-setu-300" />
                </div>
                <p
                  className="text-white text-[13px] font-bold mb-1.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step === 1
                    ? "Choose a clear name"
                    : step === 2
                      ? "Set a realistic goal"
                      : "Warm intros work best"}
                </p>
                <p className="text-white/50 text-[12px] leading-relaxed">
                  {step === 1
                    ? "Teams with clear, cause-specific names raise 2× more than generic ones."
                    : step === 2
                      ? "Break your goal into milestones to keep members motivated along the way."
                      : "Personal invite messages get 3× more acceptances than generic links."}
                </p>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="flex-1">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="bg-white rounded-3xl border border-setu-100 shadow-[0_2px_16px_rgba(21,104,57,0.07)] overflow-hidden">
                  {/* Step header */}
                  <div className="px-8 py-6 border-b border-setu-50 bg-setu-50/50">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-setu-500 mb-1">
                      Step {step} of 3
                    </p>
                    <h2
                      className="text-[20px] font-bold text-setu-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step === 1
                        ? "Tell us about your team"
                        : step === 2
                          ? "Set your goal & focus"
                          : "Invite your first members"}
                    </h2>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* ════ STEP 1 ════ */}
                    {step === 1 && (
                      <>
                        {/* Avatar upload */}
                        <div>
                          <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-3">
                            Team Photo <span className="text-red-400">*</span>
                          </label>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <div className="flex items-center gap-5">
                            {avatarPreview ? (
                              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-setu-200 flex-shrink-0">
                                <img
                                  src={avatarPreview}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAvatarPreview(null);
                                    setAvatarFile(null);
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center border-none cursor-pointer"
                                >
                                  <X className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  handleBlur("avatar");
                                  fileRef.current?.click();
                                }}
                                className={`w-20 h-20 rounded-2xl bg-setu-50 border-2 border-dashed ${avatarError ? "border-red-400 bg-red-50" : "border-setu-200 hover:border-setu-400 hover:bg-setu-100"} flex flex-col items-center justify-center flex-shrink-0 transition-all cursor-pointer group border-none`}
                              >
                                <Camera className={`w-6 h-6 transition-colors ${avatarError ? "text-red-400" : "text-setu-400 group-hover:text-setu-600"}`} />
                                <span className={`text-[10px] font-medium mt-1 ${avatarError ? "text-red-400" : "text-setu-400"}`}>
                                  Upload
                                </span>
                              </button>
                            )}
                            <div>
                              <p className="text-[13px] font-semibold text-setu-800 mb-0.5">
                                Add a team photo
                              </p>
                              <p className="text-[12px] text-gray-400">
                                PNG, JPG up to 5MB. Shown on your team card.
                              </p>
                            </div>
                          </div>
                          {avatarError && <p className="text-[11px] text-red-500 mt-2">{avatarError}</p>}
                        </div>

                        {/* Team name */}
                        <div>
                          <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                            Team Name <span className="text-red-400">*</span>
                          </label>
                          <div
                            className={`relative rounded-xl transition-all duration-200 ${focused === "name" ? "ring-2 ring-setu-500/30" : ""}`}
                          >
                            <Users
                              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${nameError ? "text-red-400" : focused === "name" ? "text-setu-600" : "text-gray-400"}`}
                            />
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={(e) => set("name", e.target.value)}
                              onFocus={() => setFocused("name")}
                              onBlur={() => { setFocused(null); handleBlur("name"); }}
                              placeholder="e.g. Kathmandu Cares Collective"
                              maxLength={60}
                              className={`w-full pl-11 pr-4 py-3.5 bg-white border ${nameError ? "border-red-400 bg-red-50/30" : "border-setu-200"} rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors`}
                            />
                          </div>
                          <div className="flex justify-between mt-1.5">
                            <p className={`text-[11px] ${nameError ? "text-red-500 font-medium" : "text-gray-400"}`}>
                              {nameError || "Make it memorable and cause-specific"}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {form.name.length}/60
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                            Team Description{" "}
                            <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            required
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            onFocus={() => setFocused("desc")}
                            onBlur={() => { setFocused(null); handleBlur("desc"); }}
                            placeholder="Describe your team's mission, who you are, and what you're working to achieve across Nepal…"
                            rows={4}
                            maxLength={400}
                            className={[
                              "w-full px-4 py-3.5 bg-white border rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors resize-none",
                              descError ? "border-red-400 bg-red-50/30" : "border-setu-200",
                              focused === "desc"
                                ? "ring-2 ring-setu-500/30"
                                : "",
                            ].join(" ")}
                          />
                          <div className="flex justify-between mt-1.5">
                            <p
                              className={`text-[11px] ${descError ? "text-red-500 font-medium" : form.description.length < 20 && form.description.length > 0 ? "text-red-400" : "text-gray-400"}`}
                            >
                              {descError || (form.description.length < 20
                                ? `${20 - form.description.length} more characters needed`
                                : "Looks good!")}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {form.description.length}/400
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                            Based In <span className="text-red-400">*</span>
                          </label>
                          <div
                            className={`relative rounded-xl transition-all duration-200 ${focused === "location" ? "ring-2 ring-setu-500/30" : ""}`}
                          >
                            <MapPin
                              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${locationError ? "text-red-400" : focused === "location" ? "text-setu-600" : "text-gray-400"}`}
                            />
                            <select
                              required
                              value={form.location}
                              onChange={(e) => set("location", e.target.value)}
                              onFocus={() => setFocused("location")}
                              onBlur={() => { setFocused(null); handleBlur("location"); }}
                              className={`w-full pl-11 pr-10 py-3.5 bg-white border ${locationError ? "border-red-400 bg-red-50/30" : "border-setu-200"} rounded-xl text-sm text-setu-950 focus:outline-none focus:border-setu-500 transition-colors appearance-none cursor-pointer`}
                            >
                              <option value="">Select district or zone…</option>
                              {districts.map((d) => (
                                <option key={d}>{d}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* ════ STEP 2 ════ */}
                    {step === 2 && (
                      <>
                        {/* Category */}
                        <div>
                          <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-3">
                            Primary Focus{" "}
                            <span className="text-red-400">*</span>
                          </label>
                          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${categoryError ? "p-2 bg-red-50/50 border border-red-200 rounded-2xl" : ""}`}>
                            {categories.map(
                              ({
                                key,
                                label,
                                icon: Icon,
                                color,
                                bg,
                                border,
                              }) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => { set("category", key); handleBlur("category"); }}
                                  className={[
                                    "flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer",
                                    form.category === key
                                      ? `${bg} ${border}`
                                      : "bg-white border-setu-100 hover:border-setu-200",
                                  ].join(" ")}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                                  >
                                    <Icon className={`w-4 h-4 ${color}`} />
                                  </div>
                                  <span
                                    className={`text-[13px] font-semibold ${form.category === key ? color : "text-setu-800"}`}
                                  >
                                    {label}
                                  </span>
                                  {form.category === key && (
                                    <Check
                                      className={`w-3.5 h-3.5 ml-auto flex-shrink-0 ${color}`}
                                    />
                                  )}
                                </button>
                              ),
                            )}
                          </div>
                          {categoryError && <p className="text-[11px] text-red-500 mt-2">{categoryError}</p>}
                        </div>

                        {/* Goal */}
                        <div>
                          <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                            Fundraising Goal (NPR){" "}
                            <span className="text-red-400">*</span>
                          </label>
                          <div
                            className={`relative rounded-xl transition-all duration-200 ${focused === "goal" ? "ring-2 ring-setu-500/30" : ""}`}
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                              <Target
                                className={`w-4 h-4 transition-colors ${goalError ? "text-red-400" : focused === "goal" ? "text-setu-600" : "text-gray-400"}`}
                              />
                              <span className={`text-[13px] font-bold border-r pr-2.5 ${goalError ? "text-red-400 border-red-200" : "text-gray-400 border-setu-200"}`}>
                                NPR
                              </span>
                            </div>
                            <input
                              type="number"
                              required
                              min={10000}
                              max={200000}
                              value={form.goal}
                              onChange={(e) => set("goal", e.target.value)}
                              onFocus={() => setFocused("goal")}
                              onBlur={() => { setFocused(null); handleBlur("goal"); }}
                              placeholder="e.g. 50000"
                              className={`w-full pl-24 pr-4 py-3.5 bg-white border ${goalError ? "border-red-400 bg-red-50/30 text-red-900" : "border-setu-200 text-setu-950"} rounded-xl text-sm placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors`}
                            />
                          </div>
                          <div className="flex gap-2 flex-wrap mt-3">
                            {[50000, 100000, 150000, 200000].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => { set("goal", String(amt)); handleBlur("goal"); }}
                                className={[
                                  "px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-150 cursor-pointer",
                                  form.goal === String(amt)
                                    ? "bg-setu-700 text-white border-setu-700"
                                    : "bg-white text-setu-700 border-setu-200 hover:border-setu-400",
                                ].join(" ")}
                              >
                                {amt >= 100000
                                  ? `${amt / 100000}L`
                                  : `${amt / 1000}K`}
                              </button>
                            ))}
                          </div>
                          <p className={`text-[11px] mt-2 ${goalError ? "text-red-500 font-medium" : "text-gray-400"}`}>
                            {goalError || "Minimum NPR 10,000 and Maximum NPR 2,00,000."}
                          </p>
                        </div>

                        {/* Preview */}
                        {form.name && form.category && (
                          <div className="bg-setu-50 border border-setu-100 rounded-2xl p-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-setu-500 mb-3">
                              Preview
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-setu-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {avatarPreview ? (
                                  <img
                                    src={avatarPreview}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Users className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[15px] font-bold text-setu-950 truncate">
                                  {form.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {form.location && (
                                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                      <MapPin className="w-3 h-3" />
                                      {form.location}
                                    </span>
                                  )}
                                  {form.category && (
                                    <span
                                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${categories.find((c) => c.key === form.category)?.bg} ${categories.find((c) => c.key === form.category)?.color}`}
                                    >
                                      {
                                        categories.find(
                                          (c) => c.key === form.category,
                                        )?.label
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* ════ STEP 3 ════ */}
                    {step === 3 && (
                      <>
                        <div className="bg-setu-50 border border-setu-100 rounded-2xl p-5 mb-2">
                          <p className="text-[13px] font-semibold text-setu-800 mb-0.5">
                            Almost there! Invite your first members.
                          </p>
                          <p className="text-[12px] text-setu-600/70 leading-relaxed">
                            Enter email addresses of people you'd like to
                            invite. They'll receive a personalised invite from
                            Setu. You can skip this and invite later.
                          </p>
                        </div>

                        {/* Emails */}
                        <div>
                          <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-3">
                            Invite by Email{" "}
                            <span className="text-gray-400 normal-case font-normal tracking-normal">
                              (optional)
                            </span>
                          </label>
                          <div className="space-y-3">
                            {form.emails.map((email, i) => (
                              <div
                                key={i}
                                className={`relative rounded-xl transition-all duration-200 ${focused === `email-${i}` ? "ring-2 ring-setu-500/30" : ""}`}
                              >
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) =>
                                    updateEmail(i, e.target.value)
                                  }
                                  onFocus={() => setFocused(`email-${i}`)}
                                  onBlur={() => setFocused(null)}
                                  placeholder={`teammate${i + 1}@example.com`}
                                  className="w-full pl-4 pr-10 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
                                />
                                {form.emails.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeEmail(i)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer border-none"
                                  >
                                    <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          {form.emails.length < 10 && (
                            <button
                              type="button"
                              onClick={addEmail}
                              className="flex items-center gap-2 mt-3 text-[13px] font-semibold text-setu-600 hover:text-setu-500 transition-colors cursor-pointer border-none bg-transparent"
                            >
                              <Plus className="w-4 h-4" /> Add another email
                            </button>
                          )}
                        </div>

                        {/* Summary */}
                        <div className="bg-white border border-setu-100 rounded-2xl overflow-hidden">
                          <div className="px-5 py-3 bg-setu-50 border-b border-setu-100">
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-setu-500">
                              Team Summary
                            </p>
                          </div>
                          <div className="divide-y divide-setu-50">
                            {[
                              { label: "Name", value: form.name },
                              { label: "Location", value: form.location },
                              {
                                label: "Category",
                                value: categories.find(
                                  (c) => c.key === form.category,
                                )?.label,
                              },
                              {
                                label: "Goal",
                                value: form.goal
                                  ? `NPR ${Number(form.goal).toLocaleString()}`
                                  : "—",
                              },
                              {
                                label: "Visibility",
                                value:
                                  form.privacy === "public"
                                    ? "Public"
                                    : "Private",
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="flex items-center justify-between px-5 py-3"
                              >
                                <span className="text-[12px] text-gray-400 font-medium">
                                  {label}
                                </span>
                                <span className="text-[13px] font-semibold text-setu-900">
                                  {value || "—"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-6 border-t border-setu-50 bg-setu-50/30 flex items-center justify-between gap-4">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        disabled={submitting}
                        className="flex items-center gap-2 px-5 py-3 border border-setu-200 text-setu-700 text-sm font-semibold rounded-xl hover:bg-setu-50 transition-colors cursor-pointer bg-white disabled:opacity-50"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s + 1)}
                        disabled={step === 1 ? !canNext1 : !canNext2}
                        className="flex items-center gap-2 px-7 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer border-none"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-7 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed cursor-pointer border-none"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{" "}
                            Creating team…
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" /> Create Team
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
