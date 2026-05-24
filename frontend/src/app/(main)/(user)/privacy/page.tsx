import Link from "next/link";
import { Shield, Lock, Eye, Database, Mail, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "collect",
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you register, we collect your name, email address, phone number, and location. For campaign creators, we also collect government-issued ID and relevant documentation for verification.",
      },
      {
        subtitle: "Donation Data",
        text: "We record the amount, date, and campaign associated with each donation. Payment processing is handled by our certified payment partners — we never store full card numbers or sensitive financial credentials.",
      },
      {
        subtitle: "Goods Donation Details",
        text: "For physical goods donations, we collect pickup address, type of goods, and delivery preferences to coordinate logistics.",
      },
      {
        subtitle: "Usage Data",
        text: "We collect anonymized data about how you interact with Setu, including pages visited, campaigns browsed, and features used — to improve our platform and personalize your experience.",
      },
    ],
  },
  {
    id: "use",
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Platform Operations",
        text: "To process donations, verify campaigns, disburse funds, and coordinate goods deliveries. Your information is essential to running the core functions of Setu.",
      },
      {
        subtitle: "Communication",
        text: "We send donation receipts, campaign updates, and platform announcements. You can opt out of marketing emails at any time from your account settings.",
      },
      {
        subtitle: "Safety & Fraud Prevention",
        text: "To verify identities, detect suspicious activity, and protect both donors and campaign creators from fraud.",
      },
      {
        subtitle: "Analytics & Improvement",
        text: "Anonymized usage data helps us understand how to improve the platform, which campaigns to feature, and how to make giving more accessible.",
      },
    ],
  },
  {
    id: "share",
    icon: Shield,
    title: "Information Sharing",
    content: [
      {
        subtitle: "We Never Sell Your Data",
        text: "Setu does not sell, rent, or trade personal information to third parties for marketing purposes. Period.",
      },
      {
        subtitle: "Payment Processors",
        text: "We share transaction data with certified payment partners (eSewa) solely to process your donations.",
      },
      {
        subtitle: "Campaign Creators",
        text: "Donors' full names and contact details are never shared with campaign creators without explicit consent. We only share aggregate donor count data.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information if required by Nepali law, court order, or to protect the safety of our users and the public.",
      },
    ],
  },
  {
    id: "security",
    icon: Lock,
    title: "Data Security",
    content: [
      {
        subtitle: "Encryption",
        text: "All data is encrypted in transit using 256-bit SSL/TLS. Sensitive data at rest is encrypted using AES-256.",
      },
      {
        subtitle: "Incident Response",
        text: "In the event of a data breach, we commit to notifying affected users within 72 hours and cooperating fully with relevant authorities.",
      },
    ],
  },
  {
    id: "rights",
    icon: Mail,
    title: "Your Rights",
    content: [
      {
        subtitle: "Access & Portability",
        text: "You can request a copy of all data we hold about you at any time from your account settings or by emailing dipendraroka947@gmail.com.",
      },
      {
        subtitle: "Correction",
        text: "You can update your personal information directly from your account profile at any time.",
      },
      {
        subtitle: "Deletion",
        text: "You may request account deletion, after which we delete your personal data within 30 days, except where retention is required by law.",
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of non-essential communications at any time from your notification preferences.",
      },
    ],
  },
];

