import Link from "next/link";
import {
  Search,
  Heart,
  Eye,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Package,
  Users,
  CheckCircle,
  CreditCard,
  Smartphone,
  FileText,
  Bell,
  TrendingUp,
  Globe,
  Clock,
  Star,
  MessageCircle,
} from "lucide-react";

const donorSteps = [
  {
    n: "01",
    icon: Search,
    title: "Browse Campaigns",
    desc: "Search through verified campaigns by category, location, or urgency. Every campaign is reviewed by our team before going live.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    n: "02",
    icon: Heart,
    title: "Choose How to Give",
    desc: "Donate money via card, eSewa, Khalti, or bank transfer — or donate physical goods like rice, medicine, clothes, and shelter supplies.",
    color: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "All transactions are 256-bit SSL encrypted. Your financial information is never stored on our servers. We partner with Nepal's most trusted payment providers.",
    color: "bg-setu-50",
    iconColor: "text-setu-600",
  },
  {
    n: "04",
    icon: Eye,
    title: "Track Real-Time Impact",
    desc: "Get instant confirmation and a donation receipt. Track exactly how your money is being used through live updates, photos, and progress reports from campaign organizers.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const campaignerSteps = [
  {
    n: "01",
    icon: FileText,
    title: "Create Your Campaign",
    desc: "Fill in your campaign details — cause description, target amount, timeline, and verification documents. Our team reviews within 24 hours.",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    n: "02",
    icon: CheckCircle,
    title: "Get Verified",
    desc: "We verify your identity, cause legitimacy, and documentation. Verified campaigns receive a badge, increasing donor trust and contributions significantly.",
    color: "bg-setu-50",
    iconColor: "text-setu-600",
  },
  {
    n: "03",
    icon: Globe,
    title: "Share & Reach Donors",
    desc: "Your campaign is live! Share via social media, WhatsApp, or let Setu's recommendation engine surface it to relevant donors across Nepal and the diaspora.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Receive Funds",
    desc: "Funds are released to your verified bank account on a scheduled basis, or all at once upon campaign completion. Fully transparent, zero hidden fees.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const faqs = [
  {
    q: "Is Setu free to use?",
    a: "Yes, Setu is completely free for donors. Campaign creators pay a small platform fee of 3% which covers payment processing and operational costs.",
  },
  {
    q: "How are campaigns verified?",
    a: "Our team manually reviews every campaign. We verify identity documents, cause legitimacy, and supporting evidence before any campaign goes live on the platform.",
  },
  {
    q: "Can I donate from outside Nepal?",
    a: "Absolutely. We accept international card payments and bank transfers. Many Nepali diaspora members regularly support campaigns through Setu.",
  },
  {
    q: "What goods can I donate?",
    a: "We accept rice, food items, clothing, blankets, medicine, first aid kits, tents, and shelter materials. We coordinate pickup and distribution to affected areas.",
  },
  {
    q: "How fast are funds released?",
    a: "Standard campaigns receive weekly disbursements. Emergency campaigns can receive express 24-hour releases upon verification.",
  },
  {
    q: "Can I get a donation receipt?",
    a: "Yes, every donor receives an instant digital receipt via email. We also provide annual summary receipts for tax documentation.",
  },
];

export default function HowItWorksPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── HERO ── */}
      <section className="bg-white border-b border-setu-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-5">
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
            Simple & Transparent
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
          </div>
          <h1
            className="text-[clamp(36px,5vw,60px)] font-bold text-setu-950 leading-tight tracking-[-1.5px] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How Setu Works
          </h1>
          <p className="text-[17px] text-setu-800/55 leading-[1.75] max-w-xl mx-auto mb-10">
            Whether you're a donor or a campaign creator, Setu makes giving
            simple, transparent, and impactful.
          </p>

          {/* Role toggle */}
          <div className="flex gap-3 justify-center">
            <Link
              href="#donors"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_6px_20px_rgba(21,104,57,0.3)] transition-all hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4" />I Want to Donate
            </Link>
            <Link
              href="#campaigners"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-setu-200 hover:border-setu-400 text-setu-700 text-[14px] font-semibold rounded-full no-underline transition-all"
            >
              <Zap className="w-4 h-4" />I Have a Campaign
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-setu-900">
        {[
          { icon: TrendingUp, num: "NPR 2.4Cr+", label: "Total Raised" },
          { icon: Heart, num: "1,200+", label: "Campaigns Funded" },
          { icon: Users, num: "18,400+", label: "Active Donors" },
          { icon: Clock, num: "< 24h", label: "Avg Verification" },
        ].map(({ icon: Icon, num, label }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 px-6 lg:px-8 py-8 ${i < 3 ? "border-r border-white/[0.07]" : ""} hover:bg-white/[0.03] transition-colors`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-setu-300" />
            </div>
            <div>
              <p
                className="text-[22px] lg:text-[26px] font-bold text-white leading-none mb-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {num}
              </p>
              <p className="text-[11px] text-white/40 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FOR DONORS ── */}
      <section className="py-20 bg-cream" id="donors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full mb-4">
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[12px] font-bold text-red-700 uppercase tracking-wide">
                For Donors
              </span>
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Donate in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-setu-100 via-setu-300 to-setu-100 pointer-events-none z-0" />

            {donorSteps.map(
              ({ n, icon: Icon, title, desc, color, iconColor }) => (
                <div
                  key={n}
                  className="relative z-10 bg-white rounded-2xl p-7 border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_12px_32px_rgba(21,104,57,0.1)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <span
                      className="text-[44px] font-black text-setu-100 leading-none select-none"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {n}
                    </span>
                  </div>
                  <h3
                    className="text-[17px] font-bold text-setu-950 mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-[1.7]">
                    {desc}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section className="py-14 bg-white border-y border-setu-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3
            className="text-[18px] font-bold text-setu-950 text-center mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Accepted Payment Methods
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              {
                icon: CreditCard,
                label: "Visa / Mastercard",
                sub: "International cards",
              },
              { icon: Smartphone, label: "eSewa", sub: "Nepal's #1 wallet" },
              { icon: Smartphone, label: "Khalti", sub: "Digital payments" },
              {
                icon: CreditCard,
                label: "Bank Transfer",
                sub: "All Nepali banks",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-5 bg-setu-50 border border-setu-100 rounded-2xl text-center"
              >
                <div className="w-10 h-10 bg-white rounded-xl border border-setu-100 flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-setu-600" />
                </div>
                <p className="text-[13px] font-bold text-setu-900">{label}</p>
                <p className="text-[11px] text-setu-600/55">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR CAMPAIGNERS ── */}
      <section className="py-20 bg-setu-50" id="campaigners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-setu-50 border border-setu-200 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5 text-setu-600" />
              <span className="text-[12px] font-bold text-setu-700 uppercase tracking-wide">
                For Campaigners
              </span>
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Launch Your Campaign
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaignerSteps.map(
              ({ n, icon: Icon, title, desc, color, iconColor }) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl p-7 border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_12px_32px_rgba(21,104,57,0.1)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <span
                      className="text-[44px] font-black text-setu-100 leading-none select-none"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {n}
                    </span>
                  </div>
                  <h3
                    className="text-[17px] font-bold text-setu-950 mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-[1.7]">
                    {desc}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-16 items-start">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-5 h-[2px] bg-setu-500 rounded" />
                FAQ
              </div>
              <h2
                className="text-[clamp(28px,3.5vw,42px)] font-bold text-setu-950 leading-tight tracking-[-0.5px] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Common
                <br />
                Questions
              </h2>
              <p className="text-[14px] text-setu-800/50 leading-[1.75] mb-8">
                Still have questions? We're here to help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)]"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </div>

            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <div
                  key={q}
                  className="bg-setu-50 rounded-2xl border border-setu-100 p-6 hover:shadow-[0_4px_16px_rgba(21,104,57,0.07)] transition-shadow"
                >
                  <h4
                    className="text-[15px] font-bold text-setu-950 mb-2.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {q}
                  </h4>
                  <p className="text-[14px] text-gray-500 leading-[1.7]">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-setu-950 relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 rounded-[28px] mb-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,160,91,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center px-6">
          <h2
            className="text-[clamp(32px,4vw,52px)] font-bold text-white leading-[1.07] tracking-[-1px] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Make a<br />
            <em className="italic text-setu-400">Real Difference?</em>
          </h2>
          <p className="text-[16px] text-white/45 mb-10 leading-[1.75]">
            Join 18,400+ donors already changing lives across Nepal.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-setu-500 hover:bg-setu-400 text-white text-[15px] font-bold rounded-full no-underline shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:-translate-y-0.5 transition-all"
            >
              Start a Campaign <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.07] border border-white/15 hover:bg-white/[0.12] text-white/80 hover:text-white text-[15px] font-semibold rounded-full no-underline transition-all"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
