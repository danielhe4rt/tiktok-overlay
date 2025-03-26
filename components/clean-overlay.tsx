"use client"

import { useTikTokLive } from "@/hooks/useTikTokLive"
import GamingOverlay from "./gaming-overlay"
import OverlayHelp from "./overlay-help"
import LevelNotification from "./level-notification"
import { useEffect, useState, useCallback } from "react"
import { DEFAULT_TIKTOK_USERNAME } from "@/lib/config"
import type { CleanOverlayProps } from "@/types/overlay"

export default function CleanOverlay({ 
  username,
  theme = "dark",
  showLogo = true,
  showValues = true
}: CleanOverlayProps) {
  const { gameState, connectToTikTok, addTestXP } = useTikTokLive()
  const [isLevelUp, setIsLevelUp] = useState(false)
  const [prevLevel, setPrevLevel] = useState(1)
  const [showLevelNotification, setShowLevelNotification] = useState(false)

  // Auto-connect to TikTok when the component mounts
  useEffect(() => {
    // Small delay to ensure socket is initialized
    const timer = setTimeout(() => {
      connectToTikTok(username || DEFAULT_TIKTOK_USERNAME)
    }, 1000)

    return () => clearTimeout(timer)
  }, [connectToTikTok, username])

  // Detect level ups
  useEffect(() => {
    if (gameState.level > prevLevel) {
      // Animate the overlay
      setIsLevelUp(true)
      // Show the level notification
      setShowLevelNotification(true)
      // Update the previous level
      setPrevLevel(gameState.level)
      
      // Reset the animation after it plays
      const timer = setTimeout(() => {
        setIsLevelUp(false)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [gameState.level, prevLevel])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Press 'C' to connect/reconnect
    if (e.key === 'c' || e.key === 'C') {
      connectToTikTok(username || DEFAULT_TIKTOK_USERNAME)
    }
    
    // Press '+' to add 100 XP (for testing)
    if (e.key === '+') {
      addTestXP(100)
    }
    
    // Press '1-9' to add 100-900 XP (for testing)
    if (/^[1-9]$/.test(e.key)) {
      const xp = parseInt(e.key) * 100
      addTestXP(xp)
    }
  }, [connectToTikTok, addTestXP, username])

  // Add keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="w-2/3">
        <GamingOverlay
          channelName={gameState.channelName}
          level={gameState.level}
          currentXP={gameState.currentXP}
          maxXP={gameState.maxXP}
          theme={theme as "dark" | "light" | "transparent"}
          showLogo={showLogo}
          showValues={showValues}
        />
      </div>
      
     
    </div>
  )
} 