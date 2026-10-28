// Visual effects shared by the admin screens: animated background, count-up numbers and
// "glass" card styling. Everything is theme-aware (looks right in both dark and light mode)
// and respects the visitor's "reduce motion" setting.
import { useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { useReducedMotion } from "framer-motion";
import { AdminBoot, AdminScene } from "./AdminScenes";

const driftA = keyframes`
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(60px,40px,0) scale(1.12); }
`;
const driftB = keyframes`
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(-70px,-30px,0) scale(1.1); }
`;
export const slideLine = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;
export const shineSweep = keyframes`
  0% { left: -60%; }
  100% { left: 130%; }
`;

export const isDark = (t: Theme) => t.palette.mode === "dark";

/** Frosted-glass surface: readable on the dark background and crisp white in light mode. */
export const glass = (t: Theme) => {
  const dark = isDark(t);
  return {
    backgroundColor: dark ? "rgba(18,18,21,.74)" : "rgba(255,255,255,.86)",
    backgroundImage: "none",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: `1px solid ${dark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.08)"}`,
    boxShadow: dark
      ? "0 1px 0 rgba(255,255,255,.04) inset, 0 14px 34px -18px rgba(0,0,0,.9)"
      : "0 1px 2px rgba(15,23,42,.04), 0 12px 28px -16px rgba(15,23,42,.16)",
  };
};

export const accentBorder = (t: Theme) => (isDark(t) ? "rgba(255,200,30,.6)" : "rgba(160,108,0,.5)");
export const accentGlow = (t: Theme) =>
  isDark(t)
    ? "0 0 0 1px rgba(255,200,30,.25), 0 0 28px -4px rgba(255,200,30,.28), 0 14px 34px -18px rgba(0,0,0,.9)"
    : "0 0 0 1px rgba(160,108,0,.12), 0 14px 34px -14px rgba(228,150,0,.38)";

/** Shine that sweeps across a button on hover (spread into a Button's sx). */
export const shine = {
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-60%",
    width: "40%",
    height: "100%",
    background: "linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)",
    transform: "skewX(-20deg)",
    pointerEvents: "none",
  },
  "&:hover::after": { animation: `${shineSweep} .8s ease` },
} as const;

/** Backdrop for the whole admin area: soft glows + faint grid, plus a theme-specific animated scene.
 *  Dark  → robotic scene (robot, circuits, road + mini car, boot sweep).
 *  Light → futuristic hiring scene (candidate network, profile cards, hiring pipeline). */
export function AdminBackground() {
  const dark = useTheme().palette.mode === "dark";
  return (
    <>
      <Box aria-hidden sx={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none", bgcolor: "background.default" }}>
        <Box
          sx={(t) => ({
            position: "absolute", top: "-12%", left: "-8%", width: { xs: 340, md: 560 }, height: { xs: 340, md: 560 }, borderRadius: "50%", filter: "blur(90px)",
            background: isDark(t) ? "rgba(255,200,30,.20)" : "rgba(255,200,30,.38)",
            animation: `${driftA} 18s ease-in-out infinite`,
          })}
        />
        <Box
          sx={(t) => ({
            position: "absolute", bottom: "-16%", right: "-8%", width: { xs: 320, md: 520 }, height: { xs: 320, md: 520 }, borderRadius: "50%", filter: "blur(90px)",
            background: isDark(t) ? "rgba(228,32,45,.20)" : "rgba(228,32,45,.14)",
            animation: `${driftB} 22s ease-in-out infinite`,
          })}
        />
        <Box
          sx={{
            position: "absolute", inset: 0, opacity: 0.55,
            backgroundImage: "linear-gradient(rgba(var(--hb-ink),.045) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--hb-ink),.045) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%)",
            maskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%)",
          }}
        />
        <AdminScene dark={dark} />
      </Box>
      <AdminBoot dark={dark} />
    </>
  );
}

/** Number that counts up smoothly to its value (and between updates). */
export function CountUp({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  const from = useRef(reduce ? value : 0);
  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    const start = performance.now();
    const base = from.current;
    const DURATION = 800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(base + (value - base) * eased);
      setN(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);
  return <>{n}</>;
}