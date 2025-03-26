"use client";

import { useState, useEffect, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import type { ChatMessage } from "@/types/message";
import { TIKTOK_SERVER_URL, DEFAULT_TIKTOK_USERNAME } from "@/lib/config";

interface GameState {
  channelName: string;
  level: number;
  currentXP: number;
  maxXP: number;
  isConnected: boolean;
}

interface ConnectionStatus {
  connected: boolean;
  message: string;
}

interface GiftReceived {
  uniqueId: string;
  giftId: number;
  repeatCount: number;
  xpAwarded: number;
}

export function useTikTokLive() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    channelName: DEFAULT_TIKTOK_USERNAME,
    level: 1,
    currentXP: 100,
    maxXP: 1000,
    isConnected: false,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    message: "Not connected",
  });
  const [lastGift, setLastGift] = useState<GiftReceived | null>(null);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const newSocket = io(TIKTOK_SERVER_URL);
    setSocket(newSocket);

    // Listen for game state updates from the server
    newSocket.on("gameStateUpdate", (data: GameState) => {
      setGameState(data);
    });

    // Listen for connection status updates
    newSocket.on("connectionStatus", (data: ConnectionStatus) => {
      setConnectionStatus(data);
    });

    // Listen for chat messages
    newSocket.on("chatMessage", (data: ChatMessage) => {
      setChatMessages((prev) => [...prev, data].slice(-50)); // Keep last 50 messages
    });

    // Listen for gifts
    newSocket.on("giftReceived", (data: GiftReceived) => {
      setLastGift(data);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Connect to a specific TikTok username
  const connectToTikTok = useCallback(
    (username: string = DEFAULT_TIKTOK_USERNAME) => {
      if (socket) {
        socket.emit("connectToTikTok", { username });
      }
    },
    [socket]
  );

  // Add test XP for testing
  const addTestXP = useCallback(
    (xp: number = 100) => {
      if (socket) {
        socket.emit("addTestXP", { xp });
      }
    },
    [socket]
  );

  return {
    gameState,
    connectionStatus,
    chatMessages,
    lastGift,
    connectToTikTok,
    addTestXP,
  };
} 