"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Users,
  Circle,
  Crown,
  Search,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { useGetTeamById } from "@/src/hooks/useTeam";

type ChatMessage = {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: Date;
  isMine?: boolean;
};

const SEED: ChatMessage[] = [
  {
    id: "1",
    sender: "Ramesh K.",
    avatar: "R",
    text: "Great progress everyone! We just hit 40% of our goal.",
    time: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "2",
    sender: "Sita M.",
    avatar: "S",
    text: "Amazing! I shared on Facebook. Let's keep pushing.",
    time: new Date(Date.now() - 1000 * 60 * 55),
  },
  {
    id: "3",
    sender: "Priya S.",
    avatar: "P",
    text: "I just donated NPR 2,000. Can everyone share with at least 5 friends?",
    time: new Date(Date.now() - 1000 * 60 * 48),
  },
  {
    id: "4",
    sender: "Ramesh K.",
    avatar: "R",
    text: "Will do! Our next milestone is NPR 50,000. We can hit it by end of week.",
    time: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "5",
    sender: "Hari B.",
    avatar: "H",
    text: "I just joined the team. How can I help spread the word?",
    time: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "6",
    sender: "Sita M.",
    avatar: "S",
    text: "Welcome Hari! Share with your network and ask them to donate even a small amount. Every rupee counts.",
    time: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "7",
    sender: "Ramesh K.",
    avatar: "R",
    text: "Also sharing in the alumni group. Fingers crossed!",
    time: new Date(Date.now() - 1000 * 60 * 8),
  },
];

const MOCK_MEMBERS = [
  { name: "Sita M.", avatar: "S", role: "Leader", online: true },
  { name: "Ramesh K.", avatar: "R", role: "Member", online: true },
  { name: "Priya S.", avatar: "P", role: "Member", online: false },
  { name: "Hari B.", avatar: "H", role: "Member", online: true },
  { name: "Maya T.", avatar: "M", role: "Member", online: false },
];

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });

const fmtDate = (d: Date) => {
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  return d.toLocaleDateString("en-NP", { day: "numeric", month: "short" });
};

export default function TeamChatPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data } = useGetTeamById(id);
  const team = data?.data;

  const [messages, setMessages] = useState<ChatMessage[]>(SEED);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onlineCount = MOCK_MEMBERS.filter((m) => m.online).length;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: "You",
        avatar: "Y",
        text,
        time: new Date(),
        isMine: true,
      },
    ]);
    setInputText("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f0] flex flex-col"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/teams/${id}`}
              className="flex items-center gap-1.5 text-setu-600 font-semibold no-underline hover:text-setu-500 transition-colors text-[13px]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              {team?.avatar?.url ? (
                <img
                  src={team.avatar.url}
                  alt={team.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-setu-700 to-setu-500 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <p className="text-[14px] font-bold text-setu-950 leading-none">
                  {team?.name ?? "Team Chat"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Circle className="w-1.5 h-1.5 fill-emerald-400 text-emerald-400" />
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {onlineCount} online
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors border-none bg-transparent cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors border-none bg-transparent cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 h-[calc(100vh-160px)]">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((msg, i) => {
                const showDate =
                  i === 0 ||
                  fmtDate(messages[i - 1].time) !== fmtDate(msg.time);
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[11px] font-semibold text-gray-400 px-2">
                          {fmtDate(msg.time)}
                        </span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                    )}
                    <div
                      className={`flex gap-3 ${msg.isMine ? "flex-row-reverse" : ""}`}
                    >
                      {!msg.isMine && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-setu-600 to-setu-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <span className="text-white text-[11px] font-bold">
                            {msg.avatar}
                          </span>
                        </div>
                      )}
                      {msg.isMine && (
                        <div className="w-8 h-8 rounded-full bg-setu-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <span className="text-white text-[11px] font-bold">
                            Y
                          </span>
                        </div>
                      )}
                      <div
                        className={`max-w-[72%] flex flex-col gap-1 ${msg.isMine ? "items-end" : "items-start"}`}
                      >
                        {!msg.isMine && (
                          <span className="text-[11px] font-bold text-setu-600 px-1">
                            {msg.sender}
                          </span>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.isMine ? "bg-setu-700 text-white rounded-tr-sm" : "bg-white border border-gray-100 text-setu-900 rounded-tl-sm"}`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 px-1">
                          {fmtTime(msg.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="px-4 py-3.5 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2.5">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message to your team…"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-[13px] text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="w-11 h-11 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-200 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer border-none disabled:cursor-not-allowed flex-shrink-0 shadow-[0_2px_8px_rgba(21,104,57,0.3)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Messages are visible to all team members
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-50 flex items-center justify-between">
                <p className="text-[13px] font-bold text-setu-800">Members</p>
                <span className="text-[11px] font-semibold text-setu-600">
                  {MOCK_MEMBERS.length} total
                </span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                {MOCK_MEMBERS.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-setu-600 to-setu-400 flex items-center justify-center">
                        <span className="text-white text-[11px] font-bold">
                          {m.avatar}
                        </span>
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${m.online ? "bg-emerald-400" : "bg-gray-300"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-semibold text-setu-900 truncate">
                          {m.name}
                        </p>
                        {m.role === "Leader" && (
                          <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {m.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-setu-50 border border-setu-100 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-setu-700 mb-2">
                Real-time chat
              </p>
              <p className="text-[11px] text-setu-600/70 leading-relaxed">
                Messages here are visible to all team members. Integrate
                Socket.io for live updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
