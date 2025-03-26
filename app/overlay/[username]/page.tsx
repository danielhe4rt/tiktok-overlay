import CleanOverlay from "@/components/clean-overlay"

export default function OverlayWithUsernamePage({
  params,
}: {
  params: { username: string }
}) {
  return <CleanOverlay username={params.username} />
} 