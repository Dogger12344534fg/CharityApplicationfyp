import Link from "next/link";
import {
  FileText,
  ChevronRight,
  Mail,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const sections = [
  {
    id: "agreement",
    title: "Agreement to Terms",
    text: "By accessing or using Setu (setu.np), you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part, you may not use our platform. These terms apply to all users — donors, campaign creators, and visitors.",
  },
  {
    id: "accounts",
    title: "User Accounts",
    items: [
      "You must be 18 years or older to create an account and start or manage a campaign.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate, current, and complete information during registration.",
      "You may not create multiple accounts or impersonate other individuals or organizations.",
      "Setu reserves the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    id: "campaigns",
    title: "Campaigns & Fundraising",
    items: [
      "All campaigns must be for legitimate, lawful purposes. Fraudulent campaigns will be removed and funds refunded.",
      "Campaign creators must submit valid identity verification and supporting documentation.",
      "Campaigns must accurately represent the beneficiary, goal, and intended use of funds.",
      "Setu charges a platform fee of 5% of funds raised. Payment processing fees apply separately.",
      "Funds are disbursed to verified accounts, express 24-hour disbursement for emergency campaigns.",
      "Campaign creators are responsible for fulfilling any commitments made to donors through updates and reports.",
    ],
  },
  {
    id: "donations",
    title: "Donations",
    items: [
      "All donations are voluntary. By donating, you agree that payments are non-refundable except in cases of verified campaign fraud.",
      "Setu facilitates donations but is not responsible for how campaign creators ultimately use funds, though we implement verification and monitoring.",
      "Recurring donations may be cancelled at any time from your account settings.",
      "Donation receipts are issued digitally and may be used for personal records.",
      "For goods donations, Setu coordinates logistics but is not liable for loss or damage during transit beyond reasonable care.",
    ],
  },
  {
    id: "prohibited",
    title: "Prohibited Uses",
    items: [
      "Creating campaigns for illegal activities, terrorism, hate groups, or any purpose that violates Nepali law.",
      "Using Setu to harass, threaten, or defame other users or organizations.",
      "Attempting to hack, scrape, or disrupt Setu's systems or servers.",
      "Posting false, misleading, or fraudulent information on any campaign.",
      "Using automated tools to create accounts, submit donations, or interact with campaigns.",
      "Collecting user data from Setu without explicit written permission.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    text: "Setu provides the platform in good faith and implements verification measures. However, Setu is not liable for campaign fraud beyond what our verification process can reasonably detect. In cases of verified fraud, Setu will assist in pursuing remedies within the limits of Nepali law. Our maximum liability to any user is limited to the amount of platform fees collected from that user in the 12 months preceding any claim.",
  },
  {
    id: "changes",
    title: "Changes to Terms",
    text: "Setu reserves the right to update these Terms of Service at any time. We will notify users of significant changes via email and a prominent notice on our platform at least 14 days before changes take effect. Continued use of Setu after changes constitutes acceptance of the new terms.",
  },
  {
    id: "governing",
    title: "Governing Law",
    text: "These Terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.",
  },
];

function TermsIllustration() {
  return (
    <svg
      viewBox="0 0 380 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      aria-hidden="true"
    >
      {/* Background blob */}
      <ellipse cx="190" cy="148" rx="168" ry="118" fill="#f0faf4" />

      {/* Main document */}
      <rect x="110" y="38" width="130" height="170" rx="10" fill="white" />
      {/* Document header strip */}
      <rect x="110" y="38" width="130" height="32" rx="10" fill="#156839" />
      <rect x="122" y="38" width="130" height="18" fill="#156839" />
      {/* Header icon circle */}
      <circle cx="150" cy="54" r="10" fill="#1a8048" />
      <path
        d="M146 54 L149 57 L155 51"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Header text lines */}
      <rect x="164" y="49" width="52" height="5" rx="2.5" fill="white" opacity="0.85" />
      <rect x="164" y="58" width="36" height="4" rx="2" fill="white" opacity="0.5" />

      {/* Section 1 */}
      <rect x="122" y="82" width="24" height="5" rx="2.5" fill="#d1fae5" />
      <rect x="122" y="91" width="106" height="4" rx="2" fill="#e5e7eb" />
      <rect x="122" y="99" width="88" height="4" rx="2" fill="#e5e7eb" />
      <rect x="122" y="107" width="96" height="4" rx="2" fill="#e5e7eb" />

      {/* Divider */}
      <rect x="122" y="118" width="106" height="1" rx="0.5" fill="#f0faf4" />

      {/* Section 2 */}
      <rect x="122" y="124" width="32" height="5" rx="2.5" fill="#d1fae5" />
      <rect x="122" y="133" width="106" height="4" rx="2" fill="#e5e7eb" />
      <rect x="122" y="141" width="70" height="4" rx="2" fill="#e5e7eb" />

      {/* Divider */}
      <rect x="122" y="152" width="106" height="1" rx="0.5" fill="#f0faf4" />

      {/* Section 3 */}
      <rect x="122" y="158" width="28" height="5" rx="2.5" fill="#d1fae5" />
      <rect x="122" y="167" width="106" height="4" rx="2" fill="#e5e7eb" />
      <rect x="122" y="175" width="80" height="4" rx="2" fill="#e5e7eb" />

      {/* Signature area */}
      <rect x="122" y="188" width="106" height="1" rx="0.5" fill="#d1fae5" />
      <path
        d="M122 200 Q138 194 152 200 Q168 206 184 200"
        stroke="#156839"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="196" y="196" width="32" height="8" rx="4" fill="#156839" />
      <text x="212" y="202" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700" fontFamily="sans-serif">SIGNED</text>

      {/* Seal / stamp — bottom right of doc */}
      <circle cx="218" cy="190" r="14" fill="none" stroke="#156839" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="218" cy="190" r="9" fill="#156839" opacity="0.12" />
      <path
        d="M213 190 L217 194 L224 185"
        stroke="#156839"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Folded corner — top right of doc */}
      <path d="M222 38 L240 38 L240 56 Z" fill="#f0faf4" />
      <path d="M222 38 L240 56 L222 56 Z" fill="#e5e7eb" />

      {/* Left floating badges */}
      <rect x="28" y="94" width="68" height="26" rx="8" fill="white" />
      <circle cx="44" cy="107" r="7" fill="#156839" />
      <path d="M41 107 L43.5 109.5 L48 104" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="55" y="101" width="32" height="4" rx="2" fill="#d1fae5" />
      <rect x="55" y="109" width="22" height="3" rx="1.5" fill="#e5e7eb" />

      <rect x="22" y="130" width="74" height="26" rx="8" fill="white" />
      <circle cx="38" cy="143" r="7" fill="#22c55e" />
      <path d="M35 143 L37.5 145.5 L42 140" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="49" y="137" width="36" height="4" rx="2" fill="#d1fae5" />
      <rect x="49" y="145" width="26" height="3" rx="1.5" fill="#e5e7eb" />

      <rect x="28" y="166" width="68" height="26" rx="8" fill="white" />
      <circle cx="44" cy="179" r="7" fill="#156839" />
      <path d="M41 179 L43.5 181.5 L48 176" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="55" y="173" width="28" height="4" rx="2" fill="#d1fae5" />
      <rect x="55" y="181" width="20" height="3" rx="1.5" fill="#e5e7eb" />

      {/* Dashed connector lines from badges to doc */}
      <path d="M96 107 L108 107" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
      <path d="M96 143 L108 143" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
      <path d="M96 179 L108 179" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />

      {/* Right floating tag */}
      <rect x="254" y="110" width="90" height="32" rx="9" fill="white" />
      <rect x="264" y="118" width="70" height="5" rx="2.5" fill="#d1fae5" />
      <rect x="264" y="127" width="50" height="4" rx="2" fill="#e5e7eb" />
      {/* Tag tail */}
      <path d="M254 126 L244 126" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />

      <rect x="260" y="154" width="84" height="32" rx="9" fill="white" />
      <rect x="270" y="162" width="60" height="5" rx="2.5" fill="#d1fae5" />
      <rect x="270" y="171" width="44" height="4" rx="2" fill="#e5e7eb" />
      <path d="M260 170 L250 170" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />

      {/* Floating dots */}
      <circle cx="46" cy="72" r="5" fill="#86efac" opacity="0.65" />
      <circle cx="336" cy="90" r="4" fill="#4ade80" opacity="0.55" />
      <circle cx="330" cy="210" r="6" fill="#86efac" opacity="0.5" />
      <circle cx="56" cy="220" r="4" fill="#4ade80" opacity="0.5" />
      <circle cx="190" cy="32" r="3" fill="#156839" opacity="0.4" />

      {/* Bottom pill */}
      <rect x="115" y="222" width="150" height="28" rx="14" fill="#156839" />
      <text
        x="190"
        y="241"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="700"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        Fair & Transparent Terms
      </text>
    </svg>
  );
}

function TermsPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <section className="bg-white border-b border-setu-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Legal
            </div>
            <h1
              className="text-[clamp(32px,4.5vw,54px)] font-bold text-setu-950 leading-tight tracking-[-1px] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Terms of Service
            </h1>
            <p className="text-[15px] text-setu-800/55 leading-[1.75] max-w-lg mb-3">
              Please read these terms carefully before using Setu. By using our
              platform, you agree to be bound by these terms.
            </p>
            <p className="text-[13px] text-setu-600/50 font-medium">
              Last updated: January 1, 2025 · Effective: January 1, 2025
            </p>
          </div>
          {/* Illustration */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-setu-100 p-4 shadow-[0_2px_12px_rgba(21,104,57,0.05)]">
              <TermsIllustration />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[240px_1fr] gap-10">
            {/* Sticky nav */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-white rounded-2xl border border-setu-100 p-5">
                <p className="text-[11px] font-bold text-setu-600/55 uppercase tracking-wide mb-3">
                  Sections
                </p>
                {sections.map(({ id, title }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-2 py-2 text-[13px] font-medium text-setu-700 hover:text-setu-950 no-underline transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-setu-400" />
                    {title}
                  </a>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Summary banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-bold text-amber-900 mb-1">
                    Quick Summary
                  </p>
                  <p className="text-[13px] text-amber-800/80 leading-[1.7]">
                    Setu is a platform for legitimate donations in Nepal. Be
                    honest in your campaigns, don't misuse the platform, and
                    understand that donations are generally non-refundable. We
                    verify campaigns but can't guarantee every one. Full details
                    below.
                  </p>
                </div>
              </div>

              {sections.map(({ id, title, text, items }) => (
                <div
                  key={id}
                  id={id}
                  className="bg-white rounded-2xl border border-setu-100 p-7 shadow-[0_2px_12px_rgba(21,104,57,0.04)]"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-setu-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-setu-600" />
                    </div>
                    <h2
                      className="text-[18px] font-bold text-setu-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {title}
                    </h2>
                  </div>
                  {text && (
                    <p className="text-[14px] text-gray-500 leading-[1.8]">
                      {text}
                    </p>
                  )}
                  {items && (
                    <ul className="space-y-3">
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-setu-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-setu-600" />
                          </div>
                          <p className="text-[14px] text-gray-500 leading-[1.75]">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="bg-setu-900 rounded-2xl p-7">
                <h2
                  className="text-[18px] font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Questions about these Terms?
                </h2>
                <p className="text-[14px] text-white/55 mb-4 leading-[1.75]">
                  Contact our legal team with any questions about these Terms of
                  Service.
                </p>
                <a
                  href="mailto:dipendraroka947@gmail.com"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-setu-300 no-underline hover:text-setu-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  dipendraroka947@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsPage;