import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Box, Button, Chip, Container, Link, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import EmailRounded from "@mui/icons-material/EmailRounded";
import FiberManualRecordRounded from "@mui/icons-material/FiberManualRecordRounded";
import { BRAND, telLink } from "../contact";
import type { OpenForm } from "../types";
import Eyebrow from "./Eyebrow";
import { bob, floaty, marquee, marqueeRev, scrollDot, spin } from "../animations";
import { C, DISPLAY, SCRIPT, gradText } from "../brand";
import { useReady } from "../lib/ready";
import SplitText from "./SplitText";
import Magnetic from "./Magnetic";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } };
const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const CHIPS = [
  { label: "Logo Design", top: "8%", left: "2%", color: C.yellow, anim: `${bob} 6s ease-in-out infinite` },
  { label: "Brand Identity", top: "20%", right: "-2%", color: C.red, anim: `${bob} 5.4s ease-in-out -2s infinite` },
  { label: "Visiting Cards", bottom: "14%", left: "-2%", color: C.yellow, anim: `${bob} 6.4s ease-in-out -3s infinite` },
  { label: "Merchandise", bottom: "6%", right: "6%", color: C.red, anim: `${bob} 5.8s ease-in-out -1s infinite` },
];

export default function Hero({ openForm }: { openForm: OpenForm }) {
  const ready = useReady();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 16 });
  const sy = useSpring(my, { stiffness: 70, damping: 16 });

    const chipX = useTransform(sx, (v) => v * -16);
  const chipY = useTransform(sy, (v) => v * -16);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <Box
      component="section"
      id="home"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      sx={{ position: "relative", minHeight: { md: "100svh" }, display: "flex", alignItems: "center", pt: { xs: 14, md: 17 }, pb: { xs: 10, md: 12 }, overflow: "hidden" }}
    >
      {/* Background layers */}
      <Box aria-hidden sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 60% 40%, #000 20%, transparent 75%)",
            maskImage: "radial-gradient(ellipse 70% 60% at 60% 40%, #000 20%, transparent 75%)",
          }}
        />
        <Box sx={{ position: "absolute", width: 420, height: 420, top: -100, right: -80, borderRadius: "50%", filter: "blur(90px)", opacity: 0.5, bgcolor: "rgba(255,200,30,.45)", animation: `${floaty} 14s ease-in-out infinite` }} />
        <Box sx={{ position: "absolute", width: 340, height: 340, bottom: -80, left: -90, borderRadius: "50%", filter: "blur(90px)", opacity: 0.5, bgcolor: "rgba(228,32,45,.4)", animation: `${floaty} 14s ease-in-out -6s infinite` }} />
      </Box>

      {/* Repeating tagline rows: slow, outlined, sliding in opposite directions */}
      <Box aria-hidden sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", py: { xs: 12, md: 14 }, pointerEvents: "none", opacity: 0.9 }}>
        {[0, 1, 2].map((r) => (
          <Box key={r} sx={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <Box sx={{ display: "inline-flex", width: "max-content", animation: `${r % 2 ? marqueeRev : marquee} ${70 + r * 12}s linear infinite` }}>
              {[0, 1].map((k) => (
                <Box key={k} component="span" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: "4.5rem", md: "9rem" }, lineHeight: 1, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: `1px ${r === 1 ? "rgba(255,200,30,.14)" : "rgba(var(--hb-ink),.07)"}`, pr: 6 }}>
                  {Array(4).fill("From brief to brand. Bridging hires, building brands. ").join("")}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: { xs: 7, md: 5 }, alignItems: "center" }}>
          <motion.div variants={container} initial="hidden" animate={ready ? "show" : "hidden"}>
            <motion.div variants={item}>
              <Eyebrow>Creative &amp; Branding Solutions</Eyebrow>
            </motion.div>

            <motion.div variants={item}>
              <Typography
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: "2.7rem", sm: "3.9rem", md: "4.5rem", lg: "5.4rem" }, mt: 3, mb: 2.5 }}
              >
                <Box
                  component="span"
                  sx={{ display: "block", fontFamily: SCRIPT, fontWeight: 400, letterSpacing: 0, fontSize: { xs: "1.25rem", md: "1.6rem" }, color: "primary.dark", mb: 1.25, transform: "rotate(-2deg)", transformOrigin: "left" }}
                >
                  Bridging Hires, Building Brands
                </Box>
                <SplitText play={ready} delay={0.1}>Elevate your</SplitText>{" "}
                <Box component="span" sx={{ ...gradText, display: "inline-block" }}>
                  <SplitText play={ready} delay={0.55}>brand.</SplitText>
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={item}>
              <Typography sx={{ color: "text.secondary", fontSize: { xs: "1.02rem", md: "1.15rem" }, maxWidth: 560, mb: 4.5 }}>
                Hirebridge Hub360° designs logos, brand identities and promotional collateral that make your business
                impossible to overlook, from the first sketch to print-ready files.
              </Typography>
            </motion.div>

            <motion.div variants={item}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.75, mb: 5 }}>
                <Magnetic><Button
                  onClick={() => openForm("marketing")}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRounded />}
                  sx={{ boxShadow: "0 10px 30px -10px rgba(255,200,30,.7)", transition: "transform .25s, box-shadow .25s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 36px -10px rgba(255,200,30,.85)" } }}
                >
                  Start your project
                </Button></Magnetic>
                <Magnetic><Button
                  href="#studio"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  startIcon={<AutoAwesomeRounded />}
                  sx={{ borderColor: C.line, bgcolor: "rgba(var(--hb-ink),.04)", transition: "all .25s", "&:hover": { borderColor: "primary.main", color: "primary.dark", transform: "translateY(-3px)" } }}
                >
                  Try the Brand Studio
                </Button></Magnetic>
              </Box>
            </motion.div>

            <motion.div variants={item}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 4 }, flexDirection: { xs: "column", sm: "row" } }}>
                <Link href={telLink()} underline="none" color="text.secondary" sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, fontWeight: 600, "&:hover": { color: "primary.dark" } }}>
                  <PhoneRounded sx={{ color: "primary.dark" }} fontSize="small" /> {BRAND.phoneDisplay}
                </Link>
                <Link href={`mailto:${BRAND.email}`} underline="none" color="text.secondary" sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, fontWeight: 600, "&:hover": { color: "primary.dark" } }}>
                  <EmailRounded sx={{ color: "primary.dark" }} fontSize="small" /> {BRAND.email}
                </Link>
              </Box>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 900 }}
          >
            <Box sx={{ position: "relative", aspectRatio: "1", width: { xs: "min(88%, 420px)", md: "min(100%, 520px)" }, mx: "auto", display: "grid", placeItems: "center" }}>
              {/* The fixed three.js robot shows through here; this HUD frames it. */}
              <Box data-cursor="view" sx={{ position: "absolute", inset: "4%", borderRadius: "50%", border: "1.5px dashed rgba(255,200,30,.45)", animation: `${spin} 40s linear infinite` }} />
              <Box sx={{ position: "absolute", inset: "17%", borderRadius: "50%", border: "1.5px dashed rgba(228,32,45,.5)", animation: `${spin} 28s linear infinite reverse` }} />
              {/* corner brackets */}
              {[{ top: 0, left: 0, bt: 1, bl: 1 }, { top: 0, right: 0, bt: 1, br: 1 }, { bottom: 0, left: 0, bb: 1, bl: 1 }, { bottom: 0, right: 0, bb: 1, br: 1 }].map((c, i) => (
                <Box key={i} aria-hidden sx={{ position: "absolute", width: 34, height: 34, top: c.top, bottom: c.bottom, left: c.left, right: c.right, borderStyle: "solid", borderColor: "#FFC81E", borderWidth: 0, borderTopWidth: c.bt ?? 0, borderBottomWidth: c.bb ?? 0, borderLeftWidth: c.bl ?? 0, borderRightWidth: c.br ?? 0, opacity: 0.8 }} />
              ))}
              {/* scan line + readouts */}
              <Box aria-hidden sx={{ position: "absolute", left: "6%", right: "6%", height: 2, background: "linear-gradient(90deg, transparent, #E4202D, transparent)", boxShadow: "0 0 14px rgba(228,32,45,.7)", animation: "hbHudScan 4.5s ease-in-out infinite alternate", opacity: 0.7 }} />
              <Box aria-hidden sx={{ position: "absolute", top: 10, left: 46, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.66rem", letterSpacing: "0.14em", color: "primary.dark", opacity: 0.9 }}>SYS.ONLINE · 360°</Box>
              <Box aria-hidden sx={{ position: "absolute", bottom: 10, right: 46, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.66rem", letterSpacing: "0.14em", color: "secondary.main", opacity: 0.9, display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "secondary.main", animation: "hbBeacon 1.4s ease-in-out infinite" }} /> H360-BOT ACTIVE
              </Box>

              <motion.div aria-hidden style={{ x: chipX, y: chipY, position: "absolute", inset: 0, pointerEvents: "none" }}>
                {CHIPS.map(({ label, color, anim, ...pos }) => (
                  <Chip
                    key={label}
                    label={label}
                    icon={<FiberManualRecordRounded />}
                    size="small"
                    sx={{
                      position: "absolute",
                      ...pos,
                      animation: anim,
                      height: 34,
                      px: 0.5,
                      fontWeight: 700,
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      bgcolor: "var(--hb-chip)",
                      border: `1px solid ${C.line}`,
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 14px 30px -12px rgba(15,23,42,.25)",
                      "& .MuiChip-icon": { color, fontSize: 12 },
                    }}
                  />
                ))}
              </motion.div>
            </Box>
          </motion.div>
        </Box>
      </Container>

      <Box
        aria-hidden
        sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", pt: 1, position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", width: 26, height: 42, border: "2px solid rgba(var(--hb-ink),.28)", borderRadius: "20px" }}
      >
        <Box sx={{ width: 4, height: 8, borderRadius: "4px", bgcolor: "primary.main", mt: 0.25, animation: `${scrollDot} 1.8s ease-in-out infinite` }} />
      </Box>
    </Box>
  );
}
