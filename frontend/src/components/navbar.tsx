"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  User,
  LayoutDashboard,
  Megaphone,
  Trophy,
  Settings,
  LogOut,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

const navLinks = [
  { label: "Campaigns", href: "/campaigns" },
  { label: "Teams", href: "/teams" },
  {
    label: "Donate",
    href: "#",
    children: [
      {
        label: "Money Donation",
        sub: "Send funds directly",
        href: "/donations",
      },
      {
        label: "Goods Donation",
        sub: "Rice, clothes, medicine",
        href: "/donations/goods",
      },
      {
        label: "Emergency Relief",
        sub: "Disaster response",
        href: "/campaigns?category=emergency",
      },
    ],
  },
  { label: "Hall of Fame", href: "/hall-of-fame" },
  { label: "How It Works", href: "/how-it-works" },
];

// ── Setu bridge logo ──────────────────────────────────────────
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

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openDD = (label: string) => {
    if (timer.current) clearTimeout(timer.current);
    setActiveDropdown(label);
  };
  const closeDD = () => {
    timer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("User");
    setActiveDropdown(null);
    setMobileOpen(false);
    router.replace("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <div className="h-[68px]" />

      <header
        className={[
          "fixed top-0 left-0 right-0 z-[1000] h-[68px]",
          "transition-all duration-300 backdrop-blur-xl",
          scrolled
            ? "bg-white/95 border-b border-setu-700/10 shadow-[0_2px_16px_rgba(21,104,57,0.08)]"
            : "bg-white/70 border-b border-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline flex-shrink-0 group"
          >
            <SetuLogo size={44} />
            <span
              className="text-[1.5rem] font-bold text-setu-950 leading-none tracking-[-0.3px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Setu
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => openDD(link.label)}
                  onMouseLeave={closeDD}
                >
                  <button
                    className={[
                      "flex items-center gap-1 px-3.5 py-2 rounded-lg",
                      "text-sm font-medium text-setu-800",
                      "hover:bg-setu-50 hover:text-setu-700",
                      "bg-transparent border-none cursor-pointer transition-colors duration-150",
                    ].join(" ")}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {link.label}
                    <ChevronDown
                      className={[
                        "w-3.5 h-3.5 transition-transform duration-200",
                        activeDropdown === link.label
                          ? "rotate-180"
                          : "rotate-0",
                      ].join(" ")}
                    />
                  </button>

                  {activeDropdown === link.label && (
                    <div
                      onMouseEnter={() => openDD(link.label)}
                      onMouseLeave={closeDD}
                      className={[
                        "absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2",
                        "min-w-[230px] z-[1001]",
                        "bg-white/98 backdrop-blur-2xl",
                        "border border-setu-700/10 rounded-2xl p-2",
                        "shadow-[0_20px_48px_rgba(21,104,57,0.14),0_4px_16px_rgba(0,0,0,0.06)]",
                      ].join(" ")}
                    >
                      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 rotate-45 w-3 h-3 bg-white border-l border-t border-setu-700/10" />
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-3 py-2.5 rounded-xl no-underline hover:bg-setu-50 transition-colors duration-150"
                        >
                          <span className="block text-sm font-semibold text-setu-950">
                            {child.label}
                          </span>
                          <span className="block text-xs text-setu-700/60 mt-0.5">
                            {child.sub}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={[
                    "px-3.5 py-2 rounded-lg text-sm font-medium text-setu-800",
                    "hover:bg-setu-50 hover:text-setu-700",
                    "no-underline whitespace-nowrap transition-colors duration-150",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* ── Desktop right — auth-aware ── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => openDD("user")}
                onMouseLeave={closeDD}
              >
                <button
                  className={[
                    "flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200",
                    activeDropdown === "user"
                      ? "bg-setu-50 border-setu-300"
                      : "bg-white border-setu-200 hover:border-setu-300 hover:bg-setu-50",
                  ].join(" ")}
                >
                  <div className="w-7 h-7 rounded-full bg-setu-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-white leading-none">
                      {initials}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-semibold text-setu-900 leading-none">
                      {user.name?.split(" ")[0]}
                    </p>
                    {user.role === "admin" && (
                      <p className="text-[10px] text-setu-500 font-medium leading-none mt-0.5">
                        Admin
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    className={[
                      "w-3.5 h-3.5 text-setu-500 transition-transform duration-200 ml-0.5",
                      activeDropdown === "user" ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>

                {activeDropdown === "user" && (
                  <div
                    onMouseEnter={() => openDD("user")}
                    onMouseLeave={closeDD}
                    className={[
                      "absolute top-[calc(100%+10px)] right-0 w-[240px] z-[1001]",
                      "bg-white border border-setu-100 rounded-2xl overflow-hidden",
                      "shadow-[0_20px_48px_rgba(21,104,57,0.14),0_4px_16px_rgba(0,0,0,0.06)]",
                    ].join(" ")}
                  >
                    {/* Header */}
                    <div className="px-4 py-4 bg-setu-50 border-b border-setu-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-setu-700 flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(21,104,57,0.25)]">
                          <span className="text-[13px] font-bold text-white">
                            {initials}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold text-setu-950 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-setu-600/70 truncate">
                            {user.email}
                          </p>
                        </div>
                        {user.role === "admin" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-setu-700 text-white text-[10px] font-bold rounded-full flex-shrink-0">
                            <BadgeCheck className="w-3 h-3" /> Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-2">
                      {user.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline hover:bg-setu-50 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-setu-100 flex items-center justify-center flex-shrink-0 group-hover:bg-setu-200 transition-colors">
                            <LayoutDashboard className="w-3.5 h-3.5 text-setu-700" />
                          </div>
                          <span className="text-[13px] font-semibold text-setu-900">
                            Admin Dashboard
                          </span>
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline hover:bg-setu-50 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                          <User className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <span className="text-[13px] font-semibold text-setu-900">
                          My Profile
                        </span>
                      </Link>

                      <Link
                        href="/my-campaigns"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline hover:bg-setu-50 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                          <Megaphone className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-[13px] font-semibold text-setu-900">
                          My Campaigns
                        </span>
                      </Link>

                      <Link
                        href="/my-donations"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline hover:bg-setu-50 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <span className="text-[13px] font-semibold text-setu-900">
                          My Donations
                        </span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline hover:bg-setu-50 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                          <Settings className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <span className="text-[13px] font-semibold text-setu-900">
                          Settings
                        </span>
                      </Link>

                      <div className="mx-2 my-1.5 h-px bg-setu-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group cursor-pointer border-none bg-transparent"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                          <LogOut className="w-3.5 h-3.5 text-red-500" />
                        </div>
                        <span className="text-[13px] font-semibold text-red-500">
                          Sign Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={[
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg",
                    "text-sm font-medium text-setu-700 hover:bg-setu-50",
                    "no-underline transition-colors duration-150",
                  ].join(" ")}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={[
                    "px-5 py-2.5 rounded-full",
                    "bg-setu-700 hover:bg-setu-600",
                    "text-white text-sm font-bold no-underline whitespace-nowrap",
                    "shadow-[0_4px_14px_rgba(21,104,57,0.35)] hover:shadow-[0_6px_22px_rgba(21,104,57,0.4)]",
                    "hover:-translate-y-px transition-all duration-200",
                  ].join(" ")}
                >
                  Start a Campaign
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={[
              "md:hidden flex items-center justify-center w-10 h-10 rounded-xl",
              "bg-transparent border border-setu-700/20 text-setu-700",
              "hover:bg-setu-50 cursor-pointer transition-colors flex-shrink-0",
            ].join(" ")}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div
            className={[
              "md:hidden absolute top-[68px] left-0 right-0",
              "bg-white/98 backdrop-blur-2xl",
              "border-b border-setu-700/10",
              "shadow-[0_16px_40px_rgba(21,104,57,0.1)]",
              "px-4 pt-3 pb-5 z-[999]",
              "max-h-[calc(100vh-68px)] overflow-y-auto",
            ].join(" ")}
          >
            {/* User strip */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-setu-50 rounded-2xl border border-setu-100">
                <div className="w-9 h-9 rounded-full bg-setu-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-white">
                    {initials}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-setu-950 truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-setu-600/70 truncate">
                    {user.email}
                  </p>
                </div>
                {user.role === "admin" && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-setu-700 text-white text-[10px] font-bold rounded-full flex-shrink-0">
                    <BadgeCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
            )}

            {/* Nav links */}
            <div className="flex flex-col gap-0.5 mb-3">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-widest text-setu-500">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-setu-800 hover:bg-setu-50 hover:text-setu-700 rounded-xl no-underline transition-colors duration-150"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-[15px] font-medium text-setu-800 hover:bg-setu-50 hover:text-setu-700 rounded-xl no-underline transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>

            {/* Bottom CTA */}
            <div className="flex flex-col gap-1.5 pt-3 border-t border-setu-700/10">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold text-setu-700 hover:bg-setu-50 rounded-xl no-underline transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold text-setu-800 hover:bg-setu-50 rounded-xl no-underline transition-colors"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    href="/my-campaigns"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold text-setu-800 hover:bg-setu-50 rounded-xl no-underline transition-colors"
                  >
                    <Megaphone className="w-4 h-4" /> My Campaigns
                  </Link>
                  <Link
                    href="/my-donations"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold text-setu-800 hover:bg-setu-50 rounded-xl no-underline transition-colors"
                  >
                    <Trophy className="w-4 h-4" /> My Donations
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold text-setu-800 hover:bg-setu-50 rounded-xl no-underline transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <div className="mx-2 my-1 h-px bg-setu-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold text-red-500 hover:bg-red-50 rounded-xl w-full text-left cursor-pointer border-none bg-transparent transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center py-3 text-sm font-semibold text-setu-700 border border-setu-700/25 rounded-full no-underline hover:bg-setu-50 transition-colors duration-150"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center py-3 text-sm font-bold text-white bg-setu-700 hover:bg-setu-600 rounded-full no-underline shadow-[0_4px_14px_rgba(21,104,57,0.3)] transition-all duration-200"
                  >
                    Start a Campaign
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  ); 
}
