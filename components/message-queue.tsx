"use client"

import { useState, useEffect } from "react"
import type { ChatMessage } from "@/types/message"
import MessageDisplay from "./message-display"
import GamingOverlay from "./gaming-overlay"
import { useTikTokLive } from "@/hooks/useTikTokLive"
import TikTokConnector from "./tiktok-connector"
import Link from "next/link"

// Sample messages from the provided data
const sampleMessages: ChatMessage[] = [
  {
    emotes: [],
    comment: "mano, essa API aí da pra mandar dm? porque dá pra tu fazer uma newsletter kkkk",
    userId: "6893599764378584069",
    secUid: "MS4wLjABAAAAVQzX3FaMM5LOaplU9p970E9vAgPf4PbGmfgE_Lfl_wKykvqqJSNKh4AgA-63ByGi",
    uniqueId: "lalalaalal553",
    nickname: "Gabriel Camargo",
    profilePictureUrl:
      "https://p77-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/7335158850594537493~tplv-tiktokx-cropcenter:100:100.webp",
    followRole: 1,
    userBadges: [],
    userSceneTypes: [],
    userDetails: {
      createTime: "0",
      bioDescription: "",
      profilePictureUrls: [
        "https://p77-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/7335158850594537493~tplv-tiktokx-cropcenter:100:100.webp",
      ],
    },
    followInfo: {
      followingCount: 385,
      followerCount: 21,
      followStatus: 1,
      pushStatus: 0,
    },
    isModerator: false,
    isNewGifter: false,
    isSubscriber: false,
    topGifterRank: null,
    gifterLevel: 0,
    teamMemberLevel: 0,
    msgId: "7485948685005425463",
    createTime: "1742958257747",
  },
  {
    emotes: [],
    comment: "qual o site?",
    userId: "7389009545119319046",
    secUid: "MS4wLjABAAAAs8PINgn55en4zkpnshw1imnlvdq4yeMaByHkVdjd-pJdrXI0MfQFThhbbagpzVWp",
    uniqueId: "izazorel_",
    nickname: "Izaaaaa",
    profilePictureUrl:
      "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0e871e58ee075a3eb17d56c9c4baa9dd~tplv-tiktokx-cropcenter:100:100.webp",
    followRole: 0,
    userBadges: [],
    userSceneTypes: [],
    userDetails: {
      createTime: "0",
      bioDescription: "",
      profilePictureUrls: [
        "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/0e871e58ee075a3eb17d56c9c4baa9dd~tplv-tiktokx-cropcenter:100:100.webp",
      ],
    },
    followInfo: {
      followingCount: 148,
      followerCount: 10,
      followStatus: 0,
      pushStatus: 0,
    },
    isModerator: false,
    isNewGifter: false,
    isSubscriber: false,
    topGifterRank: null,
    gifterLevel: 0,
    teamMemberLevel: 0,
    msgId: "7485948751641660165",
    createTime: "1742958276375",
  },
  {
    emotes: [],
    comment: "Como captar cliente, sites de freelancer funciona??",
    userId: "7191201528757011462",
    secUid: "MS4wLjABAAAA1E6ysX4OqIFXc6vJRvXUZ0JWH7e_2KPfvG5D6YJ-3PLA8c47EcTpENWg2JRBkhNP",
    uniqueId: "joomarques881",
    nickname: "joaozimx",
    profilePictureUrl:
      "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7191202810582466566~tplv-tiktokx-cropcenter:100:100.webp",
    followRole: 0,
    userBadges: [],
    userSceneTypes: [],
    userDetails: {
      createTime: "0",
      bioDescription: "",
      profilePictureUrls: [
        "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7191202810582466566~tplv-tiktokx-cropcenter:100:100.webp",
      ],
    },
    followInfo: {
      followingCount: 149,
      followerCount: 17,
      followStatus: 0,
      pushStatus: 0,
    },
    isModerator: false,
    isNewGifter: false,
    isSubscriber: false,
    topGifterRank: null,
    gifterLevel: 0,
    teamMemberLevel: 0,
    msgId: "7485948791703849783",
    createTime: "1742958287051",
  },
]

// Generate two more sample messages to have 5 total
const extraMessages: ChatMessage[] = [
  {
    ...sampleMessages[0],
    comment: "Tô aprendendo muito com essa live!",
    nickname: "DevFan123",
    uniqueId: "devfan123",
    msgId: "extra1",
    createTime: Date.now().toString(),
  },
  {
    ...sampleMessages[1],
    comment: "Qual framework você recomenda para iniciantes?",
    nickname: "CodeNewbie",
    uniqueId: "codenewbie",
    msgId: "extra2",
    createTime: Date.now().toString(),
  },
]

const allMessages = [...sampleMessages, ...extraMessages]

export default function MessageQueue() {
  const {
    gameState,
    chatMessages,
  } = useTikTokLive();

  // Message state
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null)
  const [messageCount, setMessageCount] = useState(0)
  
  // Use live data when available, or sample messages as fallback
  const displayMessages = chatMessages.length > 0 ? chatMessages : allMessages;

  // Process newest message when it arrives
  useEffect(() => {
    if (chatMessages.length > 0) {
      const latestMessage = chatMessages[chatMessages.length - 1];
      setCurrentMessage(latestMessage);
      setMessageCount(chatMessages.length);
    }
  }, [chatMessages]);

  // Process first message on mount if using sample data
  useEffect(() => {
    if (!currentMessage && allMessages.length > 0 && chatMessages.length === 0) {
      const firstMessage = allMessages[0];
      setCurrentMessage(firstMessage);
      setMessageCount(1);
    }
  }, [currentMessage, allMessages, chatMessages]);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <GamingOverlay
          channelName={gameState.channelName}
          level={gameState.level}
          currentXP={gameState.currentXP}
          maxXP={gameState.maxXP}
        />
        <Link 
          href={`/overlay/${gameState.channelName}`} 
          target="_blank" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Open Clean Overlay
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-black bg-opacity-70 p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold">Latest Message</h2>
            <div className="text-purple-400 text-sm">
              Messages: {messageCount}
            </div>
          </div>

          <MessageDisplay message={currentMessage} />

          <div className="mt-4">
            <h3 className="text-white font-bold mb-2">Recent Messages ({displayMessages.length})</h3>
            <div className="grid gap-2">
              {displayMessages.slice(-3).map((msg, index) => (
                <div
                  key={msg.msgId}
                  className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 bg-opacity-30 p-2 rounded"
                >
                  <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">{index + 1}</span>
                  <span className="font-medium">{msg.nickname}:</span>
                  <span className="truncate">{msg.comment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <TikTokConnector />
        </div>
      </div>
    </div>
  )
}

