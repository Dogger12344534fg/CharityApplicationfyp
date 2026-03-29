// ═══════════════════════════════════════════════
// PRIVACY POLICY — app/(main)/privacy/page.tsx
// ═══════════════════════════════════════════════
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
        text: "We share transaction data with certified payment partners (eSewa, Khalti, banks) solely to process your donations.",
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
        subtitle: "Access Controls",
        text: "Only authorized Setu staff with a legitimate need can access user data. Access is logged and audited regularly.",
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
        text: "You can request a copy of all data we hold about you at any time from your account settings or by emailing privacy@setu.np.",
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

export function PrivacyPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <section className="bg-white border-b border-setu-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    href="mailto:privacy@setu.np"
                    className="text-[12px] font-semibold text-setu-600 hover:text-setu-700 no-underline"
                  >
                    privacy@setu.np
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
                  href="mailto:privacy@setu.np"
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
