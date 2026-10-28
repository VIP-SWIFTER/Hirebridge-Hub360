import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Box, Button, ButtonBase, Container, Paper, TextField, Tooltip, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AutoFixHighRounded from "@mui/icons-material/AutoFixHighRounded";
import { PALETTES } from "../data";
import type { OpenForm } from "../types";
import { C, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const FONT = "Bricolage Grotesque, system-ui, sans-serif";

type Palette = (typeof PALETTES)[number];
interface MockProps {
  name: string;
  p: Palette;
  letter: string;
}

function Mark({ cx, cy, r, bg, fg, letter }: { cx: number; cy: number; r: number; bg: string; fg: string; letter: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={bg} />
      <circle cx={cx} cy={cy} r={r * 0.74} fill="none" stroke={fg} strokeWidth={r * 0.1} opacity="0.85" />
      <text x={cx} y={cy + r * 0.33} textAnchor="middle" fontSize={r * 0.98} fontWeight="800" fill={fg} fontFamily={FONT}>
        {letter}
      </text>
    </g>
  );
}

const fit = (name: string, base: number, min: number) => Math.max(min, base - Math.max(0, name.length - 6) * 0.9);

function Card({ name, p, letter }: MockProps) {
  return (
    <svg viewBox="0 0 280 170" role="img" aria-label="Business card mockup">
      <g transform="rotate(-7 140 85)">
        <rect x="46" y="30" width="200" height="116" rx="12" fill={p.primary} opacity="0.95" />
      </g>
      <rect x="30" y="22" width="220" height="124" rx="12" fill="#121215" stroke="rgba(255,255,255,0.12)" />
      <Mark cx={72} cy={84} r={24} bg={p.primary} fg={p.ink} letter={letter} />
      <text x="108" y="80" fontSize={fit(name, 20, 11)} fontWeight="800" fill="#fff" fontFamily={FONT}>
        {name}
      </text>
      <text x="108" y="98" fontSize="9" fill="#9a9aa4" fontFamily="Manrope, sans-serif" letterSpacing="1.4">
        YOUR TAGLINE HERE
      </text>
      <rect x="108" y="112" width="46" height="3" rx="1.5" fill={p.primary} />
      <rect x="30" y="134" width="220" height="12" rx="6" fill={p.primary} opacity="0.9" />
    </svg>
  );
}

function Mug({ name, p, letter }: MockProps) {
  return (
    <svg viewBox="0 0 220 190" role="img" aria-label="Mug mockup">
      <defs>
        <linearGradient id="mugShade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <ellipse cx="96" cy="176" rx="72" ry="8" fill="rgba(0,0,0,0.45)" />
      <path d="M158 62 h16 a24 24 0 0 1 0 62 h-16" fill="none" stroke="#f1efe8" strokeWidth="14" />
      <rect x="30" y="28" width="132" height="142" rx="16" fill="#f7f6f1" />
      <rect x="30" y="28" width="132" height="142" rx="16" fill="url(#mugShade)" />
      <Mark cx={96} cy={86} r={28} bg={p.primary} fg={p.ink} letter={letter} />
      <text x="96" y="140" textAnchor="middle" fontSize={fit(name, 16, 9)} fontWeight="800" fill="#161618" fontFamily={FONT}>
        {name}
      </text>
    </svg>
  );
}

function Sticker({ name, p, letter }: MockProps) {
  return (
    <svg viewBox="0 0 340 120" role="img" aria-label="Door sticker mockup">
      <rect x="14" y="14" width="312" height="92" rx="46" fill={p.primary} />
      <rect x="14" y="14" width="312" height="92" rx="46" fill="none" stroke="rgba(255,255,255,0.25)" />
      <Mark cx={62} cy={60} r={34} bg={p.ink} fg={p.primary} letter={letter} />
      <text x="112" y="58" fontSize={fit(name, 28, 14)} fontWeight="800" fill={p.ink} fontFamily={FONT}>
        {name}
      </text>
      <text x="112" y="80" fontSize="11" fontWeight="700" fill={p.ink} opacity="0.75" fontFamily="Manrope, sans-serif" letterSpacing="2.6">
        WELCOME · OPEN
      </text>
    </svg>
  );
}

function Mock({ tag, wide = false, children, minHeight = 210 }: { tag: string; wide?: boolean; children: ReactNode; minHeight?: number }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        p: 2.25,
        borderRadius: "22px",
        border: `1px solid ${C.line}`,
        background: "radial-gradient(circle at 30% 20%, #1d1d23, #111115 70%)",
        overflow: "hidden",
        minHeight,
        gridColumn: wide ? { sm: "span 2" } : "auto",
        "& svg": { width: "100%", maxHeight: 200, filter: "drop-shadow(0 18px 24px rgba(0,0,0,.5))" },
      }}
    >
      <Typography component="span" sx={{ position: "absolute", left: 16, top: 14, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" }}>
        {tag}
      </Typography>
      {children}
    </Box>
  );
}

