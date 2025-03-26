"use client"

import { useState, useEffect } from "react"

export default function OverlayHelp() {
  const [showHelp, setShowHelp] = useState(false)

  // Toggle help when pressing '?' or 'h'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        setShowHelp(prev => !prev)
      }
      
      // Hide with Escape
      if (e.key === 'Escape') {
        setShowHelp(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  // Auto-hide after 10 seconds
  useEffect(() => {
    if (showHelp) {
      const timer = setTimeout(() => {
        setShowHelp(false)
      }, 10000)
      
      return () => clearTimeout(timer)
    }
  }, [showHelp])

  if (!showHelp) return null

  return (
    <div className="fixed bottom-5 right-5 bg-black/80 text-white p-4 rounded-lg text-sm z-50 max-w-xs">
      <h3 className="font-bold mb-2">Overlay Keyboard Controls</h3>
      <ul className="space-y-1">
        <li><kbd className="bg-gray-700 px-1.5 rounded">C</kbd> Connect/Reconnect to TikTok</li>
        <li><kbd className="bg-gray-700 px-1.5 rounded">+</kbd> Add 100 XP (testing)</li>
        <li><kbd className="bg-gray-700 px-1.5 rounded">1</kbd>-<kbd className="bg-gray-700 px-1.5 rounded">9</kbd> Add 100-900 XP</li>
        <li><kbd className="bg-gray-700 px-1.5 rounded">?</kbd> or <kbd className="bg-gray-700 px-1.5 rounded">H</kbd> Toggle this help</li>
        <li><kbd className="bg-gray-700 px-1.5 rounded">Esc</kbd> Hide this help</li>
      </ul>
    </div>
  )
} 