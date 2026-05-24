"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Heart,
  Package,
  ShieldCheck,
  CreditCard,
  Users,
  MessageCircle,
  Phone,
  Mail,
  Zap,
} from "lucide-react";


const popular = [
  { q: "How do I start a campaign on Setu?", a: "To start a campaign, navigate to your dashboard and click on 'Create Campaign'. Follow the step-by-step guide to fill in your campaign details, upload necessary documents, and submit it for verification." },
  {
    q: "How long does campaign verification take?",
    a: "Campaign verification typically takes between 24 to 48 hours. Our Trust & Safety team carefully reviews your submitted documents to ensure the legitimacy of the cause.",
  },
  { q: "Can I get a refund on my donation?", a: "Refunds can be requested within 7 days of your donation, provided the funds have not already been disbursed to the campaign creator. Please contact support with your transaction ID." },
  {
    q: "How do I donate goods instead of money?",
    a: "You can donate goods by navigating to the 'Goods Donation' section from the top menu. You can choose to drop off your items at our Setu Foundation Hub or request a pickup if you're in the Kathmandu valley.",
  },
  {
    q: "How are funds disbursed to campaign creators?",
    a: "Funds are securely disbursed directly to the verified account of the campaign creator or the registered NGO. Disbursements can be requested once the campaign hits its initial goal or its end date.",
  },
  { q: "Is eSewa supported?", a: "Yes, we fully support local payment gateways including eSewa." },
  {
    q: "How do I verify my identity for a campaign?",
    a: "During campaign creation, you'll be prompted to upload a government-issued ID (Citizenship, Passport, or License).",
  },
  { q: "Can I donate from outside Nepal?", a: "Currently, Setu primarily supports domestic payment methods. We are actively working on integrating international payment gateways in the near future." },
];

export function HelpPage() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Hero */}
      <section className="bg-setu-900 py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(34,160,91,0.2) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1
            className="text-[clamp(32px,5vw,56px)] font-bold text-white leading-tight tracking-[-1.5px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How can we help?
          </h1>
          <p className="text-[16px] text-white/50 mb-8">
            Search our help center or browse by topic.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            {/* Popular */}
            <div>
              <h2
                className="text-[20px] font-bold text-setu-950 mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Popular Questions
              </h2>
              <div className="space-y-2">
                {popular.map(({ q, a }, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={q}
                      className={`group flex flex-col p-4 bg-white rounded-xl border transition-all cursor-pointer ${isOpen ? 'border-setu-400 shadow-md' : 'border-setu-100 hover:border-setu-300 hover:shadow-[0_4px_14px_rgba(21,104,57,0.08)]'}`}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-setu-100' : 'bg-setu-50 group-hover:bg-setu-100'}`}>
                          <MessageCircle className="w-4 h-4 text-setu-600" />
                        </div>
                        <span className={`flex-1 text-[14px] font-medium transition-colors ${isOpen ? 'text-setu-900' : 'text-setu-800 group-hover:text-setu-700'}`}>
                          {q}
                        </span>
                        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90 text-setu-500' : 'text-setu-300'}`}>
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        </div>
                      </div>
                      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="pl-12 pr-4 text-[13px] leading-relaxed text-setu-600/90 pb-2">
                            {a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact support */}
            <div className="space-y-4">
              <h2
                className="text-[20px] font-bold text-setu-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Still Need Help?
              </h2>
              {[
                {
                  icon: Mail,
                  title: "Email Support",
                  sub: "We reply within 24 hours",
                  cta: "Send Email",
                  href: "mailto:dipendraroka947@gmail.com",
                  available: true,
                },
                {
                  icon: Phone,
                  title: "Phone Support",
                  sub: "Mon–Fri, 9am–5pm NPT",
                  cta: "+977 9816404196",
                  href: "tel:+9779816404196",
                  available: true,
                },
              ].map(({ icon: Icon, title, sub, cta, href, available }) => (
                <a
                  key={title}
                  href={href}
                  className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-setu-100 hover:border-setu-300 hover:shadow-[0_6px_20px_rgba(21,104,57,0.1)] transition-all no-underline"
                >
                  <div className="w-12 h-12 bg-setu-700 group-hover:bg-setu-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-setu-950">
                      {title}
                    </p>
                    <p className="text-[12px] text-setu-600/55 mt-0.5">{sub}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${available ? "bg-setu-400" : "bg-gray-300"}`}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpPage;
