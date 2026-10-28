import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box } from "@mui/material";
import { DISPLAY, SCRIPT } from "../brand";
import { lockScroll, prefersReducedMotion, unlockScroll } from "../lib/smooth";
import { playIntro, playOnFirstGesture } from "../lib/sound";

const BOOT = ["Initializing systems", "Loading brand engine", "Calibrating creativity", "Bridging hires & brands", "System online"];

// Intro: logo + futuristic boot screen with the intro sound, then a red + yellow curtain wipes up.
export default function Loader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [show, setShow] = useState(!prefersReducedMotion());
  const [needsTap, setNeedsTap] = useState(false);
  const [started, setStarted] = useState(false);

  // 1) On load: try to autoplay the intro sound. If the browser blocks it (no interaction yet),
  //    show "press any key" and wait; the first click / tap / key press plays the sound and starts the intro.
  useEffect(() => {
    if (!show) {
      onDone();
      return;
    }
    lockScroll();
    window.scrollTo(0, 0);

    let alive = true;
    let stopGesture = () => undefined as void;
    void playIntro().then((ok) => {
      if (!alive) return;
      if (ok) {
        setStarted(true);
      } else {
        setNeedsTap(true);
        stopGesture = playOnFirstGesture(() => {
          if (!alive) return;
          setNeedsTap(false);
          setStarted(true);
        });
      }
    });
    return () => {
      alive = false;
      stopGesture();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Boot progress runs only once the sound has started (or the visitor has pressed a key).
  useEffect(() => {
    if (!show || !started) return;
    const start = performance.now();
    const DURATION = 2800; // matches the length of the intro sound
    let raf = 0;
    let t2: ReturnType<typeof setTimeout>;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 2.4))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else t2 = setTimeout(() => setShow(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t2);
    };
  }, [show, started]);

  const line = BOOT[Math.min(BOOT.length - 1, Math.floor((n / 100) * BOOT.length))];

  return (
    <AnimatePresence
      onExitComplete={() => {
        unlockScroll();
        onDone();
      }}
    >
      {show && (
        <Box component={motion.div} key="loader" aria-hidden exit="out" sx={{ position: "fixed", inset: 0, zIndex: 3000, pointerEvents: "all" }}>
          <motion.div variants={{ out: { y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.16 } } }} style={{ position: "absolute", inset: 0, background: "#FFC81E" }} />
          <motion.div variants={{ out: { y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.08 } } }} style={{ position: "absolute", inset: 0, background: "#E4202D" }} />
          <motion.div
            variants={{ out: { y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } } }}
            style={{ position: "absolute", inset: 0, background: "#050505", display: "grid", placeItems: "center", overflow: "hidden" }}
          >
            {/* faint tech grid + scan line */}
            <Box sx={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "linear-gradient(rgba(255,200,30,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,200,30,.07) 1px, transparent 1px)", backgroundSize: "48px 48px", WebkitMaskImage: "radial-gradient(circle at 50% 45%, #000 15%, transparent 70%)", maskImage: "radial-gradient(circle at 50% 45%, #000 15%, transparent 70%)" }} />
            <Box sx={{ position: "absolute", left: 0, right: 0, height: 120, background: "linear-gradient(180deg, transparent, rgba(255,200,30,.12), transparent)", animation: "hbScan 2.4s linear infinite" }} />

            <Box sx={{ position: "relative", textAlign: "center", color: "#FFC81E", px: 2 }}>
              {/* logo with spinning HUD rings */}
              <Box sx={{ position: "relative", width: { xs: 150, md: 190 }, height: { xs: 150, md: 190 }, mx: "auto", mb: 3.5 }}>
                <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px dashed rgba(255,200,30,.55)", animation: "hbSpin 14s linear infinite" }} />
                <Box sx={{ position: "absolute", inset: 12, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#E4202D", borderRightColor: "#E4202D", animation: "hbSpin 1.6s linear infinite" }} />
                <Box sx={{ position: "absolute", inset: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,.18)", animation: "hbSpin 9s linear infinite reverse" }} />
                <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <motion.img
                    src="/emblem.png"
                    alt=""
                    initial={{ scale: 0.6, opacity: 0, filter: "blur(8px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: "52%", filter: "drop-shadow(0 0 22px rgba(255,200,30,.55))" }}
                  />
                </Box>
              </Box>

              <Box sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: "1.7rem", md: "2.3rem" }, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1 }}>
                Hirebridge <Box component="span" sx={{ color: "#FFC81E" }}>Hub360°</Box>
              </Box>
              <Box sx={{ fontFamily: SCRIPT, fontSize: { xs: "1.05rem", md: "1.3rem" }, color: "rgba(255,255,255,.75)", mt: 0.75 }}>Bridging Hires, Building Brands</Box>

              <Box sx={{ mx: "auto", mt: 4, width: "min(70vw, 380px)" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,200,30,.9)", mb: 1 }}>
                  <span>&gt; {line}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{String(n).padStart(3, "0")}%</span>
                </Box>
                <Box sx={{ height: 4, bgcolor: "rgba(255,255,255,.12)", borderRadius: 2, overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: `${n}%`, background: "linear-gradient(90deg,#FFC81E,#E4202D)", boxShadow: "0 0 14px rgba(255,200,30,.7)" }} />
                </Box>
                <Box sx={{ height: 20, mt: 1.5, fontFamily: "ui-monospace, monospace", fontSize: "0.7rem", color: "rgba(255,255,255,.45)", letterSpacing: "0.08em" }}>
                  {needsTap ? (
                    <Box component="span" sx={{ color: "#FFC81E", animation: "hbBlink 1.1s ease-in-out infinite", "@keyframes hbBlink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.25 } } }}>
                      &gt; Press any key or tap to enter
                    </Box>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
}
