"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface LevelNotificationProps {
  level: number
  show: boolean
  onHide: () => void
}

export default function LevelNotification({ level, show, onHide }: LevelNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (show) {
      setIsVisible(true)
      
      // Auto hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false)
        onHide()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [show, onHide])
  
  if (!show) return null
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-lg shadow-lg text-center">
            <div className="text-sm uppercase tracking-wider opacity-80">Level Up!</div>
            <div className="text-3xl font-bold">Level {level} Achieved</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 