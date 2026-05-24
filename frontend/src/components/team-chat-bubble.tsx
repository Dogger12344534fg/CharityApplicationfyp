"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MessageCircle,
  X,
  Maximize2,
  Send,
  ChevronDown,
  Circle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useTeamChat } from "@/src/hooks/useTeamChat";
import { useGetTeamMessages } from "@/src/hooks/useTeam";
import { useAuth } from "@/src/hooks/useAuth";

const fmtTime = (d: Date | string) =>
  new Date(d).toLocaleTimeString("en-NP", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface TeamChatBubbleProps {
  teamId: string;
  teamName: string;
  /** Controlled from parent — pass !!isMember so socket only opens for members */
  enabled?: boolean;
}

export function TeamChatBubble({
  teamId,
  teamName,
  enabled = true,
}: TeamChatBubbleProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── REST history (fetched once, stale-time: Infinity) ─────────────────────
  const { data: historyData } = useGetTeamMessages(teamId, enabled);

  // ── Live socket ───────────────────────────────────────────────────────────
  const { liveMessages, onlineCount, connected, sendMessage } = useTeamChat(
    teamId,
    enabled,
  );

  // ── Merge: history + live (de-dup by _id) ────────────────────────────────
  const allMessages = useMemo(() => {
    const history = historyData?.data ?? [];
    const historyIds = new Set(history.map((m) => m._id));
    const newLive = liveMessages.filter((m) => !historyIds.has(m._id));
    return [...history, ...newLive];
  }, [historyData, liveMessages]);

  // unread count = live messages received while bubble is closed
  const [lastReadCount, setLastReadCount] = useState(0);
  const unread = isOpen ? 0 : Math.max(0, liveMessages.length - lastReadCount);

  useEffect(() => {
    if (isOpen) {
      setLastReadCount(liveMessages.length);
      setTimeout(
        () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  }, [isOpen, allMessages.length]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveMessages.length]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !connected) return;
    sendMessage(text);
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
          {/* Header */}
          <div className="bg-setu-950 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 flex-shrink-0" />
              <p className="text-[13px] font-bold text-white truncate">
                {teamName}
              </p>
              <span className="text-[10px] text-white/40 flex-shrink-0">
                {onlineCount > 0 ? `${onlineCount} online` : ""}
              </span>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {/* Connection indicator */}
              <span title={connected ? "Connected" : "Connecting…"}>
                {connected ? (
                  <Wifi className="w-3 h-3 text-emerald-400 mr-1" />
                ) : (
                  <WifiOff className="w-3 h-3 text-white/30 mr-1 animate-pulse" />
                )}
              </span>
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

          {/* Messages */}
          <div className="h-[260px] overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/40">
            {allMessages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  No messages yet.
                  <br />
                  Be the first to say something!
                </p>
              </div>
            )}
            {allMessages.map((msg) => {
              const isMine = msg.sender._id === user?._id;
              const initial =
                msg.sender.name?.[0]?.toUpperCase() ?? "?";
              return (
                <div
                  key={msg._id}
                  className={`flex gap-2 ${isMine ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${isMine ? "bg-setu-700" : "bg-gradient-to-br from-setu-600 to-setu-400"}`}
                  >
                    <span className="text-white text-[9px] font-bold">
                      {initial}
                    </span>
                  </div>
                  <div
                    className={`max-w-[78%] flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}
                  >
                    {!isMine && (
                      <span className="text-[9px] font-bold text-setu-600 px-1">
                        {msg.sender.name}
                      </span>
                    )}
                    <div
                      className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed shadow-sm ${isMine ? "bg-setu-700 text-white rounded-tr-sm" : "bg-white border border-gray-100 text-setu-900 rounded-tl-sm"}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-400 px-1">
                      {fmtTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                connected ? "Message your team…" : "Connecting…"
              }
              value={inputText}
              disabled={!connected}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-[12px] text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || !connected}
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

      {/* Floating button */}
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