export interface GamingOverlayProps {
  channelName?: string;
  level?: number;
  currentXP?: number;
  maxXP?: number;
  logoUrl?: string;
  theme?: "dark" | "light" | "transparent";
  showLogo?: boolean;
  showValues?: boolean;
}

export interface CleanOverlayProps {
  username?: string;
  theme?: "dark" | "light" | "transparent";
  showLogo?: boolean;
  showValues?: boolean;
} 