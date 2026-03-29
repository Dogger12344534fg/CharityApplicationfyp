import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Browse Campaigns", href: "/campaigns" },
    { label: "Start a Campaign", href: "/register" },
    { label: "Emergency Relief", href: "/campaigns?category=emergency" },
    { label: "Hall of Fame", href: "/hall-of-fame" },
  ],
  Donate: [
    { label: "Money Donation", href: "/donations" },
    { label: "Goods Donation", href: "/donations/goods" },
    { label: "One-Time Gift", href: "/donations?type=one-time" },
    { label: "Monthly Giving", href: "/donations?type=monthly" },
    { label: "Team Campaigns", href: "/teams" },
  ],
  Company: [
    { label: "About Setu", href: "/about" },
    { label: "Our Impact", href: "/impact" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Careers", href: "/careers" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact-report" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Report an Issue", href: "/contact-report" },
  ],
};

// ── Setu bridge logo (white variant for dark footer) ──────────
function SetuLogoFooter({ size = 44 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rounded square */}
      <rect
        x="2"
        y="2"
        width="52"
        height="52"
        rx="13"
        fill="rgba(255,255,255,0.08)"
      />

      {/* Bridge arch */}
      <path
        d="M10 36 Q28 10 46 36"
        stroke="#4dbf7a"
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
        stroke="#4dbf7a"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Suspension verticals */}
      <line
        x1="20"
        y1="24"
        x2="20"
        y2="36"
        stroke="#87d8a6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="28"
        y1="19"
        x2="28"
        y2="36"
        stroke="#87d8a6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="36"
        y1="24"
        x2="36"
        y2="36"
        stroke="#87d8a6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Heart at apex */}
      <path
        d="M28 31 C28 31 22 26.5 22 23 C22 20.8 24 19 28 22 C32 19 34 20.8 34 23 C34 26.5 28 31 28 31Z"
        fill="#4dbf7a"
      />

      {/* Pillars */}
      <line
        x1="12"
        y1="36"
        x2="12"
        y2="44"
        stroke="#4dbf7a"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <line
        x1="44"
        y1="36"
        x2="44"
        y2="44"
        stroke="#4dbf7a"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-setu-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* ── Brand column ── */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline flex-shrink-0 group"
            >
              <SetuLogoFooter size={44} />
              <div className="flex flex-col">
                <span
                  className="text-[1.5rem] font-bold text-white leading-none tracking-[-0.3px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Setu
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-setu-400 mt-0.5 leading-none">
                  Connecting Nepal
                </span>
              </div>
            </Link>

            <p className="mt-4 text-sm text-setu-300 leading-relaxed">
              Bridging donors, charities, and communities across Nepal for a
              better tomorrow.
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-setu-400">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-setu-400">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>dipendraroka947@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-setu-400">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>+977 9816404196</span>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-setu-400 hover:border-setu-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-setu-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-setu-300 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-setu-500">
            © {new Date().getFullYear()} Setu. Built for Nepal.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-setu-500">
            <span className="w-2 h-2 rounded-full bg-setu-400 inline-block animate-pulse" />
            All donations are encrypted and secure
          </div>
        </div>
      </div>
    </footer>
  );
}
