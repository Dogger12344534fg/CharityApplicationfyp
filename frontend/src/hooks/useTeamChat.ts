"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
    _id: string;
    sender: { _id: string; name: string; email: string };
    text: string;
    createdAt: string;
}

interface UseTeamChatReturn {
    /** Live messages received over the socket since mount */
    liveMessages: ChatMessage[];
    /** Number of users currently in this team's room */
    onlineCount: number;
    /** Whether the socket is connected */
    connected: boolean;
    /** Send a message — fires socket event, server broadcasts back to everyone */
    sendMessage: (text: string) => void;
}

/**
 * Connects to the Socket.io server, joins the team room, and streams
 * live messages in real-time. Pass enabled=false to skip connecting
 * (e.g. when the user is not yet a member).
 */
export function useTeamChat(
    teamId: string,
    enabled = true,
): UseTeamChatReturn {
    const socketRef = useRef<Socket | null>(null);
    const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
    const [onlineCount, setOnlineCount] = useState(0);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!enabled || !teamId) return;

        // Must run client-side only (token lives in localStorage)
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;

        const socketUrl =
            process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

        const socket = io(socketUrl, {
            auth: { token },
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            // Tell the server which team room to join
            socket.emit("join_team", teamId);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on("new_message", (msg: ChatMessage) => {
            setLiveMessages((prev) => [...prev, msg]);
        });

        socket.on("online_count", (count: number) => {
            setOnlineCount(count);
        });

        socket.on("chat_error", (msg: string) => {
            console.error("[TeamChat] socket error:", msg);
        });

        return () => {
            socket.emit("leave_team", teamId);
            socket.disconnect();
            socketRef.current = null;
            setConnected(false);
        };
    }, [teamId, enabled]);

    const sendMessage = useCallback(
        (text: string) => {
            if (!socketRef.current?.connected) return;
            socketRef.current.emit("send_message", { teamId, text });
        },
        [teamId],
    );

    return { liveMessages, onlineCount, connected, sendMessage };
}