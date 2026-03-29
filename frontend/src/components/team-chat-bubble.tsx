"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  X,
  Maximize2,
  Send,
  ChevronDown,
  Circle,
} from "lucide-react";

type ChatMessage = {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: Date;
  isMine?: boolean;
};

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "Ramesh K.",
    avatar: "R",
    text: "Great progress everyone! We just hit 40% of our goal.",
    time: new Date(Date.now() - 1000 * 60 * 42),
  },
  {
    id: "2",
    sender: "Sita M.",
    avatar: "S",
    text: "Amazing! Shared on Facebook. Let's keep pushing.",
    time: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "3",
    sender: "Priya S.",
    avatar: "P",
    text: "I just donated NPR 2,000. Can everyone share with 5 friends?",
    time: new Date(Date.now() - 1000 * 60 * 10),
  },
];

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });

interface TeamChatBubbleProps {
  teamId: string;
  teamName: string;
  onlineCount?: number;
}

export function TeamChatBubble({
  teamId,
  teamName,
  onlineCount = 3,
}: TeamChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [unread, setUnread] = useState(SEED_MESSAGES.length);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(0);
    }
  }, [messages, isOpen]);

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
      className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end gap-3"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {isOpen && (
        <div className="w-[320px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-setu-950 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 flex-shrink-0" />
              <p className="text-[13px] font-bold text-white truncate">
                {teamName}
              </p>
              <span className="text-[10px] text-white/40 flex-shrink-0">
                {onlineCount} online
              </span>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Link
                href={`/teams/${teamId}/chat`}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                title="Open full chat"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="h-[260px] overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}
              >
                {!msg.isMine && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-setu-600 to-setu-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-[9px] font-bold">
                      {msg.avatar}
                    </span>
                  </div>
                )}
                {msg.isMine && (
                  <div className="w-6 h-6 rounded-full bg-setu-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-[9px] font-bold">Y</span>
                  </div>
                )}
                <div
                  className={`max-w-[78%] flex flex-col gap-0.5 ${msg.isMine ? "items-end" : "items-start"}`}
                >
                  {!msg.isMine && (
                    <span className="text-[9px] font-bold text-setu-600 px-1">
                      {msg.sender}
                    </span>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed shadow-sm ${msg.isMine ? "bg-setu-700 text-white rounded-tr-sm" : "bg-white border border-gray-100 text-setu-900 rounded-tl-sm"}`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 px-1">
                    {fmtTime(msg.time)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="px-3 py-2.5 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Message your team…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-[12px] text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-8 h-8 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-200 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer border-none disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
            <Link
              href={`/teams/${teamId}/chat`}
              className="text-[11px] font-semibold text-setu-600 hover:text-setu-500 transition-colors no-underline"
            >
              Open full chat →
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 bg-setu-700 hover:bg-setu-600 text-white rounded-full shadow-[0_8px_28px_rgba(21,104,57,0.45)] hover:shadow-[0_12px_36px_rgba(21,104,57,0.55)] hover:-translate-y-1 transition-all flex items-center justify-center cursor-pointer border-none relative"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
