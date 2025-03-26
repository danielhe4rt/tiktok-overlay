import "@/styles/overlay.css"

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-transparent overlay-container">
      {children}
    </div>
  )
} 