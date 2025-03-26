"use client"

import { Inter } from "next/font/google"

// Use a clean font for the overlay
const inter = Inter({ subsets: ["latin"] })

export default function OverlayTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} bg-transparent overflow-hidden min-h-screen`}>
      {children}
    </div>
  )
} 