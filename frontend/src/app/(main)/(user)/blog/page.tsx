// ═══════════════════════════════════════════════
// BLOG PAGE — app/(main)/blog/page.tsx
// ═══════════════════════════════════════════════
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  ChevronRight,
  Tag,
  Search,
  Users,
  Heart,
  Zap,
  Package,
} from "lucide-react";

const featured = {
  slug: "flood-relief-2024",
  title: "How Setu Raised NPR 3.6L in 48 Hours for Koshi Flood Victims",
  excerpt:
    "When the Koshi River burst its banks in August 2024, Setu's emergency response campaign mobilized 2,000+ donors in under two days. Here's how it happened.",
  img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=85&auto=format&fit=crop",
  author: { name: "Dipendra Roka", img: 8 },
  date: "Aug 20, 2024",
  readTime: "6 min read",
  tag: "Emergency",
};

const posts = [
  {
    slug: "goods-donation-launch",
    title: "Introducing Goods Donation: Send Rice, Clothes & Medicine Directly",
    excerpt:
      "Today we're launching a first-of-its-kind physical goods donation system in Nepal.",
    img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80&auto=format&fit=crop",
    author: { name: "Rohan Shrestha", img: 15 },
    date: "Sep 5, 2024",
    readTime: "4 min",
    tag: "Product",
  },
  {
    slug: "transparency-report-2024",
    title: "Setu 2024 Transparency Report: Every Rupee Accounted For",
    excerpt:
      "A full breakdown of how NPR 2.4 crore was raised, verified, and disbursed across all campaigns.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop",
    author: { name: "Anjali Tamang", img: 30 },
    date: "Oct 1, 2024",
    readTime: "8 min",
    tag: "Report",
  },
  {
    slug: "how-to-run-campaign",
    title: "5 Tips to Run a Successful Campaign on Setu",
    excerpt:
      "From writing your story to sharing on WhatsApp — learn what the top campaigns do differently.",
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&q=80&auto=format&fit=crop",
    author: { name: "Priya Maharjan", img: 50 },
    date: "Oct 15, 2024",
    readTime: "5 min",
    tag: "Guide",
  },
  {
    slug: "donor-spotlight",
    title: "Donor Spotlight: How Ramesh Built a School from Kathmandu",
    excerpt:
      "A software engineer turned top donor shares why he gives monthly and what impact looks like.",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80&auto=format&fit=crop",
    author: { name: "Sita Karmacharya", img: 22 },
    date: "Nov 2, 2024",
    readTime: "5 min",
    tag: "Stories",
  },
  {
    slug: "team-fundraising",
    title: "Why Team Fundraising Raises 3× More Than Individual Campaigns",
    excerpt:
      "Data from 200+ campaigns shows that teams consistently outperform solo fundraisers. Here's the science.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop",
    author: { name: "Bikram Gurung", img: 45 },
    date: "Nov 20, 2024",
    readTime: "6 min",
    tag: "Insights",
  },
  {
    slug: "jajarkot-relief",
    title: "Jajarkot Earthquake: Inside Our Emergency Response",
    excerpt:
      "How Setu coordinated 1,500 donors and NPR 2.9L in goods + money within 72 hours of the quake.",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80&auto=format&fit=crop",
    author: { name: "Rohan Shrestha", img: 15 },
    date: "Dec 5, 2024",
    readTime: "7 min",
    tag: "Emergency",
  },
];

const tagColors: Record<string, string> = {
  Emergency: "bg-orange-50 text-orange-700 border-orange-100",
  Product: "bg-blue-50 text-blue-700 border-blue-100",
  Report: "bg-purple-50 text-purple-700 border-purple-100",
  Guide: "bg-setu-50 text-setu-700 border-setu-200",
  Stories: "bg-amber-50 text-amber-700 border-amber-100",
  Insights: "bg-pink-50 text-pink-700 border-pink-100",
};

export function BlogPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Hero */}
      <section className="bg-white border-b border-setu-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-6 h-[2px] bg-setu-500 rounded" />
                Setu Blog
              </div>
              <h1
                className="text-[clamp(32px,4.5vw,56px)] font-bold text-setu-950 leading-tight tracking-[-1px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Stories of Impact &<br />
                <em className="italic text-setu-600">Platform Updates</em>
              </h1>
            </div>
            <div className="relative flex-shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-setu-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-11 pr-5 py-3 bg-setu-50 border border-setu-200 rounded-full text-[14px] placeholder:text-setu-400 focus:outline-none focus:border-setu-500 w-60 transition-all"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Emergency",
              "Product",
              "Guide",
              "Stories",
              "Insights",
              "Report",
            ].map((t) => (
              <button
                key={t}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all ${t === "All" ? "bg-setu-700 text-white border-setu-700" : "bg-white text-setu-700 border-setu-200 hover:border-setu-400"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-white rounded-3xl overflow-hidden border border-setu-100 shadow-[0_4px_20px_rgba(21,104,57,0.07)] hover:shadow-[0_20px_60px_rgba(21,104,57,0.14)] hover:-translate-y-1 transition-all duration-300 mb-10 no-underline"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-72 md:h-auto overflow-hidden">
                <img
                  src={featured.img}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                <span
                  className={`absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${tagColors[featured.tag]}`}
                >
                  {featured.tag}
                </span>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <span className="text-[12px] font-bold text-setu-500 uppercase tracking-wide mb-3">
                  Featured Article
                </span>
                <h2
                  className="text-[clamp(20px,2.5vw,32px)] font-bold text-setu-950 leading-snug mb-4 group-hover:text-setu-700 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {featured.title}
                </h2>
                <p className="text-[15px] text-gray-500 leading-[1.75] mb-6">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://i.pravatar.cc/36?img=${featured.author.img}`}
                    alt=""
                    className="w-9 h-9 rounded-full border-2 border-setu-100 object-cover"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-setu-900">
                      {featured.author.name}
                    </p>
                    <p className="text-[12px] text-setu-600/55">
                      {featured.date} · {featured.readTime}
                    </p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 px-5 py-2.5 bg-setu-700 group-hover:bg-setu-600 text-white text-[13px] font-bold rounded-full transition-colors">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_16px_40px_rgba(21,104,57,0.12)] hover:-translate-y-1 hover:border-setu-200 transition-all duration-300 no-underline"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${tagColors[p.tag]}`}
                  >
                    {p.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3
                    className="font-bold text-[15px] text-setu-950 leading-snug mb-2 group-hover:text-setu-700 transition-colors line-clamp-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {p.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-3.5 border-t border-setu-50">
                    <img
                      src={`https://i.pravatar.cc/32?img=${p.author.img}`}
                      alt=""
                      className="w-8 h-8 rounded-full border border-setu-100 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-setu-800 truncate">
                        {p.author.name}
                      </p>
                      <p className="text-[11px] text-setu-600/55">
                        {p.date} · {p.readTime}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-setu-300 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
