import MessageQueue from "@/components/message-queue"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col gap-6 p-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-black/50 p-4 rounded-md mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">TikTok Live Overlay</h1>
          <p className="text-gray-300 mb-4">
            This application connects to TikTok Live and displays an overlay with XP and level information.
          </p>
          <div className="flex gap-2">
            <Link
              href="/overlay"
              target="_blank"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Open Clean Overlay
            </Link>
            <Link
              href="https://github.com/danielhe4rt/tiktok-overlay"
              target="_blank"
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main application */}
      <MessageQueue />
    </div>
  )
}

