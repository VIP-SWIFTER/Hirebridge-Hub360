import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, IconButton, Typography } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import type { OpenForm } from "../types";
import { useReady } from "../lib/ready";

// Little animated robot assistant (bottom-left): floats, blinks, its antenna pulses, and it waves hello.
export default function RobotAssistant({ openForm }: { openForm: OpenForm }) {
  const ready = useReady();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Say hello once the visitor has scrolled past the hero (so it never covers the main buttons), then tuck away.
  useEffect(() => {
    if (!ready || dismissed) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (window.scrollY > 700) {
        window.removeEventListener("scroll", onScroll);
        setOpen(true);
        timer = setTimeout(() => setOpen(false), 12000);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [ready, dismissed]);

  if (!ready) return null;

  return (
    <Box sx={{ position: "fixed", left: { xs: 12, sm: 20 }, bottom: { xs: 64, sm: 76 }, zIndex: 1190, display: "flex", alignItems: "flex-end", gap: 1 }}>
      <motion.button
        type="button"
        aria-label="Chat with our assistant"
        onClick={() => (dismissed ? openForm("enquiry") : setOpen((o) => !o))}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.4 }}
        whileHover={{ scale: 1.08 }}
        style={{ all: "unset", cursor: "pointer", display: "block", animation: "hbFloat 4s ease-in-out infinite" }}
      >
        <svg width="74" height="86" viewBox="0 0 74 86" role="img" aria-hidden>
          <ellipse cx="37" cy="82" rx="20" ry="3.5" fill="rgba(0,0,0,.18)" />
          {/* antenna */}
          <line x1="37" y1="10" x2="37" y2="20" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="37" cy="8" r="4.5" fill="#E4202D" style={{ animation: "hbBeacon 1.4s ease-in-out infinite", transformOrigin: "37px 8px" }} />
          {/* body */}
          <rect x="17" y="54" width="40" height="22" rx="9" fill="#1b1e24" />
          <rect x="26" y="60" width="22" height="4" rx="2" fill="#FFC81E" />
          {/* waving arm */}
          <g style={{ animation: "hbWave 2.2s ease-in-out infinite", transformOrigin: "60px 58px" }}>
            <rect x="58" y="44" width="7" height="18" rx="3.5" fill="#1b1e24" />
            <circle cx="61.5" cy="43" r="4.2" fill="#FFC81E" />
          </g>
          <rect x="9" y="56" width="7" height="16" rx="3.5" fill="#1b1e24" />
          {/* head */}
          <rect x="12" y="18" width="50" height="38" rx="15" fill="#2a2e36" />
          <rect x="12" y="18" width="50" height="38" rx="15" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" />
          <rect x="19" y="26" width="36" height="22" rx="10" fill="#050506" />
          {/* eyes */}
          <g style={{ animation: "hbBlink 4.5s infinite", transformOrigin: "37px 37px" }}>
            <rect x="26" y="31" width="6" height="12" rx="3" fill="#FFC81E" />
            <rect x="42" y="31" width="6" height="12" rx="3" fill="#FFC81E" />
          </g>
          {/* ears */}
          <rect x="7" y="31" width="5" height="12" rx="2.5" fill="#E4202D" />
          <rect x="62" y="31" width="5" height="12" rx="2.5" fill="#FFC81E" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && !dismissed && (
          <motion.div
            initial={{ opacity: 0, x: -12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "0% 100%" }}
          >
            <Box sx={{ position: "relative", width: { xs: 210, sm: 250 }, p: 2, mb: 3, borderRadius: "18px 18px 18px 4px", bgcolor: "background.paper", border: "1px solid var(--hb-line)", boxShadow: "0 18px 40px -16px rgba(15,23,42,.45)" }}>
              <IconButton size="small" aria-label="Close" onClick={() => { setOpen(false); setDismissed(true); }} sx={{ position: "absolute", top: 4, right: 4 }}>
                <CloseRounded fontSize="small" />
              </IconButton>
              <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", pr: 3 }}>Hi, I&apos;m H360-Bot 👋</Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.85rem", mt: 0.5, mb: 1.25 }}>
                Need a logo, a brand or a job? Tell our manager and we&apos;ll reply fast.
              </Typography>
              <Button size="small" variant="contained" onClick={() => { setOpen(false); setDismissed(true); openForm("enquiry"); }}>
                Talk to Manager
              </Button>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
