"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { GamingOverlayProps } from "@/types/overlay"

export default function GamingOverlay({
  channelName = "danielhe4rt",
  level = 1,
  currentXP = 100,
  maxXP = 1000,
  logoUrl = "https://i.imgur.com/vUzVM9n.png",
  theme = "dark",
  showLogo = true,
  showValues = true,
}: GamingOverlayProps) {
  const [mounted, setMounted] = useState(false)
  const [isXPAnimating, setIsXPAnimating] = useState(false)
  const [prevXP, setPrevXP] = useState(currentXP)

  // Ensure hydration completes before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Animate XP changes
  useEffect(() => {
    if (mounted && currentXP !== prevXP) {
      setPrevXP(currentXP)
      setIsXPAnimating(true)
      const timer = setTimeout(() => {
        setIsXPAnimating(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [currentXP, mounted, prevXP])

  if (!mounted) return null

  const progressPercentage = Math.min(100, (currentXP / maxXP) * 100)

  // Theme styles
  const bgColor = {
    dark: "bg-black",
    light: "bg-white",
    transparent: "bg-black/40 backdrop-blur-md"
  }[theme]

  const textColor = {
    dark: "text-white",
    light: "text-gray-800",
    transparent: "text-white"
  }[theme]

  const valueColor = {
    dark: "text-purple-400",
    light: "text-purple-600",
    transparent: "text-purple-300"
  }[theme]

  const valueColorActive = {
    dark: "text-yellow-400",
    light: "text-yellow-600",
    transparent: "text-yellow-300"
  }[theme]

  const progressBg = {
    dark: "bg-gray-800",
    light: "bg-gray-200",
    transparent: "bg-gray-800/60"
  }[theme]

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className={`relative ${bgColor} p-4 rounded-md shadow-2xl flex items-center space-x-4`}>
        {/* Logo */}
        {showLogo && (
          <div className="relative w-16 h-16 rounded-full border-4 border-yellow-400 overflow-hidden flex-shrink-0">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={`${channelName} logo`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Channel name and level */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h2 className={`${textColor} text-2xl font-bold tracking-wider uppercase`}>{channelName}</h2>
            {showValues && (
              <span
                className={`${valueColor} font-medium transition-all duration-300 ${isXPAnimating ? `scale-110 ${valueColorActive}` : ""}`}
              >
                LVL. {level} ({currentXP}/{maxXP})
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className={`h-3 w-full ${progressBg} rounded-full overflow-hidden`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-purple-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Shadow effect */}
      <div className="absolute inset-0 bg-white blur-xl opacity-20 -z-10 rounded-md"></div>
    </div>
  )
}

