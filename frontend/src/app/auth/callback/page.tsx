"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userRaw = searchParams.get("user");
    const error = searchParams.get("error");

    if (error || !token || !userRaw) {
      router.replace("/login?error=google_auth_failed");
      return;
    }

    try {
      const user = JSON.parse(userRaw);

      localStorage.setItem("token", token);
      localStorage.setItem("User", JSON.stringify(user));

      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch {
      router.replace("/login?error=google_auth_failed");
    }
  }, [searchParams, router]);

  return (
    <div
      className="min-h-screen bg-cream flex flex-col items-center justify-center gap-5"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 rounded-full border-4 border-setu-100 border-t-setu-500 animate-spin absolute" />
        <Heart className="absolute inset-0 m-auto w-6 h-6 text-setu-500" />
      </div>
      <div className="text-center">
        <p className="text-[16px] font-bold text-setu-950 mb-1">
          Signing you in…
        </p>
        <p className="text-[13px] text-gray-400">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
}
