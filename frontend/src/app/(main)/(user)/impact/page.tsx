import Link from "next/link";
import {
  TrendingUp,
  Heart,
  Users,
  Package,
  MapPin,
  ArrowRight,
  Eye,
  Zap,
  Star,
  ChevronRight,
} from "lucide-react";

const impactStats = [
  {
    icon: TrendingUp,
    num: "NPR 2.4Cr+",
    label: "Total Raised",
    sub: "Across all campaigns",
  },
  {
    icon: Heart,
    num: "1,200+",
    label: "Campaigns Funded",
    sub: "Medical, education, relief",
  },
  {
    icon: Users,
    num: "18,400+",
    label: "Active Donors",
    sub: "Nepal & diaspora",
  },
  {
    icon: Package,
    num: "4,800+",
    label: "Goods Delivered",
    sub: "To disaster zones",
  },
  { icon: MapPin, num: "77", label: "Districts Served", sub: "All of Nepal" },
  { icon: Zap, num: "500+", label: "Families Helped", sub: "In emergencies" },
];

const categories = [
  {
    label: "Emergency Relief",
    raised: "NPR 92L",
    campaigns: 340,
    icon: Zap,
    color: "text-orange-600",
    bg: "bg-orange-50",
    bar: "from-orange-400 to-orange-600",
    pct: 78,
  },
  {
    label: "Medical",
    raised: "NPR 68L",
    campaigns: 280,
    icon: Heart,
    color: "text-red-600",
    bg: "bg-red-50",
    bar: "from-red-400 to-red-600",
    pct: 58,
  },
  {
    label: "Education",
    raised: "NPR 45L",
    campaigns: 220,
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50",
    bar: "from-blue-400 to-blue-600",
    pct: 38,
  },
  {
    label: "Charity",
    raised: "NPR 30L",
    campaigns: 200,
    icon: Users,
    color: "text-setu-600",
    bg: "bg-setu-50",
    bar: "from-setu-400 to-setu-700",
    pct: 25,
  },
  {
    label: "Goods Donation",
    raised: "4,800+",
    campaigns: 160,
    icon: Package,
    color: "text-amber-600",
    bg: "bg-amber-50",
    bar: "from-amber-400 to-amber-600",
    pct: 40,
  },
];

const stories = [
  {
    name: "Sushma Rai, 28",
    location: "Sindhulpalchok",
    tag: "Medical",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80&auto=format&fit=crop",
    quote:
      "After a road accident, I needed emergency surgery I couldn't afford. Within 3 days on Setu, my campaign raised NPR 1.8 lakhs. I'm recovering now.",
    raised: "NPR 1,80,000",
    donors: 312,
  },
  {
    name: "Pasang Sherpa, 45",
    location: "Solukhumbu",
    tag: "Education",
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&q=80&auto=format&fit=crop",
    quote:
      "Our village had no school for 200 children. Setu helped us raise the funds to build one in 8 weeks. Now our kids don't walk 3 hours to learn.",
    raised: "NPR 2,50,000",
    donors: 540,
  },
  {
    name: "Parvati Devi, 55",
    location: "Koshi Zone",
    tag: "Emergency",
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80&auto=format&fit=crop",
    quote:
      "The floods took everything. But through Setu, donors from Kathmandu and even abroad sent rice, clothes, and money. We rebuilt our lives.",
    raised: "NPR 3,60,000",
    donors: 2234,
  },
];

const catTagConfig: Record<string, string> = {
  Medical: "bg-red-50 text-red-700 border-red-100",
  Education: "bg-blue-50 text-blue-700 border-blue-100",
  Emergency: "bg-orange-50 text-orange-700 border-orange-100",
};