function PrivacyIllustration() {
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

      {/* Main shield body */}
      <path
        d="M190 42 L260 72 L260 148 C260 192 226 222 190 238 C154 222 120 192 120 148 L120 72 Z"
        fill="#156839"
      />
      {/* Shield inner highlight */}
      <path
        d="M190 58 L248 84 L248 148 C248 185 218 212 190 226 C162 212 132 185 132 148 L132 84 Z"
        fill="#1a8048"
      />
      {/* Shield inner glow layer */}
      <path
        d="M190 74 L236 96 L236 148 C236 178 212 200 190 212 C168 200 144 178 144 148 L144 96 Z"
        fill="#156839"
        opacity="0.6"
      />

      {/* Lock body */}
      <rect x="172" y="140" width="36" height="28" rx="5" fill="white" />
      {/* Lock shackle */}
      <path
        d="M179 140 L179 130 Q179 118 190 118 Q201 118 201 130 L201 140"
        stroke="white"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Lock keyhole */}
      <circle cx="190" cy="153" r="4" fill="#156839" />
      <rect x="188" y="155" width="4" height="7" rx="1" fill="#156839" />

      {/* Checkmark badge — top right of shield */}
      <circle cx="248" cy="78" r="16" fill="#22c55e" />
      <path
        d="M241 78 L246 83 L255 72"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Data line cards — left side */}
      <rect x="32" y="100" width="74" height="16" rx="5" fill="white" />
      <rect x="38" y="106" width="16" height="4" rx="2" fill="#86efac" />
      <rect x="58" y="106" width="28" height="4" rx="2" fill="#d1fae5" />

      <rect x="24" y="124" width="82" height="16" rx="5" fill="white" />
      <rect x="30" y="130" width="16" height="4" rx="2" fill="#86efac" />
      <rect x="50" y="130" width="36" height="4" rx="2" fill="#d1fae5" />

      <rect x="32" y="148" width="70" height="16" rx="5" fill="white" />
      <rect x="38" y="154" width="16" height="4" rx="2" fill="#86efac" />
      <rect x="58" y="154" width="22" height="4" rx="2" fill="#d1fae5" />

      {/* Arrow pointing to shield from data cards */}
      <path
        d="M106 140 L118 140"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />

      {/* Encrypted output cards — right side */}
      <rect x="274" y="100" width="78" height="16" rx="5" fill="white" />
      <rect x="280" y="106" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="292" y="106" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="304" y="106" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="316" y="106" width="26" height="4" rx="2" fill="#86efac" />

      <rect x="278" y="124" width="74" height="16" rx="5" fill="white" />
      <rect x="284" y="130" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="296" y="130" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="308" y="130" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="320" y="130" width="22" height="4" rx="2" fill="#86efac" />

      <rect x="274" y="148" width="78" height="16" rx="5" fill="white" />
      <rect x="280" y="154" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="292" y="154" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="304" y="154" width="8" height="4" rx="2" fill="#d1fae5" />
      <rect x="316" y="154" width="26" height="4" rx="2" fill="#86efac" />

      {/* Arrow from shield to encrypted output */}
      <path
        d="M262 140 L272 140"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />

      {/* Floating dots */}
      <circle cx="44" cy="82" r="5" fill="#86efac" opacity="0.65" />
      <circle cx="338" cy="82" r="4" fill="#4ade80" opacity="0.6" />
      <circle cx="326" cy="200" r="6" fill="#86efac" opacity="0.5" />
      <circle cx="52" cy="200" r="4" fill="#4ade80" opacity="0.5" />
      <circle cx="190" cy="36" r="3" fill="#156839" opacity="0.4" />

      {/* Bottom pill label */}
      <rect x="120" y="230" width="140" height="28" rx="14" fill="#156839" />
      <text
        x="190"
        y="249"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="700"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        Your Data, Protected
      </text>
    </svg>
  );
}

export function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-[15px] text-setu-800/55 leading-[1.75] max-w-lg mb-3">
              Your privacy matters to us. This policy explains what data we
              collect, how we use it, and your rights as a Setu user.
            </p>
            <p className="text-[13px] text-setu-600/50 font-medium">
              Last updated: January 1, 2025 · Effective: January 1, 2025
            </p>
          </div>
          {/* Illustration */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-setu-100 p-4 shadow-[0_2px_12px_rgba(21,104,57,0.05)]">
              <PrivacyIllustration />
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
                  Contents
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
                <div className="mt-4 pt-4 border-t border-setu-100">
                  <a
                    href="mailto:dipendraroka947@gmail.com"
                    className="text-[12px] font-semibold text-setu-600 hover:text-setu-700 no-underline"
                  >
                    dipendraroka947@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="bg-setu-50 rounded-2xl border border-setu-100 p-6">
                <p className="text-[15px] text-setu-800 leading-[1.75]">
                  Setu ("we", "our", or "us") operates setu.np. By using Setu,
                  you agree to the collection and use of information as
                  described in this policy. This policy applies to all users —
                  donors, campaign creators, and visitors.
                </p>
              </div>

              {sections.map(({ id, icon: Icon, title, content }) => (
                <div
                  key={id}
                  id={id}
                  className="bg-white rounded-2xl border border-setu-100 p-7 shadow-[0_2px_12px_rgba(21,104,57,0.04)]"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-setu-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-setu-600" />
                    </div>
                    <h2
                      className="text-[20px] font-bold text-setu-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {title}
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {content.map(({ subtitle, text }) => (
                      <div key={subtitle}>
                        <h3 className="text-[14px] font-bold text-setu-800 mb-2">
                          {subtitle}
                        </h3>
                        <p className="text-[14px] text-gray-500 leading-[1.75]">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-setu-900 rounded-2xl p-7">
                <h2
                  className="text-[18px] font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Contact Our Privacy Team
                </h2>
                <p className="text-[14px] text-white/55 leading-[1.75] mb-4">
                  For privacy-related questions, data requests, or to exercise
                  your rights, contact us at:
                </p>
                <a
                  href="mailto:dipendraroka947@gmail.com"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-setu-300 no-underline hover:text-setu-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  privacy@setu.np
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPage;