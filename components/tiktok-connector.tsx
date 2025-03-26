"use client"

import { useState } from "react"
import { useTikTokLive } from "@/hooks/useTikTokLive"
import { DEFAULT_TIKTOK_USERNAME } from "@/lib/config"

export default function TikTokConnector() {
  const {
    gameState,
    connectionStatus,
    connectToTikTok,
    addTestXP
  } = useTikTokLive();

  const [username, setUsername] = useState(DEFAULT_TIKTOK_USERNAME);
  const [testXP, setTestXP] = useState(100);

  const handleConnect = () => {
    connectToTikTok(username);
  };

  const handleAddXP = () => {
    addTestXP(testXP);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-md shadow-lg">
      <h2 className="text-xl font-bold mb-4">TikTok Live Connection</h2>
      
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-1 text-gray-300 text-sm">Status:</p>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{connectionStatus.connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          {connectionStatus.message && (
            <p className="text-gray-400 text-xs mt-1">{connectionStatus.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            TikTok Username
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow p-2 bg-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="TikTok username"
            />
            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors"
            >
              Connect
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-3 mt-2">
          <p className="mb-2 text-sm">Testing Tools</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={testXP}
              onChange={(e) => setTestXP(parseInt(e.target.value) || 0)}
              className="w-20 p-2 bg-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
              max="1000"
            />
            <button
              onClick={handleAddXP}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors"
            >
              Add XP
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-3 mt-2">
          <p className="mb-1 text-gray-300 text-sm">Game State:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Channel:</span> {gameState.channelName}
            </div>
            <div>
              <span className="text-gray-400">Connected:</span> {gameState.isConnected ? 'Yes' : 'No'}
            </div>
            <div>
              <span className="text-gray-400">Level:</span> {gameState.level}
            </div>
            <div>
              <span className="text-gray-400">XP:</span> {gameState.currentXP}/{gameState.maxXP}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 