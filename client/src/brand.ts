import { shimmer } from "./animations";

export const C = {
  yellow: "#FFC81E",
  yellow2: "#FFE27A",
  red: "#E4202D",
  line: "var(--hb-line)",
  card: "var(--hb-card)",
  muted: "var(--hb-muted)",
};

export const DISPLAY = '"Bricolage Grotesque", system-ui, sans-serif';
export const SCRIPT = '"Kaushan Script", cursive';

// Animated brand gradient for highlighted words (spread into any sx).
export const gradText = {
  background: `linear-gradient(100deg, var(--hb-g1) 0%, var(--hb-g2) 35%, var(--hb-g3) 70%, var(--hb-g4) 100%)`,
  backgroundSize: "220% auto",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  animation: `${shimmer} 6s linear infinite`,
};