export default function BrandStudio({ openForm }: { openForm: OpenForm }) {
  const [name, setName] = useState("Your Brand");
  const [pi, setPi] = useState(0);

  const p = PALETTES[pi];
  const clean = name.trim() || "Your Brand";
  const display = clean.slice(0, 20);
  const letter = (clean.match(/[A-Za-z0-9஀-௿]/)?.[0] || "B").toUpperCase();

  // Sends the idea to the Marketing & Branding form with the details pre-filled.
  const useDesign = () =>
    openForm("marketing", {
      businessName: name.trim() === "Your Brand" ? "" : clean,
      services: ["Logo & Brand Identity"],
      message: `I tried the Brand Studio with "${clean}" in the ${p.name} color mood and would like a custom brand identity. Please share the next steps and pricing.`,
    });

  const pop = {
    initial: { opacity: 0, scale: 0.9, y: 14 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <Box component="section" id="studio" sx={{ py: { xs: 10, md: 14 }, background: "linear-gradient(180deg, transparent, rgba(255,200,30,.04), transparent)" }}>
      <Container maxWidth="lg">
        <SectionHead
          eyebrow="Brand Studio"
          sub="Type your business name, pick a color mood and watch it appear on cards, mugs and door stickers. This is a quick preview. Our designers create the real, fully custom identity."
        >
          See your brand <Box component="span" sx={gradText}>come alive.</Box>
        </SectionHead>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 0.8fr) minmax(0, 1.2fr)" }, gap: 3.5, alignItems: "stretch" }}>
          <Reveal style={{ height: "100%" }}>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", border: `1px solid ${C.line}`, backgroundImage: "none", height: "100%" }}>
              <TextField
                fullWidth
                label="Business name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sri Murugan Traders"
                inputProps={{ maxLength: 20 }}
                sx={{ mb: 3.5 }}
              />

              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 1.5 }}>
                Color mood · {p.name}
              </Typography>
              <Box role="radiogroup" aria-label="Color mood" sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3.5 }}>
                {PALETTES.map((c, i) => (
                  <Tooltip key={c.name} title={c.name} arrow>
                    <ButtonBase
                      role="radio"
                      aria-checked={i === pi}
                      aria-label={c.name}
                      onClick={() => setPi(i)}
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        bgcolor: c.primary,
                        border: "2px solid transparent",
                        transition: "transform .2s ease, box-shadow .2s ease",
                        ...(i === pi && { borderColor: "#14161A", boxShadow: `0 0 0 3px var(--hb-bg), 0 0 0 5px ${C.yellow}` }),
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>

              <Typography color="text.secondary" sx={{ fontSize: "0.9rem", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <AutoFixHighRounded sx={{ fontSize: 18, color: "primary.main" }} /> Love a direction? Send it to our team in one click.
              </Typography>

              <Button variant="contained" endIcon={<ArrowForwardRounded />} onClick={() => useDesign()} sx={{ width: { xs: "100%", sm: "auto" } }}>
                Make this real
              </Button>
            </Paper>
          </Reveal>

          <Reveal delay={0.12}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.25 }}>
              <Mock tag="Visiting card">
                <motion.div key={`c-${display}-${pi}`} {...pop} style={{ width: "100%" }}>
                  <Card name={display} p={p} letter={letter} />
                </motion.div>
              </Mock>
              <Mock tag="Merchandise">
                <motion.div key={`m-${display}-${pi}`} {...pop} style={{ width: "62%" }}>
                  <Mug name={display} p={p} letter={letter} />
                </motion.div>
              </Mock>
              <Mock tag="Door sticker" wide minHeight={190}>
                <motion.div key={`s-${display}-${pi}`} {...pop} style={{ width: "min(100%, 440px)" }}>
                  <Sticker name={display} p={p} letter={letter} />
                </motion.div>
              </Mock>
            </Box>
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}
