"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Eye,
  EyeOff,
  Save,
  Heart,
  Trophy,
  Megaphone,
  TrendingUp,
  Check,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"profile" | "password">("profile");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const stats = [
    {
      icon: Heart,
      label: "Total Donated",
      value: "NPR 24,500",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: Megaphone,
      label: "Campaigns",
      value: "3",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Trophy,
      label: "Donations Made",
      value: "12",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: TrendingUp,
      label: "Impact Score",
      value: "#142",
      color: "text-setu-600",
      bg: "bg-setu-50",
    },
  ];

  return (
    <div
      className="min-h-screen bg-cream py-12 px-4"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-2">
            <div className="w-5 h-[2px] bg-setu-500 rounded" />
            Account
          </div>
          <h1
            className="text-[clamp(28px,4vw,38px)] font-bold text-setu-950 tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Profile
          </h1>
        </div>

        {/* Avatar + stats card */}
        <div className="bg-white rounded-3xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-setu-100">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-setu-700 flex items-center justify-center shadow-[0_4px_16px_rgba(21,104,57,0.25)]">
                <span className="text-[28px] font-bold text-white">
                  {initials}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-setu-200 flex items-center justify-center hover:bg-setu-50 transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5 text-setu-600" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2
                className="text-[22px] font-bold text-setu-950 truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {user?.name || "—"}
              </h2>
              <p className="text-[14px] text-setu-600/70 mt-0.5">
                {user?.email || "—"}
              </p>
              {user?.role === "admin" && (
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-setu-700 text-white text-[11px] font-bold rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div
                  className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <p
                  className="text-[18px] font-bold text-setu-950"
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
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-3xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-setu-100">
            {(["profile", "password"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "flex-1 py-4 text-[13px] font-semibold transition-colors capitalize cursor-pointer border-none",
                  tab === t
                    ? "text-setu-700 border-b-2 border-setu-600 bg-setu-50/50"
                    : "text-gray-500 hover:text-setu-700 hover:bg-gray-50 bg-transparent",
                ].join(" ")}
              >
                {t === "profile" ? "Edit Profile" : "Change Password"}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === "profile" ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      disabled={!editMode}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 focus:outline-none focus:border-setu-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      disabled={!editMode}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 focus:outline-none focus:border-setu-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-3 bg-setu-700 hover:bg-setu-600 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] cursor-pointer border-none"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer border-none"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                          </>
                        ) : saved ? (
                          <>
                            <Check className="w-4 h-4" /> Saved!
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 border border-setu-200 text-setu-700 text-sm font-semibold rounded-xl hover:bg-setu-50 transition-colors cursor-pointer bg-transparent"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {[
                  {
                    key: "current",
                    label: "Current Password",
                    placeholder: "Enter current password",
                  },
                  {
                    key: "next",
                    label: "New Password",
                    placeholder: "Enter new password",
                  },
                  {
                    key: "confirm",
                    label: "Confirm New Password",
                    placeholder: "Re-enter new password",
                  },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                      {label}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={pwForm[key as keyof typeof pwForm]}
                        onChange={(e) =>
                          setPwForm({ ...pwForm, [key]: e.target.value })
                        }
                        placeholder={placeholder}
                        className="w-full pl-11 pr-12 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
                      />
                      {key === "current" && (
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
                      )}
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] cursor-pointer border-none mt-2">
                  <Lock className="w-4 h-4" /> Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
