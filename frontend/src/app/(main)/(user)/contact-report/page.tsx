// ═══════════════════════════════════════════════
// CONTACT PAGE — app/(main)/contact/page.tsx
// ═══════════════════════════════════════════════
"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  ChevronDown,
} from "lucide-react";

export function ContactPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (name && email && message) setSent(true);
  };

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
            Get in Touch
          </div>
          <h1
            className="text-[clamp(34px,5vw,58px)] font-bold text-setu-950 leading-tight tracking-[-1.5px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We're Here to
            <br />
            <em className="italic text-setu-600">Help.</em>
          </h1>
          <p className="text-[16px] text-setu-800/55 leading-[1.8] max-w-lg">
            Have a question, a problem, or a partnership proposal? Our team
            typically responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10">
            {/* Contact form */}
            <div className="bg-white rounded-3xl border border-setu-100 p-8 shadow-[0_4px_20px_rgba(21,104,57,0.06)]">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-setu-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Send className="w-7 h-7 text-setu-600" />
                  </div>
                  <h2
                    className="text-[24px] font-bold text-setu-950 mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Message Sent!
                  </h2>
                  <p className="text-[15px] text-setu-600/60 max-w-sm mx-auto">
                    We've received your message and will get back to you within
                    24 hours at{" "}
                    <strong className="text-setu-700">{email}</strong>.
                  </p>
                </div>
              ) : (
                <>
                  <h2
                    className="text-[22px] font-bold text-setu-950 mb-7"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Send us a Message
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                        Your Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Ramesh Shrestha"
                        className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] text-setu-900 placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/15 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                        Email Address
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] text-setu-900 placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/15 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mb-4 relative">
                    <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] text-setu-900 outline-none focus:ring-2 focus:ring-setu-500/15 appearance-none cursor-pointer transition-all bg-white"
                    >
                      <option value="">Select a topic</option>
                      <option>General Inquiry</option>
                      <option>Campaign Support</option>
                      <option>Donation Issue</option>
                      <option>Partnership</option>
                      <option>Media / Press</option>
                      <option>Technical Problem</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-[42px] w-4 h-4 text-setu-400 pointer-events-none" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] text-setu-900 placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/15 resize-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-setu-700 hover:bg-setu-600 text-white text-[15px] font-bold rounded-full transition-all shadow-[0_6px_20px_rgba(21,104,57,0.3)] hover:shadow-[0_10px_28px_rgba(21,104,57,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </>
              )}
            </div>

            {/* Info panel */}
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  value: "hello@setu.np",
                  sub: "For general inquiries & support",
                  href: "mailto:hello@setu.np",
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  value: "+977 01-000-0000",
                  sub: "Mon–Fri, 9am–5pm Nepal Time",
                  href: "tel:+97701000000",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  value: "Kathmandu, Nepal",
                  sub: "Thamel, KTM 44600",
                  href: "#",
                },
                {
                  icon: Clock,
                  title: "Response Time",
                  value: "Within 24 Hours",
                  sub: "We respond to all messages",
                  href: null,
                },
                {
                  icon: MessageCircle,
                  title: "Live Chat",
                  value: "Available Now",
                  sub: "Chat with support instantly",
                  href: "#",
                },
              ].map(({ icon: Icon, title, value, sub, href }) => (
                <div
                  key={title}
                  className={`flex items-center gap-4 p-5 bg-white rounded-2xl border border-setu-100 ${href ? "hover:shadow-[0_4px_16px_rgba(21,104,57,0.07)] hover:border-setu-200 transition-all" : ""}`}
                >
                  <div className="w-12 h-12 bg-setu-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-setu-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-setu-600/55 uppercase tracking-wide">
                      {title}
                    </p>
                    <p className="text-[15px] font-bold text-setu-950">
                      {value}
                    </p>
                    <p className="text-[12px] text-setu-600/55 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;

// ═══════════════════════════════════════════════
// REPORT ISSUE PAGE — app/(main)/report/page.tsx
// ═══════════════════════════════════════════════
// Save this section separately as report-page.tsx

export function ReportIssuePage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <section className="bg-white border-b border-setu-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-red-600 mb-4">
            <div className="w-6 h-[2px] bg-red-500 rounded" />
            Safety & Trust
          </div>
          <h1
            className="text-[clamp(30px,4vw,50px)] font-bold text-setu-950 leading-tight tracking-[-1px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Report an Issue
          </h1>
          <p className="text-[16px] text-setu-800/55 leading-[1.8]">
            Help us keep Setu safe. If you've spotted a fraudulent campaign,
            suspicious activity, or a technical problem — let us know
            immediately.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10">
            <div className="bg-white rounded-3xl border border-setu-100 p-8 shadow-[0_4px_20px_rgba(21,104,57,0.06)]">
              <h2
                className="text-[20px] font-bold text-setu-950 mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Submit a Report
              </h2>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                  Type of Issue <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Fraudulent Campaign",
                      color:
                        "border-red-200 bg-red-50 text-red-700 hover:border-red-400",
                    },
                    {
                      label: "Fake Identity",
                      color:
                        "border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400",
                    },
                    {
                      label: "Misleading Info",
                      color:
                        "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400",
                    },
                    {
                      label: "Technical Bug",
                      color:
                        "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400",
                    },
                    {
                      label: "Harassment",
                      color:
                        "border-purple-200 bg-purple-50 text-purple-700 hover:border-purple-400",
                    },
                    {
                      label: "Other",
                      color:
                        "border-setu-200 bg-setu-50 text-setu-700 hover:border-setu-400",
                    },
                  ].map(({ label, color }) => (
                    <button
                      key={label}
                      className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all cursor-pointer text-left ${color}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                  Campaign URL or ID (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. setu.np/campaigns/123 or Campaign #123"
                  className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/15 transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                  Describe the Issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Please provide as much detail as possible — what you saw, when it happened, and any evidence you have."
                  className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/15 resize-none transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Anonymous"
                    className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-setu-800 mb-2">
                    Email (for follow-up)
                  </label>
                  <input
                    type="email"
                    placeholder="optional@example.com"
                    className="w-full px-4 py-3 border border-setu-200 focus:border-setu-500 rounded-xl text-[14px] placeholder:text-setu-300 outline-none focus:ring-2 focus:ring-setu-500/15 transition-all"
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[15px] font-bold rounded-full transition-all shadow-[0_6px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_10px_28px_rgba(220,38,38,0.4)] hover:-translate-y-0.5">
                Submit Report
              </button>
              <p className="text-[12px] text-setu-600/50 text-center mt-3">
                All reports are reviewed within 24 hours. You can submit
                anonymously.
              </p>
            </div>

            <div className="space-y-5">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3
                  className="text-[16px] font-bold text-red-900 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  🚨 Emergency?
                </h3>
                <p className="text-[14px] text-red-700/80 leading-[1.7] mb-4">
                  If you believe a campaign is actively scamming donors or a
                  crime is in progress, contact us immediately.
                </p>
                <a
                  href="mailto:safety@setu.np"
                  className="flex items-center gap-2 text-[14px] font-bold text-red-700 no-underline hover:underline"
                >
                  📧 safety@setu.np
                </a>
              </div>

              <div className="bg-white rounded-2xl border border-setu-100 p-6">
                <h3
                  className="text-[15px] font-bold text-setu-950 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  What Happens Next?
                </h3>
                {[
                  "Our team reviews your report within 24 hours.",
                  "We investigate the campaign and verify evidence.",
                  "If confirmed, the campaign is immediately suspended.",
                  "You're notified of the outcome via email.",
                ].map((s, i) => (
                  <div key={i} className="flex gap-3 mb-3 last:mb-0">
                    <div className="w-6 h-6 bg-setu-700 text-white rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-[13px] text-gray-500 leading-[1.6]">
                      {s}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-setu-50 rounded-2xl border border-setu-100 p-5">
                <p className="text-[13px] font-bold text-setu-800 mb-1">
                  All reporters are protected.
                </p>
                <p className="text-[12px] text-setu-600/60 leading-[1.6]">
                  Your identity is kept strictly confidential. We never share
                  reporter information with campaign owners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