export default function ImpactPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── HERO ── */}
      <section className="bg-white border-b border-setu-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
            Real Results
          </div>
          <h1
            className="text-[clamp(36px,5vw,62px)] font-bold text-setu-950 leading-[1.04] tracking-[-1.5px] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every Rupee Tells
            <br />
            <em className="italic text-setu-600">a Story of Change.</em>
          </h1>
          <p className="text-[17px] text-setu-800/55 leading-[1.8] max-w-xl mb-10">
            Real numbers. Real people. Real impact across Nepal — tracked
            transparently, campaign by campaign.
          </p>
          {/* Big stat */}
          <div className="inline-flex items-center gap-5 bg-setu-950 rounded-2xl px-8 py-5">
            <div>
              <p
                className="text-[36px] font-black text-white leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                NPR 2.4Cr+
              </p>
              <p className="text-[13px] text-setu-400 mt-1">
                raised by 18,400+ donors across Nepal
              </p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex -space-x-2">
              {[8, 15, 22, 30, 45].map((n) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/36?img=${n}`}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-setu-900 object-cover"
                />
              ))}
              <div className="w-9 h-9 rounded-full bg-setu-700 border-2 border-setu-900 flex items-center justify-center text-white text-[10px] font-bold">
                18K+
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT GRID ── */}
      <section className="py-14 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {impactStats.map(({ icon: Icon, num, label, sub }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 border border-setu-100 hover:shadow-[0_8px_24px_rgba(21,104,57,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-setu-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-setu-600" />
                </div>
                <p
                  className="text-[30px] font-black text-setu-950 leading-none mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {num}
                </p>
                <p className="text-[14px] font-bold text-setu-800">{label}</p>
                <p className="text-[12px] text-setu-600/55 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY BREAKDOWN ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-6 h-[2px] bg-setu-500 rounded" />
                Impact by Category
              </div>
              <h2
                className="text-[clamp(26px,3.5vw,40px)] font-bold text-setu-950 tracking-[-0.5px] mb-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Where Every Rupee Goes
              </h2>
              <div className="space-y-5">
                {categories.map(
                  ({
                    label,
                    raised,
                    campaigns,
                    icon: Icon,
                    color,
                    bg,
                    bar,
                    pct,
                  }) => (
                    <div
                      key={label}
                      className="p-5 bg-setu-50 rounded-2xl border border-setu-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}
                          >
                            <Icon
                              className={`w-4.5 h-4.5 ${color}`}
                              style={{ width: 18, height: 18 }}
                            />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-setu-950">
                              {label}
                            </p>
                            <p className="text-[12px] text-setu-600/55">
                              {campaigns} campaigns
                            </p>
                          </div>
                        </div>
                        <span className="text-[15px] font-bold text-setu-800">
                          {raised}
                        </span>
                      </div>
                      <div className="h-2 bg-setu-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${bar} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Map/visual placeholder */}
            <div className="bg-setu-950 rounded-3xl p-8 sticky top-24">
              <p className="text-[12px] font-bold text-setu-400 uppercase tracking-wide mb-5">
                Reach Across Nepal
              </p>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559593360-14a5f0e63b8a?w=500&q=80&auto=format&fit=crop"
                  alt="Nepal map"
                  className="w-full h-48 object-cover rounded-xl opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p
                      className="text-[40px] font-black text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      77
                    </p>
                    <p className="text-[13px] text-setu-300">
                      Districts Reached
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { province: "Bagmati Province", campaigns: 380 },
                  { province: "Madhesh Province", campaigns: 210 },
                  { province: "Gandaki Province", campaigns: 195 },
                  { province: "Karnali Province", campaigns: 175 },
                  { province: "Lumbini Province", campaigns: 140 },
                ].map(({ province, campaigns }) => (
                  <div
                    key={province}
                    className="flex items-center justify-between text-[13px]"
                  >
                    <span className="text-white/60 font-medium">
                      {province}
                    </span>
                    <span className="text-setu-400 font-bold">
                      {campaigns} campaigns
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORIES ── */}
      <section className="py-16 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Real Stories
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Lives Changed by Setu
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map(
              ({ name, location, tag, img, quote, raised, donors }) => (
                <div
                  key={name}
                  className="bg-white rounded-2xl overflow-hidden border border-setu-100 hover:shadow-[0_12px_32px_rgba(21,104,57,0.1)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span
                      className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${catTagConfig[tag]}`}
                    >
                      {tag}
                    </span>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-[14px] text-gray-600 leading-[1.75] mb-5 italic">
                      "{quote}"
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-setu-50">
                      <div>
                        <p className="text-[13px] font-bold text-setu-900">
                          {name}
                        </p>
                        <p className="text-[12px] text-setu-600/60">
                          {raised} raised · {donors} donors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 mx-4 sm:mx-6 lg:mx-8 mb-16 mt-2">
        <div className="bg-setu-900 rounded-[28px] py-16 px-8 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(34,160,91,0.2) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-5 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Add Your Chapter to This Story
            </h2>
            <p className="text-[15px] text-white/50 max-w-md mx-auto mb-8 leading-[1.75]">
              Every campaign you support becomes a new data point of hope in
              Nepal's story.
            </p>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-8 py-4 bg-setu-500 hover:bg-setu-400 text-white text-[15px] font-bold rounded-full no-underline shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:-translate-y-0.5 transition-all"
            >
              Browse Campaigns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
