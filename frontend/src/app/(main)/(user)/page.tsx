import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Heart,
  Users,
  Package,
  Search,
  Zap,
  ShieldCheck,
  Eye,
  Trophy,
  Wheat,
  Shirt,
  Pill,
  Tent,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { CampaignCard, AllCampaignCard } from "@/src/components/campaign-card";

const campaigns = [
  {
    id: "1",
    title: "Koshi Flood Relief 2024 — Immediate Aid for 500+ Families",
    desc: "Immediate assistance for families who lost everything. Providing shelter, food, and essentials for over 500 families in eastern Nepal.",
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=85&auto=format&fit=crop",
    raised: 362000,
    goal: 500000,
    donors: 2234,
    cat: "Emergency",
    catClass: "emergency",
    urgent: true,
    featured: true,
    location: "Eastern Nepal",
  },
  {
    id: "2",
    title: "Help Sunita Beat Cancer",
    desc: "A 32-year-old mother needs treatment at Bir Hospital. Help her fight stage 3 breast cancer.",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80&auto=format&fit=crop",
    raised: 145000,
    goal: 275000,
    donors: 892,
    cat: "Medical",
    catClass: "medical",
    urgent: true,
    location: "Kathmandu",
  },
  {
    id: "3",
    title: "School for Dolakha Children",
    desc: "200+ kids walk 4 hours daily. Help build a school in this remote mountain village.",
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&q=80&auto=format&fit=crop",
    raised: 128000,
    goal: 250000,
    donors: 345,
    cat: "Education",
    catClass: "education",
    location: "Dolakha",
  },
  {
    id: "4",
    title: "Janakpur Food Bank Initiative",
    desc: "Feeding 500+ families facing food insecurity in Janakpur through a sustainable food bank.",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80&auto=format&fit=crop",
    raised: 88500,
    goal: 125000,
    donors: 412,
    cat: "Charity",
    catClass: "charity",
    location: "Janakpur",
  },
  {
    id: "5",
    title: "Kathmandu Animal Rescue Shelter",
    desc: "Renovating facilities to provide better care and medical attention for 300+ rescued animals.",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80&auto=format&fit=crop",
    raised: 65000,
    goal: 150000,
    donors: 267,
    cat: "Animals",
    catClass: "animals",
    location: "Kathmandu",
  },
];

