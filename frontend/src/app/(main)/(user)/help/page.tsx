// ═══════════════════════════════════════════════
// HELP CENTER PAGE — app/(main)/help/page.tsx
// ═══════════════════════════════════════════════
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Heart,
  Package,
  ShieldCheck,
  CreditCard,
  Users,
  MessageCircle,
  Phone,
  Mail,
  Zap,
} from "lucide-react";

const categories = [
  {
    icon: Heart,
    title: "Donating",
    count: 14,
    color: "text-red-600",
    bg: "bg-red-50",
    href: "/help/donating",
  },
  {
    icon: Zap,
    title: "Campaigns",
    count: 18,
    color: "text-orange-600",
    bg: "bg-orange-50",
    href: "/help/campaigns",
  },
  {
    icon: Package,
    title: "Goods Donation",
    count: 9,
    color: "text-amber-600",
    bg: "bg-amber-50",
    href: "/help/goods",
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    count: 12,
    color: "text-blue-600",
    bg: "bg-blue-50",
    href: "/help/payments",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Trust",
    count: 8,
    color: "text-setu-600",
    bg: "bg-setu-50",
    href: "/help/safety",
  },
  {
    icon: Users,
    title: "Account & Profile",
    count: 11,
    color: "text-purple-600",
    bg: "bg-purple-50",
    href: "/help/account",
  },
];

const popular = [
  { q: "How do I start a campaign on Setu?", href: "/help/start-campaign" },
  {
    q: "How long does campaign verification take?",
    href: "/help/verification",
  },
  { q: "Can I get a refund on my donation?", href: "/help/refunds" },
  {
    q: "How do I donate goods instead of money?",
    href: "/help/goods-donation",
  },
  {
    q: "How are funds disbursed to campaign creators?",
    href: "/help/disbursement",
  },
  { q: "Is eSewa and Khalti supported?", href: "/help/payment-methods" },
  {
    q: "How do I verify my identity for a campaign?",
    href: "/help/id-verification",
  },
  { q: "Can I donate from outside Nepal?", href: "/help/international" },
];

export function HelpPage() {
  const [query, setQuery] = useState("");
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Hero */}
      <section className="bg-setu-900 py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(34,160,91,0.2) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1
            className="text-[clamp(32px,5vw,56px)] font-bold text-white leading-tight tracking-[-1.5px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How can we help?
          </h1>
          <p className="text-[16px] text-white/50 mb-8">
            Search our help center or browse by topic.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-setu-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white border-2 border-transparent focus:border-setu-400 rounded-full text-[15px] text-setu-900 placeholder:text-setu-400 focus:outline-none focus:ring-2 focus:ring-setu-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <h2
            className="text-[20px] font-bold text-setu-950 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Browse by Topic
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {categories.map(({ icon: Icon, title, count, color, bg, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-setu-100 hover:border-setu-300 hover:shadow-[0_6px_20px_rgba(21,104,57,0.1)] hover:-translate-y-1 transition-all duration-200 no-underline text-center"
              >
                <div
                  className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-setu-950 group-hover:text-setu-700 transition-colors">
                    {title}
                  </p>
                  <p className="text-[11px] text-setu-600/55">
                    {count} articles
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            {/* Popular */}
            <div>
              <h2
                className="text-[20px] font-bold text-setu-950 mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Popular Questions
              </h2>
              <div className="space-y-2">
                {popular.map(({ q, href }) => (
                  <Link
                    key={q}
                    href={href}
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-setu-100 hover:border-setu-300 hover:shadow-[0_4px_14px_rgba(21,104,57,0.08)] transition-all no-underline"
                  >
                    <div className="w-8 h-8 bg-setu-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-setu-100 transition-colors">
                      <MessageCircle className="w-4 h-4 text-setu-600" />
                    </div>
                    <span className="flex-1 text-[14px] font-medium text-setu-800 group-hover:text-setu-700 transition-colors">
                      {q}
                    </span>
                    <ChevronRight className="w-4 h-4 text-setu-300 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact support */}
            <div className="space-y-4">
              <h2
                className="text-[20px] font-bold text-setu-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Still Need Help?
              </h2>
              {[
                {
                  icon: MessageCircle,
                  title: "Live Chat",
                  sub: "Usually replies in 5 minutes",
                  cta: "Start Chat",
                  href: "#",
                  available: true,
                },
                {
                  icon: Mail,
                  title: "Email Support",
                  sub: "We reply within 24 hours",
                  cta: "Send Email",
                  href: "mailto:hello@setu.np",
                  available: true,
                },
                {
                  icon: Phone,
                  title: "Phone Support",
                  sub: "Mon–Fri, 9am–5pm NPT",
                  cta: "+977 01-000-0000",
                  href: "tel:+97701000000",
                  available: false,
                },
              ].map(({ icon: Icon, title, sub, cta, href, available }) => (
                <a
                  key={title}
                  href={href}
                  className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-setu-100 hover:border-setu-300 hover:shadow-[0_6px_20px_rgba(21,104,57,0.1)] transition-all no-underline"
                >
                  <div className="w-12 h-12 bg-setu-700 group-hover:bg-setu-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-setu-950">
                      {title}
                    </p>
                    <p className="text-[12px] text-setu-600/55 mt-0.5">{sub}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${available ? "bg-setu-400" : "bg-gray-300"}`}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpPage;
