// ═══════════════════════════════════════════════
// PRESS PAGE — app/(main)/press/page.tsx
// ═══════════════════════════════════════════════
import Link from "next/link";
import {
  Download,
  ExternalLink,
  Mail,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Newspaper,
} from "lucide-react";

const pressItems = [
  {
    outlet: "Kathmandu Post",
    date: "Oct 2024",
    headline:
      "Setu Raises NPR 2 Crore for Nepal Disaster Victims Through Transparent Platform",
    type: "Article",
    logo: "KP",
    color: "bg-red-600",
  },
  {
    outlet: "Republica Nepal",
    date: "Sep 2024",
    headline:
      "Nepal's First Goods Donation Platform Launches to Aid Flood Relief Efforts",
    type: "Feature",
    logo: "RE",
    color: "bg-blue-700",
  },
  {
    outlet: "OnlineKhabar",
    date: "Aug 2024",
    headline: "How Setu Mobilized 2,000 Donors in 48 Hours During Koshi Floods",
    type: "Article",
    logo: "OK",
    color: "bg-orange-600",
  },
  {
    outlet: "The Himalayan Times",
    date: "Jul 2024",
    headline: "Setu Wins Best Social Impact Startup at Nepal Tech Summit 2024",
    type: "Award",
    logo: "HT",
    color: "bg-setu-700",
  },
  {
    outlet: "Setopati",
    date: "Jun 2024",
    headline: "Transparent Fundraising: Inside Setu's Verified Campaign Model",
    type: "Interview",
    logo: "SP",
    color: "bg-purple-700",
  },
  {
    outlet: "BBC Nepali",
    date: "May 2024",
    headline:
      "Digital Philanthropy in Nepal: How Young Donors Are Using Technology to Give",
    type: "Feature",
    logo: "BBC",
    color: "bg-slate-800",
  },
];

const assets = [
  {
    icon: ImageIcon,
    label: "Logo Pack",
    sub: "SVG, PNG — light & dark",
    href: "#",
  },
  {
    icon: FileText,
    label: "Brand Guidelines",
    sub: "Colors, fonts, usage rules",
    href: "#",
  },
  {
    icon: Newspaper,
    label: "Press Kit PDF",
    sub: "Full company overview",
    href: "#",
  },
  {
    icon: ImageIcon,
    label: "Product Screenshots",
    sub: "High-res UI screenshots",
    href: "#",
  },
];

export function PressPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Hero */}
      <section className="bg-white border-b border-setu-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
            Media Center
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <h1
                className="text-[clamp(34px,4.5vw,58px)] font-bold text-setu-950 leading-tight tracking-[-1.5px] mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Setu in the
                <br />
                <em className="italic text-setu-600">News</em>
              </h1>
              <p className="text-[16px] text-setu-800/55 leading-[1.8] max-w-md">
                Find press releases, media assets, and journalist contacts. For
                press inquiries, reach us at{" "}
                <a
                  href="mailto:press@setu.np"
                  className="text-setu-600 font-semibold no-underline hover:underline"
                >
                  press@setu.np
                </a>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {assets.map(({ icon: Icon, label, sub, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-3 p-4 bg-setu-50 border border-setu-100 rounded-2xl hover:border-setu-400 hover:bg-white hover:shadow-[0_4px_16px_rgba(21,104,57,0.08)] transition-all no-underline"
                >
                  <div className="w-9 h-9 bg-setu-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-setu-600 transition-colors">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-setu-900">
                      {label}
                    </p>
                    <p className="text-[11px] text-setu-600/55">{sub}</p>
                  </div>
                  <Download className="w-4 h-4 text-setu-400 ml-auto flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Press coverage */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-[22px] font-bold text-setu-950 mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Coverage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pressItems.map(({ outlet, date, headline, type, logo, color }) => (
              <div
                key={headline}
                className="group bg-white rounded-2xl p-6 border border-setu-100 hover:shadow-[0_8px_28px_rgba(21,104,57,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white text-[11px] font-black`}
                  >
                    {logo}
                  </div>
                  <span className="text-[11px] font-bold text-setu-600/55 uppercase tracking-wide">
                    {type}
                  </span>
                </div>
                <h3
                  className="text-[14px] font-bold text-setu-950 leading-snug mb-3 group-hover:text-setu-700 transition-colors line-clamp-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {headline}
                </h3>
                <div className="flex items-center justify-between pt-3 border-t border-setu-50">
                  <span className="text-[12px] text-setu-600/55 font-medium">
                    {outlet} · {date}
                  </span>
                  <ExternalLink className="w-4 h-4 text-setu-400 group-hover:text-setu-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 bg-setu-950 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-[22px] font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Press Inquiries
              </h3>
              <p className="text-[14px] text-white/50">
                We respond to all media requests within 24 hours.
              </p>
            </div>
            <a
              href="mailto:press@setu.np"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-500 hover:bg-setu-400 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_4px_16px_rgba(34,160,91,0.35)] hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              <Mail className="w-4 h-4" />
              press@setu.np
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PressPage;
