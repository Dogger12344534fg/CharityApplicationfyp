"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  Wifi,
  WifiOff,
} from "lucide-react";
import { useGetTeamById, useGetTeamMessages } from "@/src/hooks/useTeam";
import { useTeamChat } from "@/src/hooks/useTeamChat";
import { useAuth } from "@/src/hooks/useAuth";

const fmtTime = (d: Date | string) =>
  new Date(d).toLocaleTimeString("en-NP", {
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDate = (d: Date | string) => {
  const date = new Date(d);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-NP", { day: "numeric", month: "short" });
};

export default function TeamChatPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();

  const { data: teamData, isLoading: teamLoading } = useGetTeamById(id);
  const team = teamData?.data;

  // Is the current user a member?
  const isMember = useMemo(() => {
    if (!team || !user) return false;
    return (
      team.createdBy?._id === user._id ||
      team.createdBy === user._id ||
      team.members?.some(
        (m: any) => m.user?._id === user._id || m.user === user._id,
      )
    );
  }, [team, user]);

  // ── REST history ──────────────────────────────────────────────────────────
  const { data: historyData, isLoading: historyLoading } = useGetTeamMessages(
    id,
    isMember,
  );

  // ── Live socket ───────────────────────────────────────────────────────────
  const { liveMessages, onlineCount, connected, sendMessage } = useTeamChat(
    id,
    isMember,
  );

  // ── Merge history + live (de-dup by _id) ─────────────────────────────────
  const allMessages = useMemo(() => {
    const history = historyData?.data ?? [];
    const historyIds = new Set(history.map((m) => m._id));
    const newLive = liveMessages.filter((m) => !historyIds.has(m._id));
    return [...history, ...newLive];
  }, [historyData, liveMessages]);

  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!historyLoading) {
      setTimeout(
        () => chatEndRef.current?.scrollIntoView({ behavior: "instant" }),
        50,
      );
    }
  }, [historyLoading]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !connected) return;
    sendMessage(text);
    setInputText("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f0] flex flex-col"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Top bar */}
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
                  {connected ? (
                    <>
                      <Circle className="w-1.5 h-1.5 fill-emerald-400 text-emerald-400" />
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {onlineCount > 0
                          ? `${onlineCount} online`
                          : "Connected"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-1.5 h-1.5 fill-gray-300 text-gray-300 animate-pulse" />
                      <span className="text-[11px] text-gray-400 font-medium">
                        Connecting…
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Connection status icon */}
            <span
              title={connected ? "Connected" : "Connecting…"}
              className="mr-1"
            >
              {connected ? (
                <Wifi className="w-4 h-4 text-emerald-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-300 animate-pulse" />
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 h-[calc(100vh-160px)]">
          {/* Chat panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {(teamLoading || historyLoading) && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-setu-200 border-t-setu-500 animate-spin" />
                    <p className="text-[12px] text-gray-400">
                      Loading messages…
                    </p>
                  </div>
                </div>
              )}

              {!teamLoading && !historyLoading && isMember && allMessages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-setu-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-setu-400" />
                    </div>
                    <p className="text-[14px] font-semibold text-setu-800 mb-1">
                      No messages yet
                    </p>
                    <p className="text-[12px] text-gray-400">
                      Start the conversation with your team!
                    </p>
                  </div>
                </div>
              )}

              {!teamLoading && !historyLoading &&
                allMessages.map((msg, i) => {
                  const isMine = msg.sender._id === user?._id;
                  const initial =
                    msg.sender.name?.[0]?.toUpperCase() ?? "?";

                  // Show date separator when the day changes
                  const showDate =
                    i === 0 ||
                    fmtDate(allMessages[i - 1].createdAt) !==
                    fmtDate(msg.createdAt);

                  return (
                    <div key={msg._id}>
                      {showDate && (
                        <div className="flex items-center gap-3 my-3">
                          <div className="flex-1 h-px bg-gray-100" />
                          <span className="text-[11px] font-semibold text-gray-400 px-2">
                            {fmtDate(msg.createdAt)}
                          </span>
                          <div className="flex-1 h-px bg-gray-100" />
                        </div>
                      )}
                      <div
                        className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${isMine ? "bg-setu-700" : "bg-gradient-to-br from-setu-600 to-setu-400"}`}
                        >
                          <span className="text-white text-[11px] font-bold">
                            {initial}
                          </span>
                        </div>
                        <div
                          className={`max-w-[72%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
                        >
                          {!isMine && (
                            <span className="text-[11px] font-bold text-setu-600 px-1">
                              {msg.sender.name}
                            </span>
                          )}
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isMine ? "bg-setu-700 text-white rounded-tr-sm" : "bg-white border border-gray-100 text-setu-900 rounded-tl-sm"}`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-gray-400 px-1">
                            {fmtTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3.5 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2.5">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    !isMember
                      ? "Join the team to chat…"
                      : connected
                        ? "Type a message to your team…"
                        : "Connecting…"
                  }
                  value={inputText}
                  disabled={!connected || !isMember}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-[13px] text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || !connected || !isMember}
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

          {/* Members sidebar */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-50 flex items-center justify-between">
                <p className="text-[13px] font-bold text-setu-800">Members</p>
                <span className="text-[11px] font-semibold text-setu-600">
                  {team?.memberCount ?? team?.members?.length ?? 0} total
                </span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                {(team?.members ?? []).map((m: any, i: number) => {
                  const memberUser = m.user;
                  const name = memberUser?.name ?? "Member";
                  const initial = name[0]?.toUpperCase() ?? "M";
                  const isCreator =
                    team?.createdBy?._id === memberUser?._id ||
                    team?.createdBy === memberUser?._id;
                  const isCurrentUser = memberUser?._id === user?._id;

                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-setu-600 to-setu-400 flex items-center justify-center">
                          <span className="text-white text-[11px] font-bold">
                            {initial}
                          </span>
                        </div>
                        {/* Online dot for current user only */}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${isCurrentUser && connected ? "bg-emerald-400" : "bg-gray-300"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-semibold text-setu-900 truncate">
                            {name}
                            {isCurrentUser && (
                              <span className="text-gray-400"> (you)</span>
                            )}
                          </p>
                          {(isCreator || m.role === "admin") && (
                            <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400">
                          {m.role === "admin" || isCreator ? "Admin" : "Member"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-setu-50 border border-setu-100 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-setu-700 mb-2 flex items-center gap-1.5">
                {connected ? (
                  <Wifi className="w-3 h-3 text-emerald-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-gray-400" />
                )}
                {connected ? "Live chat active" : "Connecting…"}
              </p>
              <p className="text-[11px] text-setu-600/70 leading-relaxed">
                {connected
                  ? "Messages are delivered instantly to all online members."
                  : "Establishing connection to the chat server…"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}