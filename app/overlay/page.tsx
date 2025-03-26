import CleanOverlay from "@/components/clean-overlay"

interface OverlaySearchParams {
  theme?: string;
  showLogo?: string;
  showValues?: string;
}

export default function OverlayPage({
  searchParams
}: {
  searchParams: OverlaySearchParams
}) {
  // Parse search params
  const theme = searchParams.theme === 'light' || searchParams.theme === 'transparent' 
    ? searchParams.theme 
    : 'dark';
  const showLogo = searchParams.showLogo !== 'false';
  const showValues = searchParams.showValues !== 'false';

  return (
    <CleanOverlay 
      theme={theme as "dark" | "light" | "transparent"}
      showLogo={showLogo}
      showValues={showValues}
    />
  )
} 