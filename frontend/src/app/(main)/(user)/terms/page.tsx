// ═══════════════════════════════════════════════
// TERMS OF SERVICE — app/(main)/terms/page.tsx
// ═══════════════════════════════════════════════
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
      "Setu charges a platform fee of 3% of funds raised. Payment processing fees apply separately.",
      "Funds are disbursed to verified bank accounts on a weekly schedule, or express 24-hour disbursement for emergency campaigns.",
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

export function TermsPage() {
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
                  href="mailto:legal@setu.np"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-setu-300 no-underline hover:text-setu-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  legal@setu.np
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