export default function HomePage() {
  return (
    <div
      className="bg-cream text-setu-950"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <section className="bg-cream pt-7 pb-0 overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=60&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            opacity: 0.9,
            filter: "blur(0.5px) saturate(0.5)",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, #919391ff 85%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Top badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-setu-50 border border-setu-200 rounded-full ">
              <span className="w-2 h-2 rounded-full bg-setu-500 animate-pulse flex-shrink-0" />
              <span className="text-[13px] font-semibold text-setu-700 tracking-wide">
                Nepal&apos;s First Unified Donation Platform
              </span>
            </div>
          </div>

          <div
            className="relative hidden lg:flex items-center justify-center"
            style={{ height: "720px" }}
          >
            <div
              className="absolute rounded-full border-2 border-dashed border-setu-400 pointer-events-none"
              style={{ width: "900px", height: "900px" }}
            />
            <div
              className="absolute rounded-full border-2 border-dashed border-setu-400 pointer-events-none"
              style={{ width: "680px", height: "680px" }}
            />

            <Link
              href="/campaigns?category=emergency"
              className="absolute group flex flex-col items-center gap-2.5"
              style={{ right: "calc(50% + 270px)", top: "30px" }}
            >
              <div className="w-[178px] h-[178px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(21,104,57,0.15)] group-hover:border-orange-400 group-hover:shadow-[0_14px_44px_rgba(234,88,12,0.28)] transition-all duration-300 group-hover:-translate-y-2">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=356&q=85&auto=format&fit=crop"
                  alt="Emergency"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-setu-100 group-hover:border-orange-300 group-hover:shadow-md transition-all duration-200">
                <Zap className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span className="text-[13px] font-bold text-setu-800 group-hover:text-orange-700 transition-colors">
                  Emergency
                </span>
              </div>
            </Link>

            <Link
              href="/campaigns?category=medical"
              className="absolute group flex flex-col items-center gap-2.5"
              style={{
                right: "calc(50% + 310px)",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <div className="w-[178px] h-[178px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(21,104,57,0.15)] group-hover:border-red-400 group-hover:shadow-[0_14px_44px_rgba(239,68,68,0.28)] transition-all duration-300 group-hover:-translate-y-2">
                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=356&q=85&auto=format&fit=crop"
                  alt="Medical"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-setu-100 group-hover:border-red-300 group-hover:shadow-md transition-all duration-200">
                <Heart className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span className="text-[13px] font-bold text-setu-800 group-hover:text-red-700 transition-colors">
                  Medical
                </span>
              </div>
            </Link>

            <Link
              href="/campaigns?category=education"
              className="absolute group flex flex-col items-center gap-2.5"
              style={{ right: "calc(50% + 270px)", bottom: "30px" }}
            >
              <div className="w-[178px] h-[178px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(21,104,57,0.15)] group-hover:border-blue-400 group-hover:shadow-[0_14px_44px_rgba(59,130,246,0.28)] transition-all duration-300 group-hover:-translate-y-2">
                <img
                  src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=356&q=85&auto=format&fit=crop"
                  alt="Education"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-setu-100 group-hover:border-blue-300 group-hover:shadow-md transition-all duration-200">
                <Eye className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="text-[13px] font-bold text-setu-800 group-hover:text-blue-700 transition-colors">
                  Education
                </span>
              </div>
            </Link>

            <Link
              href="/campaigns?category=animals"
              className="absolute group flex flex-col items-center gap-2.5"
              style={{ left: "calc(50% + 270px)", top: "30px" }}
            >
              <div className="w-[178px] h-[178px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(21,104,57,0.15)] group-hover:border-purple-400 group-hover:shadow-[0_14px_44px_rgba(168,85,247,0.28)] transition-all duration-300 group-hover:-translate-y-2">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=356&q=85&auto=format&fit=crop"
                  alt="Animals"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-setu-100 group-hover:border-purple-300 group-hover:shadow-md transition-all duration-200">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span className="text-[13px] font-bold text-setu-800 group-hover:text-purple-700 transition-colors">
                  Animals
                </span>
              </div>
            </Link>

            <Link
              href="/campaigns?category=charity"
              className="absolute group flex flex-col items-center gap-2.5"
              style={{
                left: "calc(50% + 310px)",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <div className="w-[178px] h-[178px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(21,104,57,0.15)] group-hover:border-setu-500 group-hover:shadow-[0_14px_44px_rgba(42,165,88,0.28)] transition-all duration-300 group-hover:-translate-y-2">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=356&q=85&auto=format&fit=crop"
                  alt="Charity"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-setu-100 group-hover:border-setu-400 group-hover:shadow-md transition-all duration-200">
                <Users className="w-3.5 h-3.5 text-setu-500 flex-shrink-0" />
                <span className="text-[13px] font-bold text-setu-800 group-hover:text-setu-700 transition-colors">
                  Charity
                </span>
              </div>
            </Link>

            <Link
              href="/donations/goods"
              className="absolute group flex flex-col items-center gap-2.5"
              style={{ left: "calc(50% + 270px)", bottom: "30px" }}
            >
              <div className="w-[178px] h-[178px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(21,104,57,0.15)] group-hover:border-amber-400 group-hover:shadow-[0_14px_44px_rgba(245,158,11,0.28)] transition-all duration-300 group-hover:-translate-y-2">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=85&auto=format&fit=crop"
                  alt="Goods Donation"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-setu-100 group-hover:border-amber-300 group-hover:shadow-md transition-all duration-200">
                <Package className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-[13px] font-bold text-setu-800 group-hover:text-amber-700 transition-colors">
                  Goods
                </span>
              </div>
            </Link>

            <div className="relative z-10 text-center w-[480px] animate-fade-in-up-1">
              <h1
                className="text-[clamp(48px,4.5vw,72px)] font-bold leading-[1.02] tracking-[-2.5px] text-setu-950 mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Donate Hope.
                <br />
                <em className="italic text-setu-600">Change Nepal.</em>
              </h1>
              <p className="text-[16px] text-setu-950 font-semibold leading-[1.75] mb-9 px-4">
                Connect with causes that matter. Give money, donate goods, or
                start a campaign — every act of kindness matters.
              </p>
              <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-setu-700 hover:bg-setu-600 text-white text-[15px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_8px_24px_rgba(21,104,57,0.35)] hover:shadow-[0_12px_32px_rgba(21,104,57,0.45)] hover:-translate-y-0.5"
                >
                  Start a Campaign
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-setu-200 hover:border-setu-400 hover:bg-setu-50 text-setu-700 text-[15px] font-semibold rounded-full no-underline transition-all duration-200 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  Browse Campaigns
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:hidden pt-4 pb-2">
            <div className="text-center mb-8">
              <h1
                className="text-[clamp(40px,8vw,56px)] font-bold leading-[1.04] tracking-[-2px] text-setu-950 mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Donate Hope.
                <br />
                <em className="italic text-setu-600">Change Nepal.</em>
              </h1>
              <p className="text-[15px] text-setu-1000/50 leading-[1.75] mb-8 max-w-sm mx-auto">
                Connect with causes that matter. Give money, donate goods, or
                start a campaign.
              </p>
              <div className="flex items-center justify-center flex-wrap gap-3 mb-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_8px_24px_rgba(21,104,57,0.35)]"
                >
                  Start a Campaign <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-setu-200 hover:border-setu-400 text-setu-700 text-[14px] font-semibold rounded-full no-underline transition-all duration-200"
                >
                  <Search className="w-4 h-4" /> Browse
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: Zap,
                  label: "Emergency",
                  href: "/campaigns?category=emergency",
                  img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&q=70&auto=format&fit=crop",
                  iconColor: "text-orange-500",
                },
                {
                  icon: Heart,
                  label: "Medical",
                  href: "/campaigns?category=medical",
                  img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&q=70&auto=format&fit=crop",
                  iconColor: "text-red-500",
                },
                {
                  icon: Eye,
                  label: "Education",
                  href: "/campaigns?category=education",
                  img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=200&q=70&auto=format&fit=crop",
                  iconColor: "text-blue-500",
                },
                {
                  icon: Package,
                  label: "Goods",
                  href: "/donations/goods",
                  img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=200&q=70&auto=format&fit=crop",
                  iconColor: "text-amber-500",
                },
                {
                  icon: Users,
                  label: "Charity",
                  href: "/campaigns?category=charity",
                  img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&q=70&auto=format&fit=crop",
                  iconColor: "text-setu-500",
                },
                {
                  icon: ShieldCheck,
                  label: "Animals",
                  href: "/campaigns?category=animals",
                  img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&q=70&auto=format&fit=crop",
                  iconColor: "text-purple-500",
                },
              ].map(({ icon: Icon, label, href, img, iconColor }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-lg group-hover:-translate-y-1 transition-transform duration-200">
                    <img
                      src={img}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className={`w-3.5 h-3.5 ${iconColor} flex-shrink-0`}
                    />
                    <span className="text-[12px] font-semibold text-setu-800">
                      {label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-8 mt-24">
            {[
              { icon: Users, label: "18,400+ Donors" },
              { icon: ShieldCheck, label: "Verified Campaigns" },
              { icon: Zap, label: "Real-Time Tracking" },
              { icon: Package, label: "4,800+ Goods Sent" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-5 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 rounded-full transition-all duration-200 cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-setu-500/40 border border-setu-400/50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[14px] font-bold text-white tracking-wide whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-6 h-[2px] bg-setu-500 rounded" />
                Simple & Transparent
              </div>
              <h2
                className="text-[clamp(32px,4vw,50px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How Setu Works
              </h2>
            </div>
            <Link
              href="/how-it-works"
              className="hidden sm:flex items-center gap-1.5 text-[14px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors"
            >
              Learn more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-setu-100 rounded-3xl overflow-hidden">
            {[
              {
                n: "01",
                icon: Search,
                title: "Create or Find a Campaign",
                desc: "Start your own fundraiser or browse hundreds of verified campaigns across medical, education, and disaster relief categories.",
              },
              {
                n: "02",
                icon: Heart,
                title: "Donate Money or Goods",
                desc: "Contribute cash via secure payment or donate physical goods — rice, clothes, medicine — for immediate disaster relief across Nepal.",
              },
              {
                n: "03",
                icon: Eye,
                title: "Track Real-Time Impact",
                desc: "See exactly where your donation goes with transparent tracking, live updates, and detailed campaign reports at every stage.",
              },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div
                key={n}
                className="bg-white px-8 lg:px-10 py-12 relative group hover:bg-setu-50 transition-colors duration-200"
              >
                <span
                  className="absolute top-7 right-8 text-[80px] lg:text-[88px] font-bold text-setu-100 leading-none select-none group-hover:text-setu-200 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {n}
                </span>
                <div className="w-14 h-14 bg-setu-700 rounded-2xl flex items-center justify-center mb-7 shadow-[0_8px_20px_rgba(21,104,57,0.25)] group-hover:bg-setu-600 transition-colors">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className="text-[20px] font-bold text-setu-950 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-[1.7]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-6 h-[2px] bg-setu-500 rounded" />
                Making a Difference
              </div>
              <h2
                className="text-[clamp(32px,4vw,50px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Featured Campaigns
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="hidden sm:flex items-center gap-1.5 text-[14px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.map((c, i) => (
              <CampaignCard key={c.id} c={c} large={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-6 h-[2px] bg-setu-500 rounded" />
                Explore All
              </div>
              <h2
                className="text-[clamp(30px,4vw,46px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Browse Campaigns
              </h2>
              <p className="text-[14px] text-gray-500 mt-2">
                Discover causes that matter — from medical emergencies to
                disaster relief.
              </p>
            </div>
            <Link
              href="/campaigns"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-setu-700 hover:bg-setu-600 text-white text-[13px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] w-fit"
            >
              View All Campaigns <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All",
              "Emergency",
              "Medical",
              "Education",
              "Charity",
              "Animals",
            ].map((cat) => (
              <button
                key={cat}
                className={[
                  "px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150",
                  cat === "All"
                    ? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
                    : "bg-white text-setu-700 border-setu-200 hover:border-setu-400 hover:bg-setu-50",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <AllCampaignCard key={c.id} c={c} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-setu-50 hover:bg-setu-100 border border-setu-200 text-setu-700 text-[14px] font-semibold rounded-full no-underline transition-all duration-200"
            >
              Load More Campaigns <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Top Contributors
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(32px,4vw,50px)] font-bold text-setu-950 leading-tight tracking-[-0.5px] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hall of Fame
            </h2>
            <p className="text-[14px] text-gray-500 max-w-sm mx-auto">
              Recognizing our most generous donors who are changing lives across
              Nepal every day.
            </p>
          </div>
          <div className="flex items-end justify-center gap-4 sm:gap-6 mb-16">
            {[
              {
                name: "Sunita Tamang",
                amt: "NPR 1,80,000",
                img: 12,
                rank: 2,
                barH: "h-[110px]",
                barBg: "from-slate-200 to-slate-400",
                ring: "ring-slate-300",
                rankBg: "bg-slate-400",
                trophy: "silver",
              },
              {
                name: "Ramesh Shrestha",
                amt: "NPR 2,50,000",
                img: 8,
                rank: 1,
                barH: "h-[145px]",
                barBg: "from-amber-100 to-amber-500",
                ring: "ring-amber-400",
                rankBg: "bg-amber-400",
                trophy: "gold",
                big: true,
              },
              {
                name: "Bikash Rai",
                amt: "NPR 1,42,000",
                img: 15,
                rank: 3,
                barH: "h-[88px]",
                barBg: "from-orange-200 to-orange-600",
                ring: "ring-orange-400",
                rankBg: "bg-orange-600",
                trophy: "bronze",
              },
            ].map(
              ({
                name,
                amt,
                img,
                rank,
                barH,
                barBg,
                ring,
                rankBg,
                trophy,
                big,
              }) => (
                <div key={rank} className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img
                      src={`https://i.pravatar.cc/80?img=${img}`}
                      alt={name}
                      className={[
                        "rounded-full object-cover border-4 border-white shadow-lg",
                        big ? "w-20 h-20" : "w-16 h-16",
                        "ring-2",
                        ring,
                      ].join(" ")}
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${rankBg} text-white flex items-center justify-center text-[11px] font-black border-2 border-white`}
                    >
                      {rank}
                    </div>
                  </div>
                  <p
                    className={`font-bold text-setu-900 text-center mb-0.5 ${big ? "text-[15px]" : "text-[13px]"}`}
                  >
                    {name}
                  </p>
                  <p
                    className={`font-semibold text-setu-600 text-center mb-3 ${big ? "text-[14px]" : "text-[12px]"}`}
                  >
                    {amt}
                  </p>
                  <div
                    className={`w-24 sm:w-28 ${barH} bg-gradient-to-b ${barBg} rounded-t-xl flex items-start justify-center pt-4`}
                  >
                    <Trophy
                      className={`${big ? "w-7 h-7" : "w-5 h-5"} ${trophy === "gold" ? "text-amber-600" : trophy === "silver" ? "text-slate-500" : "text-orange-700"}`}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[820px] mx-auto">
            {[
              { rank: 4, name: "Priya Thapa", amt: "NPR 1,15,000", img: 20 },
              { rank: 5, name: "Anish Gurung", amt: "NPR 98,500", img: 25 },
              { rank: 6, name: "Meena Karki", amt: "NPR 87,000", img: 30 },
            ].map(({ rank, name, amt, img }) => (
              <div
                key={rank}
                className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-setu-100 hover:bg-setu-50 hover:translate-x-1 transition-all duration-200 cursor-pointer"
              >
                <div className="w-8 h-8 bg-setu-700 text-white rounded-lg flex items-center justify-center text-[12px] font-black flex-shrink-0">
                  {rank}
                </div>
                <img
                  src={`https://i.pravatar.cc/40?img=${img}`}
                  alt={name}
                  className="w-9 h-9 rounded-full border-2 border-setu-200 object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-setu-900 truncate">
                    {name}
                  </p>
                  <p className="text-[12px] font-medium text-setu-600">{amt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 bg-setu-900 rounded-[32px] overflow-hidden min-h-[460px]">
            <div className="flex flex-col justify-center px-8 sm:px-14 py-16">
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-300 mb-6">
                <div className="w-5 h-[2px] bg-setu-400 rounded" />
                Beyond Money
              </div>
              <h2
                className="text-[clamp(28px,3.5vw,44px)] font-bold text-white leading-tight mb-5 tracking-[-0.5px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Donate <em className="italic text-setu-300">Goods</em>
                <br />
                During Disasters
              </h2>
              <p className="text-[15px] text-white/55 leading-[1.75] max-w-[380px] mb-9">
                Send rice, clothes, medicine, and relief supplies directly to
                communities hit by floods, earthquakes, and emergencies across
                Nepal.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-9">
                {[
                  { icon: Wheat, label: "Rice & Food" },
                  { icon: Shirt, label: "Clothes" },
                  { icon: Pill, label: "Medicine" },
                  { icon: Tent, label: "Shelter" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.12] rounded-full"
                  >
                    <Icon className="w-3.5 h-3.5 text-setu-300" />
                    <span className="text-[13px] font-medium text-white/80">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/donations/goods"
                  className="px-7 py-3.5 bg-white text-setu-800 text-[14px] font-bold rounded-full no-underline hover:bg-setu-50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                >
                  Donate Goods Now
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-1.5 px-7 py-3.5 border-[1.5px] border-white/25 text-white text-[14px] font-semibold rounded-full no-underline hover:bg-white/[0.08] transition-colors"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=85&auto=format&fit=crop"
                alt="Disaster relief volunteers"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-setu-900 via-setu-900/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Secure Payments",
                desc: "256-bit SSL encryption on every transaction. Your financial data is never stored on our servers.",
                color: "text-setu-600",
                bg: "bg-setu-50",
              },
              {
                icon: CheckCircle,
                title: "Verified Campaigns",
                desc: "Every campaign is manually reviewed by our team. We verify identities, documents, and cause legitimacy.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Eye,
                title: "Transparent Impact",
                desc: "Track every rupee in real-time. Detailed reports show exactly how funds are spent and who they reach.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-setu-100 hover:shadow-[0_8px_30px_rgba(21,104,57,0.07)] transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3
                  className="text-[18px] font-bold text-setu-950 mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-[1.7]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Real Stories
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(30px,4vw,46px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Voices of Change
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: 8,
                name: "Ramesh Shrestha",
                role: "Top Donor · Kathmandu",
                quote:
                  "Setu made it incredibly simple to help flood victims. I could see in real-time exactly where my money went. This is transparency done right.",
              },
              {
                img: 22,
                name: "Sunita Gurung",
                role: "Campaign Creator · Pokhara",
                quote:
                  "We raised NPR 3 lakhs in just 2 weeks for our school's library. The platform is so easy to use and the team is always ready to help.",
              },
              {
                img: 45,
                name: "Dr. Bikash Thapa",
                role: "Charity Org · Chitwan",
                quote:
                  "Partnering with Setu for our medical camps has been transformative. Goods donations arrive faster, and every donor can track their impact.",
              },
            ].map(({ img, name, role, quote }) => (
              <div
                key={name}
                className="bg-setu-50 rounded-2xl p-7 border border-setu-100 hover:shadow-[0_8px_30px_rgba(21,104,57,0.08)] transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-[14px] text-gray-600 leading-[1.75] mb-6 italic">
                  &quot;{quote}&quot;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-setu-100">
                  <img
                    src={`https://i.pravatar.cc/44?img=${img}`}
                    alt={name}
                    className="w-11 h-11 rounded-full border-2 border-setu-200 object-cover"
                  />
                  <div>
                    <p className="text-[14px] font-bold text-setu-900">
                      {name}
                    </p>
                    <p className="text-[12px] text-setu-600 font-medium">
                      {role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 text-center bg-setu-950 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,160,91,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-setu-800/40 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-setu-800/50 rounded-full pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <p className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-400 mb-6">
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
            Join the Movement
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
          </p>
          <h2
            className="text-[clamp(38px,5.5vw,64px)] font-bold text-white leading-[1.07] tracking-[-1px] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to make a<br />
            <em className="italic text-setu-400">real difference?</em>
          </h2>
          <p className="text-[17px] text-white/45 max-w-[460px] mx-auto mb-12 leading-[1.75]">
            Start your fundraiser in minutes. No hidden fees. Every donation
            goes directly to verified causes across Nepal.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-setu-500 hover:bg-setu-400 text-white text-[15px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:shadow-[0_12px_36px_rgba(34,160,91,0.5)] hover:-translate-y-0.5"
            >
              Start Your Fundraiser <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-9 py-5 bg-white/[0.07] border border-white/15 hover:bg-white/[0.12] text-white/80 hover:text-white text-[15px] font-semibold rounded-full no-underline transition-all duration-200"
            >
              Browse Campaigns
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
            {[
              { icon: ShieldCheck, label: "Secure & Encrypted" },
              { icon: Clock, label: "Setup in 2 minutes" },
              { icon: Heart, label: "Free forever" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-[13px] text-white/35 font-medium"
              >
                <Icon className="w-4 h-4 text-setu-500" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
