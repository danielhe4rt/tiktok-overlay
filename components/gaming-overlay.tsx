"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface GamingOverlayProps {
  channelName?: string
  level?: number
  currentXP?: number
  maxXP?: number
  theme?: "dark" | "light" | "transparent"
  showLogo?: boolean
  showValues?: boolean
  logoUrl?: string
}

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
  const [isXPAnimating, setIsXPAnimating] = useState(false)

  // Animate XP changes
  useEffect(() => {
    console.log(`GamingOverlay received: Level ${level}, XP ${currentXP}/${maxXP}`)
    setIsXPAnimating(true)

    const timer = setTimeout(() => {
      setIsXPAnimating(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentXP, level, maxXP])

  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.max(0, (currentXP / maxXP) * 100))

  return (
    <div className="relative w-full  mx-auto">
      <div className="relative bg-black p-4 rounded-md shadow-2xl flex items-center space-x-4">
        {/* Logo */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={`${channelName} logo`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Channel name and level */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white text-2xl font-bold tracking-wider uppercase">{channelName}</h2>
            <span
              className={`transition-all duration-300 font-medium ${
                isXPAnimating ? "text-yellow-400 scale-110" : "text-purple-400"
              }`}
            >
              LVL. {level} ({currentXP}/{maxXP})
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
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

