import Image from "next/image"
import type { ChatMessage } from "@/types/message"

interface MessageDisplayProps {
  message: ChatMessage | null
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  if (!message) {
    return (
      <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-gray-400 text-center">Waiting for messages...</div>
    )
  }

  return (
    <div className="bg-gray-800 bg-opacity-70 rounded-lg p-4 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={message.profilePictureUrl || "/placeholder.svg?height=40&width=40"}
            alt={message.nickname}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{message.nickname}</span>
            <span className="text-xs text-gray-400">@{message.uniqueId}</span>
          </div>

          <p className="text-white mt-1">{message.comment}</p>
        </div>
      </div>
    </div>
  )
}

