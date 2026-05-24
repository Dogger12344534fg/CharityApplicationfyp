"use client";

import { useState, useEffect, useRef } from "react";
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
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import {
  useGetProfile,
  useUpdateProfile,
  useChangePassword,
  useUploadAvatar,
  useDeleteAccount,
} from "@/src/hooks/useProfile";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profileData, isLoading: loadingProfile } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAccountMutation = useDeleteAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"profile" | "password" | "danger">("profile");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const profile = profileData?.data;
  const stats = profile?.stats;

  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  
  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile?.user) {
      setForm({
        name: profile.user.name || "",
        email: profile.user.email || "",
      });
    }
  }, [profile]);

  const initials = profile?.user?.name
    ? profile.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileMutation.mutateAsync(form);
      toast.success("Profile updated successfully");
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    if (pwForm.next.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      });
      toast.success("Password changed successfully");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
      toast.success("Account deleted successfully");
      // Redirect to home after deletion
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success('Profile picture updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  };

  const displayStats = [
    {
      icon: Heart,
      label: "Total Donated",
      value: `NPR ${(stats?.totalDonated || 0).toLocaleString()}`,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: Megaphone,
      label: "Campaigns",
      value: (stats?.campaignsCount || 0).toString(),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Trophy,
      label: "Donations Made",
      value: (stats?.donationsCount || 0).toString(),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: TrendingUp,
      label: "Impact Score",
      value: `#${stats?.impactRank || 0}`,
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
              {profile?.user?.avatar?.url ? (
                <img
                  src={profile.user.avatar.url}
                  alt={profile.user.name}
                  className="w-20 h-20 rounded-full object-cover shadow-[0_4px_16px_rgba(21,104,57,0.25)]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-setu-700 flex items-center justify-center shadow-[0_4px_16px_rgba(21,104,57,0.25)]">
                  <span className="text-[28px] font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
              <button
                onClick={handleAvatarClick}
                disabled={uploadAvatarMutation.isPending}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-setu-200 flex items-center justify-center hover:bg-setu-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {uploadAvatarMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 text-setu-600 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-setu-600" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2
                className="text-[22px] font-bold text-setu-950 truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {loadingProfile ? (
                  <span className="inline-block w-32 h-6 bg-gray-100 rounded animate-pulse" />
                ) : (
                  profile?.user?.name || user?.name || "—"
                )}
              </h2>
              <p className="text-[14px] text-setu-600/70 mt-0.5">
                {loadingProfile ? (
                  <span className="inline-block w-48 h-4 bg-gray-100 rounded animate-pulse" />
                ) : (
                  profile?.user?.email || user?.email || "—"
                )}
              </p>
              {(profile?.user?.role || user?.role) === "admin" && (
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-setu-700 text-white text-[11px] font-bold rounded-full">
                  Admin
                </span>
              )}
              {profile?.user?.badge && (
                <span className={`inline-flex items-center gap-1 mt-2 ml-2 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                  profile.user.badge === 'gold' ? 'bg-amber-100 text-amber-700' :
                  profile.user.badge === 'silver' ? 'bg-gray-100 text-gray-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {profile.user.badge.charAt(0).toUpperCase() + profile.user.badge.slice(1)} Donor
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {loadingProfile
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse">
                    <div className="w-9 h-9 bg-gray-200 rounded-xl mx-auto mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-16 mx-auto mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-20 mx-auto" />
                  </div>
                ))
              : displayStats.map(({ icon: Icon, label, value, color, bg }) => (
                  <div
                    key={label}
                    className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`w-4 h-4 ${color}`} />
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
            {(["profile", "password", "danger"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "flex-1 py-4 text-[13px] font-semibold transition-colors capitalize cursor-pointer border-none",
                  tab === t
                    ? t === "danger"
                      ? "text-red-600 border-b-2 border-red-500 bg-red-50/50"
                      : "text-setu-700 border-b-2 border-setu-600 bg-setu-50/50"
                    : t === "danger"
                      ? "text-red-400 hover:text-red-600 hover:bg-red-50/30 bg-transparent"
                      : "text-gray-500 hover:text-setu-700 hover:bg-gray-50 bg-transparent",
                ].join(" ")}
              >
                {t === "profile" ? "Edit Profile" : t === "password" ? "Change Password" : "Delete Account"}
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
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                          <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                        ) : saved ? (
                          <><Check className="w-4 h-4" /> Saved!</>
                        ) : (
                          <><Save className="w-4 h-4" /> Save Changes</>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setForm({
                            name: profile?.user?.name || "",
                            email: profile?.user?.email || "",
                          });
                        }}
                        className="px-6 py-3 border border-setu-200 text-setu-700 text-sm font-semibold rounded-xl hover:bg-setu-50 transition-colors cursor-pointer bg-transparent"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : tab === "password" ? (
              <div className="space-y-5">
                {[
                  { key: "current", label: "Current Password", placeholder: "Enter current password" },
                  { key: "next", label: "New Password", placeholder: "Enter new password" },
                  { key: "confirm", label: "Confirm New Password", placeholder: "Re-enter new password" },
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
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full pl-11 pr-12 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
                      />
                      {key === "current" && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-setu-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handlePasswordChange}
                  disabled={changePasswordMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] cursor-pointer border-none mt-2"
                >
                  {changePasswordMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                  ) : changePasswordMutation.isSuccess ? (
                    <><Check className="w-4 h-4" /> Updated!</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Update Password</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-[13px] text-red-700 font-medium leading-snug">
                    This action is <strong>permanent</strong>. All your data, campaigns, and donation history will be deleted and cannot be recovered.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
                    Type <span className="text-red-500">DELETE</span> to confirm
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
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "DELETE" || deleteAccountMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer border-none disabled:cursor-not-allowed"
                >
                  {deleteAccountMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                  ) : (
                    <><Trash2 className="w-4 h-4" /> Permanently Delete Account</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
