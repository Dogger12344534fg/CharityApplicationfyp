"use client";

import { useState } from "react";
import {
  Lock,
  Bell,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Check,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const [section, setSection] = useState<
    "password" | "notifications" | "privacy" | "danger"
  >("password");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [notifs, setNotifs] = useState({
    donationUpdates: true,
    campaignMilestones: true,
    newCampaigns: false,
    weeklyDigest: true,
    smsAlerts: false,
  });
  const [privacy, setPrivacy] = useState({
    showDonations: true,
    showCampaigns: true,
    showOnLeaderboard: true,
    allowContactByOrgs: false,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const navItems = [
    {
      key: "password",
      label: "Change Password",
      icon: Lock,
      desc: "Update your login credentials",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: Bell,
      desc: "Email and SMS preferences",
    },
    {
      key: "privacy",
      label: "Privacy",
      icon: Shield,
      desc: "Control your visibility",
    },
    {
      key: "danger",
      label: "Delete Account",
      icon: Trash2,
      desc: "Permanently remove your data",
      danger: true,
    },
  ] as const;

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={[
        "relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 border-none cursor-pointer",
        checked ? "bg-setu-600" : "bg-gray-200",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200",
          checked ? "left-5" : "left-0.5",
        ].join(" ")}
      />
    </button>
  );

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
            Settings
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar nav */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] p-2">
              {navItems.map(({ key, label, icon: Icon, desc, danger }) => (
                <button
                  key={key}
                  onClick={() => setSection(key)}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer border-none",
                    section === key
                      ? danger
                        ? "bg-red-50 text-red-600"
                        : "bg-setu-50 text-setu-700"
                      : danger
                        ? "hover:bg-red-50 text-red-500 bg-transparent"
                        : "hover:bg-setu-50 text-setu-800 bg-transparent",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      section === key
                        ? danger
                          ? "bg-red-100"
                          : "bg-setu-100"
                        : danger
                          ? "bg-red-50"
                          : "bg-gray-100",
                    ].join(" ")}
                  >
                    <Icon
                      className={`w-4 h-4 ${danger ? "text-red-500" : section === key ? "text-setu-700" : "text-gray-500"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[13px] font-semibold ${danger ? "text-red-500" : ""}`}
                    >
                      {label}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{desc}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 ${section === key ? "opacity-100" : "opacity-0"} ${danger ? "text-red-400" : "text-setu-400"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main panel */}
          <div className="flex-1 bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] overflow-hidden">
            {/* ── Change Password ── */}
            {section === "password" && (
              <div className="p-8">
                <h2
                  className="text-[18px] font-bold text-setu-950 mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Change Password
                </h2>
                <p className="text-[13px] text-gray-500 mb-7">
                  Use a strong password to keep your account secure.
                </p>

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
                      placeholder: "At least 8 characters",
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
                          type={showPw ? "text" : "password"}
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
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-setu-600 transition-colors border-none bg-transparent cursor-pointer"
                          >
                            {showPw ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                    <p className="text-xs text-red-500 font-medium">
                      Passwords do not match
                    </p>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={
                      saving ||
                      (!!pwForm.confirm && pwForm.next !== pwForm.confirm)
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer border-none mt-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating…
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-4 h-4" /> Updated!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── Notifications ── */}
            {section === "notifications" && (
              <div className="p-8">
                <h2
                  className="text-[18px] font-bold text-setu-950 mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Notifications
                </h2>
                <p className="text-[13px] text-gray-500 mb-7">
                  Choose what updates you receive from Setu.
                </p>

                <div className="space-y-1">
                  {[
                    {
                      key: "donationUpdates",
                      label: "Donation updates",
                      desc: "When your donations are processed or campaigns reach milestones",
                    },
                    {
                      key: "campaignMilestones",
                      label: "Campaign milestones",
                      desc: "Progress updates for campaigns you've supported",
                    },
                    {
                      key: "newCampaigns",
                      label: "New campaigns",
                      desc: "Alerts when new verified campaigns are added",
                    },
                    {
                      key: "weeklyDigest",
                      label: "Weekly digest",
                      desc: "A summary of your impact and top campaigns every week",
                    },
                    {
                      key: "smsAlerts",
                      label: "SMS alerts",
                      desc: "Critical emergency alerts via SMS (Nepal only)",
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 py-4 border-b border-setu-50 last:border-none"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-setu-950">
                          {label}
                        </p>
                        <p className="text-[12px] text-gray-500 mt-0.5">
                          {desc}
                        </p>
                      </div>
                      <Toggle
                        checked={notifs[key as keyof typeof notifs]}
                        onChange={() =>
                          setNotifs((n) => ({
                            ...n,
                            [key]: !n[key as keyof typeof notifs],
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer border-none mt-6"
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
                      <Save className="w-4 h-4" /> Save Preferences
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── Privacy ── */}
            {section === "privacy" && (
              <div className="p-8">
                <h2
                  className="text-[18px] font-bold text-setu-950 mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Privacy
                </h2>
                <p className="text-[13px] text-gray-500 mb-7">
                  Control how your activity appears on Setu.
                </p>

                <div className="space-y-1">
                  {[
                    {
                      key: "showDonations",
                      label: "Show my donations publicly",
                      desc: "Let others see your donation history on your public profile",
                    },
                    {
                      key: "showCampaigns",
                      label: "Show my campaigns publicly",
                      desc: "Display campaigns you've created on your public profile",
                    },
                    {
                      key: "showOnLeaderboard",
                      label: "Appear on Hall of Fame",
                      desc: "Include your name in the top donor leaderboard",
                    },
                    {
                      key: "allowContactByOrgs",
                      label: "Allow organisations to contact me",
                      desc: "Let verified charities reach out about campaigns",
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 py-4 border-b border-setu-50 last:border-none"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-setu-950">
                          {label}
                        </p>
                        <p className="text-[12px] text-gray-500 mt-0.5">
                          {desc}
                        </p>
                      </div>
                      <Toggle
                        checked={privacy[key as keyof typeof privacy]}
                        onChange={() =>
                          setPrivacy((p) => ({
                            ...p,
                            [key]: !p[key as keyof typeof privacy],
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer border-none mt-6"
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
                      <Save className="w-4 h-4" /> Save Settings
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── Delete Account ── */}
            {section === "danger" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-[13px] text-red-700 font-medium leading-snug">
                    This action is <strong>permanent</strong>. All your data,
                    campaigns, and donation history will be deleted and cannot
                    be recovered.
                  </p>
                </div>

                <h2
                  className="text-[18px] font-bold text-setu-950 mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Delete Account
                </h2>
                <p className="text-[13px] text-gray-500 mb-7">
                  To confirm deletion, type{" "}
                  <span className="font-bold text-red-500">DELETE</span> below.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                      Type DELETE to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="DELETE"
                      className="w-full px-4 py-3.5 bg-white border border-red-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors"
                    />
                  </div>
                  <button
                    disabled={deleteConfirm !== "DELETE"}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer border-none disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" /> Permanently Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
