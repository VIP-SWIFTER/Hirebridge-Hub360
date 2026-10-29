// Theme-specific animated scenes for the admin area.
//  - DARK  → robotic scene: hovering robot assistant, circuit traces with data pulses, a road with a mini car
//            driving past, and a short "system online" boot sweep when the admin switches to dark.
//  - LIGHT → futuristic hiring scene: candidate network feeding the Hirebridge hub, floating profile cards
//            with check badges, and a hiring pipeline (Apply → Screen → Interview → Hired).
// Only ONE scene is ever mounted, so none of the robotic/car effects run in light mode.
// Everything is pure CSS/SVG, sits behind the content (pointer-events: none) and honours "reduce motion".
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/material/styles";

const GOLD = "#FFC81E";
const RED = "#E4202D";

// ---------------------------------------------------------------- shared keyframes
const travel = keyframes`
  from { stroke-dashoffset: 5; }
  to { stroke-dashoffset: -100; }
`;
const hover = keyframes`
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const spinBack = keyframes`to { transform: rotate(-360deg); }`;
const pulseSoft = keyframes`
  0%,100% { opacity: .55; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.12); }
`;

const svgBox = { transformBox: "fill-box", transformOrigin: "center" } as const;

/** A faint static line with a light pulse travelling along it. */
function Trace({ d, color, dur = 3.4, delay = 0, width = 2.2, base = 0.16 }: Readonly<{ d: string; color: string; dur?: number; delay?: number; width?: number; base?: number }>) {
  return (
    <>
      <path d={d} fill="none" stroke={color} strokeOpacity={base} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
      <Box
        component="path"
        d={d}
        pathLength={100}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={{ strokeDasharray: "5 95", strokeDashoffset: 5, filter: `drop-shadow(0 0 4px ${color})`, animation: `${travel} ${dur}s linear ${delay}s infinite` }}
      />
    </>
  );
}

// ================================================================= DARK: robotic scene
const drive = keyframes`
  from { transform: translateX(-220px); }
  to { transform: translateX(calc(100vw + 60px)); }
`;
const bob = keyframes`
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-1.2px); }
`;
const laneMove = keyframes`
  from { background-position: 0 0; }
  to { background-position: -64px 0; }
`;
const eyeScan = keyframes`
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-7px); }
  60% { transform: translateX(7px); }
  80% { transform: translateX(2px); }
`;
const blink = keyframes`
  0%,90%,100% { transform: scaleY(1); }
  94% { transform: scaleY(.1); }
`;
const armWave = keyframes`
  0%,62%,100% { transform: rotate(0deg); }
  70% { transform: rotate(-38deg); }
  78% { transform: rotate(-8deg); }
  86% { transform: rotate(-34deg); }
  94% { transform: rotate(-4deg); }
`;
const flame = keyframes`
  0%,100% { transform: scaleY(1); opacity: .9; }
  50% { transform: scaleY(1.35); opacity: .55; }
`;
const chipFade = keyframes`
  0%,12% { opacity: 0; transform: translateY(6px); }
  22%,60% { opacity: 1; transform: translateY(0); }
  72%,100% { opacity: 0; transform: translateY(-6px); }
`;
const shadowPulse = keyframes`
  0%,100% { transform: scaleX(1); opacity: .5; }
  50% { transform: scaleX(.8); opacity: .3; }
`;
const bootSweep = keyframes`
  0% { top: -6%; opacity: 0; }
  10% { opacity: 1; }
  100% { top: 104%; opacity: 0; }
`;
const bootText = keyframes`
  0% { opacity: 0; transform: translate(-50%, -40%) scale(.96); letter-spacing: .6em; }
  25%,70% { opacity: 1; transform: translate(-50%, -50%) scale(1); letter-spacing: .32em; }
  100% { opacity: 0; transform: translate(-50%, -60%) scale(1.02); letter-spacing: .32em; }
`;
const bootFlash = keyframes`
  0% { opacity: 0; }
  12% { opacity: 1; }
  100% { opacity: 0; }
`;

/** "M120 40 ..." -> the first x / y of an SVG path */
const START_POINT = /^M(\d+) (\d+)/;

function Robot() {
  return (
    <Box component="svg" viewBox="0 0 200 270" aria-hidden="true" sx={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <radialGradient id="rbEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6cc" />
          <stop offset="55%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#e09a00" />
        </radialGradient>
        <linearGradient id="rbBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#23242b" />
          <stop offset="100%" stopColor="#101114" />
        </linearGradient>
        <linearGradient id="rbFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity=".95" />
          <stop offset="100%" stopColor={RED} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* HUD rings */}
      <Box component="g" sx={{ ...svgBox, animation: `${spin} 26s linear infinite` }}>
        <circle cx="100" cy="125" r="116" fill="none" stroke={GOLD} strokeOpacity=".35" strokeWidth="1.2" strokeDasharray="3 9" />
      </Box>
      <Box component="g" sx={{ ...svgBox, animation: `${spinBack} 38s linear infinite` }}>
        <circle cx="100" cy="125" r="128" fill="none" stroke={RED} strokeOpacity=".28" strokeWidth="1" strokeDasharray="22 14 4 14" />
      </Box>

      {/* ground shadow */}
      <Box component="ellipse" cx="100" cy="258" rx="46" ry="5" fill="#000" sx={{ ...svgBox, animation: `${shadowPulse} 4.2s ease-in-out infinite` }} />

      <Box component="g" sx={{ animation: `${hover} 4.2s ease-in-out infinite` }}>
        {/* thruster flame */}
        <Box component="path" d="M88 208 L112 208 L100 246 Z" fill="url(#rbFlame)" sx={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: `${flame} .45s ease-in-out infinite` }} />

        {/* antenna */}
        <line x1="100" y1="20" x2="100" y2="40" stroke={GOLD} strokeOpacity=".7" strokeWidth="2" />
        <Box component="circle" cx="100" cy="14" r="5.5" fill={RED} sx={{ ...svgBox, filter: `drop-shadow(0 0 6px ${RED})`, animation: `${pulseSoft} 1.6s ease-in-out infinite` }} />

        {/* ears */}
        <rect x="42" y="62" width="10" height="28" rx="5" fill="url(#rbBody)" stroke={GOLD} strokeOpacity=".55" strokeWidth="1.5" />
        <rect x="148" y="62" width="10" height="28" rx="5" fill="url(#rbBody)" stroke={GOLD} strokeOpacity=".55" strokeWidth="1.5" />

        {/* head */}
        <rect x="52" y="40" width="96" height="74" rx="26" fill="url(#rbBody)" stroke={GOLD} strokeOpacity=".8" strokeWidth="2" />
        <rect x="64" y="57" width="72" height="40" rx="17" fill="#06070a" stroke={GOLD} strokeOpacity=".3" strokeWidth="1" />
        {/* eyes */}
        <Box component="g" sx={{ animation: `${eyeScan} 7s ease-in-out infinite` }}>
          <Box component="g" sx={{ ...svgBox, animation: `${blink} 5s ease-in-out infinite` }}>
            <circle cx="85" cy="77" r="7.5" fill="url(#rbEye)" style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }} />
            <circle cx="115" cy="77" r="7.5" fill="url(#rbEye)" style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }} />
          </Box>
        </Box>
        {/* mouth LEDs */}
        <rect x="88" y="104" width="24" height="3" rx="1.5" fill={GOLD} fillOpacity=".5" />

        {/* neck */}
        <rect x="90" y="114" width="20" height="12" rx="3" fill="#15161a" stroke={GOLD} strokeOpacity=".35" />

        {/* arms */}
        <rect x="34" y="132" width="16" height="58" rx="8" fill="url(#rbBody)" stroke={GOLD} strokeOpacity=".5" strokeWidth="1.5" />
        <Box component="g" sx={{ transformBox: "fill-box", transformOrigin: "50% 8%", animation: `${armWave} 9s ease-in-out infinite` }}>
          <rect x="150" y="132" width="16" height="58" rx="8" fill="url(#rbBody)" stroke={GOLD} strokeOpacity=".5" strokeWidth="1.5" />
        </Box>

        {/* torso */}
        <rect x="56" y="126" width="88" height="82" rx="24" fill="url(#rbBody)" stroke={GOLD} strokeOpacity=".75" strokeWidth="2" />
        {/* core */}
        <circle cx="100" cy="158" r="17" fill="#07080a" stroke={GOLD} strokeOpacity=".4" />
        <Box component="g" sx={{ ...svgBox, animation: `${spin} 6s linear infinite` }}>
          <circle cx="100" cy="158" r="13" fill="none" stroke={GOLD} strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="6 5" />
        </Box>
        <Box component="circle" cx="100" cy="158" r="6" fill={GOLD} sx={{ ...svgBox, filter: `drop-shadow(0 0 7px ${GOLD})`, animation: `${pulseSoft} 2s ease-in-out infinite` }} />
        {/* status LEDs */}
        <circle cx="76" cy="190" r="2.5" fill="#2ecc71" />
        <circle cx="86" cy="190" r="2.5" fill={GOLD} />
        <circle cx="96" cy="190" r="2.5" fill={RED} />
        <rect x="108" y="188" width="30" height="4" rx="2" fill={GOLD} fillOpacity=".25" />
      </Box>

      {/* floating data chips (hiring flavour) */}
      <Box component="g" sx={{ animation: `${chipFade} 8s ease-in-out infinite` }}>
        <rect x="-14" y="52" width="70" height="20" rx="10" fill="#0d0d0f" stroke={GOLD} strokeOpacity=".6" />
        <text x="21" y="66" textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, Menlo, monospace" fill={GOLD}>CV SCANNED</text>
      </Box>
      <Box component="g" sx={{ animation: `${chipFade} 8s ease-in-out 4s infinite` }}>
        <rect x="150" y="118" width="74" height="20" rx="10" fill="#0d0d0f" stroke="#2ecc71" strokeOpacity=".7" />
        <text x="187" y="132" textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, Menlo, monospace" fill="#2ecc71">MATCH 98%</text>
      </Box>
    </Box>
  );
}

function MiniCar() {
  return (
    <Box component="svg" viewBox="0 0 150 56" aria-hidden="true" sx={{ width: "100%", height: "auto", overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd84d" />
          <stop offset="100%" stopColor="#d08a00" />
        </linearGradient>
        <linearGradient id="carGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd3ff" stopOpacity=".85" />
          <stop offset="100%" stopColor="#12212e" stopOpacity=".95" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff3b0" stopOpacity=".7" />
          <stop offset="100%" stopColor="#fff3b0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="underglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity=".55" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* underglow + headlight beam */}
      <ellipse cx="70" cy="52" rx="66" ry="5" fill="url(#underglow)" />
      <polygon points="136,33 232,18 232,56 136,40" fill="url(#beam)" />

      {/* speed trails */}
      <g stroke={GOLD} strokeOpacity=".35" strokeLinecap="round" strokeWidth="1.6">
        <line x1="-6" y1="26" x2="-34" y2="26" />
        <line x1="-2" y1="34" x2="-44" y2="34" />
        <line x1="-8" y1="42" x2="-28" y2="42" />
      </g>

      {/* body */}
      <path d="M5 40 L8 31 Q10 27 16 26 L40 23 Q50 10 68 10 L92 10 Q106 11 114 23 L130 26 Q140 28 140 36 L140 41 Q140 43 137 43 L8 43 Q5 43 5 40 Z" fill="url(#carBody)" />
      <path d="M5 40 L8 31 Q10 27 16 26 L40 23 Q50 10 68 10 L92 10 Q106 11 114 23 L130 26 Q140 28 140 36" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1" />
      {/* windows */}
      <path d="M47 23 Q54 14 68 14 L79 14 L79 23 Z" fill="url(#carGlass)" />
      <path d="M83 14 L92 14 Q102 15 108 23 L83 23 Z" fill="url(#carGlass)" />
      {/* door line + accent stripe */}
      <line x1="81" y1="14" x2="81" y2="40" stroke="#7a4f00" strokeOpacity=".55" strokeWidth="1" />
      <rect x="14" y="33" width="118" height="2.5" rx="1.25" fill={RED} fillOpacity=".85" />
      {/* lights */}
      <rect x="132" y="29" width="8" height="5" rx="2.5" fill="#fffbe0" style={{ filter: "drop-shadow(0 0 6px #fff3b0)" }} />
      <rect x="4" y="30" width="6" height="5" rx="2" fill={RED} style={{ filter: `drop-shadow(0 0 5px ${RED})` }} />

      {/* wheels */}
      {[34, 110].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="43" r="12" fill="#0a0a0c" />
          <Box component="g" sx={{ ...svgBox, animation: `${spin} .55s linear infinite` }}>
            <circle cx={cx} cy="43" r="8.5" fill="#1b1c21" stroke="#9aa0ad" strokeWidth="1.5" />
            <g stroke="#9aa0ad" strokeWidth="1.5" strokeLinecap="round">
              <line x1={cx - 6} y1="43" x2={cx + 6} y2="43" />
              <line x1={cx} y1="37" x2={cx} y2="49" />
              <line x1={cx - 4.2} y1="38.8" x2={cx + 4.2} y2="47.2" />
              <line x1={cx - 4.2} y1="47.2" x2={cx + 4.2} y2="38.8" />
            </g>
          </Box>
          <circle cx={cx} cy="43" r="2.2" fill={GOLD} />
        </g>
      ))}
    </Box>
  );
}

function RoboticScene() {
  const traces: Array<{ d: string; dur: number; delay: number; color: string }> = [
    { d: "M0 150 H180 L220 190 H420 L450 160 H640", dur: 4.2, delay: 0, color: GOLD },
    { d: "M0 330 H120 L160 290 H330 L360 330 H520", dur: 5, delay: 1.2, color: RED },
    { d: "M1200 120 H1040 L1000 160 H820 L790 130 H640", dur: 4.6, delay: 0.6, color: GOLD },
    { d: "M1200 460 H1090 L1050 420 H900 L870 450 H760", dur: 5.4, delay: 2, color: RED },
  ];
  return (
    <>
      {/* circuit traces with data pulses */}
      <Box component="svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.9 }}>
        {traces.map((t) => {
          const start = START_POINT.exec(t.d);
          return (
            <g key={t.d}>
              <Trace {...t} />
              <circle cx={start?.[1]} cy={start?.[2]} r="3.5" fill={t.color} fillOpacity=".45" />
            </g>
          );
        })}
      </Box>

      {/* robot assistant */}
      <Box sx={{ position: "absolute", right: { xs: -26, sm: "1.5%", lg: "3%" }, bottom: { xs: 70, md: 76 }, width: { xs: 130, sm: 170, md: 215 }, opacity: { xs: 0.6, md: 0.95 } }}>
        <Robot />
      </Box>

      {/* road + mini car */}
      <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 76, background: "linear-gradient(to top, rgba(0,0,0,.65), transparent)" }}>
        <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 14, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, ${RED}, ${GOLD}, transparent)`, boxShadow: `0 0 14px ${GOLD}`, opacity: 0.75 }} />
        <Box
          sx={{
            position: "absolute", left: 0, right: 0, bottom: 5, height: 3,
            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0 28px, transparent 28px 64px)",
            animation: `${laneMove} 1s linear infinite`, opacity: 0.45,
          }}
        />
        <Box sx={{ position: "absolute", left: 0, bottom: 14, width: { xs: 96, md: 128 }, animation: `${drive} 16s linear infinite` }}>
          <Box sx={{ animation: `${bob} .5s ease-in-out infinite` }}>
            <MiniCar />
          </Box>
        </Box>
      </Box>
    </>
  );
}

/** One-time "system online" sweep, shown when the admin switches INTO dark mode. */
function BootSequence({ runId }: Readonly<{ runId: number }>) {
  if (!runId) return null;
  return (
    <Box key={runId} aria-hidden sx={{ position: "fixed", inset: 0, zIndex: 1600, pointerEvents: "none", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(255,200,30,.16), transparent 62%)`, animation: `${bootFlash} 1.5s ease-out 1 forwards` }} />
      <Box sx={{ position: "absolute", left: 0, right: 0, height: 120, background: `linear-gradient(to bottom, transparent, rgba(255,200,30,.18) 70%, ${GOLD} 99%, transparent)`, boxShadow: `0 0 30px rgba(255,200,30,.5)`, animation: `${bootSweep} 1.3s cubic-bezier(.5,0,.3,1) 1 forwards` }} />
      <Box sx={{ position: "absolute", top: "50%", left: "50%", fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: { xs: "0.8rem", sm: "1rem" }, fontWeight: 700, color: GOLD, textShadow: `0 0 14px ${GOLD}`, whiteSpace: "nowrap", animation: `${bootText} 1.5s ease 1 forwards` }}>
        SYSTEM ONLINE
      </Box>
    </Box>
  );
}

// ================================================================= LIGHT: futuristic hiring scene
const floatCard = keyframes`
  0%,100% { transform: translateY(0) rotate(var(--r, 0deg)); }
  50% { transform: translateY(-12px) rotate(var(--r, 0deg)); }
`;
const checkPop = keyframes`
  0%,38% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.25); opacity: 1; }
  58%,92% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
`;
const ringOut = keyframes`
  0% { transform: scale(.7); opacity: .55; }
  100% { transform: scale(1.9); opacity: 0; }
`;
const stageFill = keyframes`
  0%,12% { fill: #fff; stroke-opacity: .35; }
  20%,88% { fill: #E4A000; stroke-opacity: 1; }
  100% { fill: #fff; stroke-opacity: .35; }
`;
const scanBar = keyframes`
  0% { transform: translateY(0); opacity: 0; }
  15%,85% { opacity: .9; }
  100% { transform: translateY(40px); opacity: 0; }
`;
const nodeBlink = keyframes`
  0%,100% { opacity: .65; }
  50% { opacity: 1; }
`;

const HUB = { x: 940, y: 300 };
const CANDIDATES = [
  { x: 1090, y: 150 },
  { x: 1130, y: 330 },
  { x: 1040, y: 500 },
  { x: 800, y: 470 },
  { x: 760, y: 200 },
  { x: 700, y: 330 },
];

function Person({ x, y, color }: Readonly<{ x: number; y: number; color: string }>) {
  return (
    <g>
      <circle cx={x} cy={y} r="19" fill="#fff" stroke={color} strokeOpacity=".7" strokeWidth="1.5" />
      <circle cx={x} cy={y - 4} r="5.5" fill={color} fillOpacity=".85" />
      <path d={`M${x - 9} ${y + 11} Q${x} ${y - 1} ${x + 9} ${y + 11}`} fill={color} fillOpacity=".85" />
    </g>
  );
}

function ProfileCard({ x, y, rot, delay }: Readonly<{ x: number; y: number; rot: number; delay: number }>) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Box component="g" sx={{ ["--r" as string]: `${rot}deg`, ...svgBox, animation: `${floatCard} 7s ease-in-out ${delay}s infinite` }}>
        <rect width="124" height="66" rx="12" fill="#fff" stroke="#0f172a" strokeOpacity=".12" style={{ filter: "drop-shadow(0 10px 14px rgba(15,23,42,.12))" }} />
        <circle cx="26" cy="33" r="14" fill="#FFC81E" fillOpacity=".35" />
        <circle cx="26" cy="29" r="5" fill="#B87500" />
        <path d="M17 43 Q26 31 35 43" fill="#B87500" />
        <rect x="48" y="22" width="56" height="6" rx="3" fill="#0f172a" fillOpacity=".18" />
        <rect x="48" y="35" width="40" height="5" rx="2.5" fill="#0f172a" fillOpacity=".1" />
        <rect x="48" y="46" width="48" height="5" rx="2.5" fill="#E4A000" fillOpacity=".35" />
        <Box component="g" sx={{ ...svgBox, animation: `${checkPop} 7s ease-in-out ${delay + 1}s infinite` }}>
          <circle cx="116" cy="8" r="11" fill="#1fa463" />
          <path d="M110.5 8.5 L114.5 12.5 L121.5 4.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </Box>
      </Box>
    </g>
  );
}

function HiringScene() {
  const stages = ["APPLY", "SCREEN", "INTERVIEW", "HIRED"];
  return (
    <Box component="svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.85 }}>
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC81E" stopOpacity=".55" />
          <stop offset="100%" stopColor="#FFC81E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* candidate network → hub */}
      <circle cx={HUB.x} cy={HUB.y} r="170" fill="url(#hubGlow)" />
      {CANDIDATES.map((c, i) => (
        <Trace key={`${c.x}-${c.y}`} d={`M${c.x} ${c.y} L${HUB.x} ${HUB.y}`} color={i % 2 ? "#E4202D" : "#D08A00"} dur={3.2 + (i % 3) * 0.6} delay={i * 0.45} base={0.22} width={2.6} />
      ))}
      {CANDIDATES.map((c, i) => (
        <Box component="g" key={`${c.x}-${c.y}`} sx={{ animation: `${nodeBlink} ${3 + i * 0.4}s ease-in-out infinite` }}>
          <Person x={c.x} y={c.y} color={i % 2 ? "#C8202D" : "#B87500"} />
        </Box>
      ))}

      {/* hub: pulsing rings + bridge mark */}
      {[0, 1.4].map((d) => (
        <Box key={d} component="circle" cx={HUB.x} cy={HUB.y} r="40" fill="none" stroke="#D08A00" strokeWidth="1.5" sx={{ ...svgBox, animation: `${ringOut} 4s ease-out ${d}s infinite` }} />
      ))}
      <circle cx={HUB.x} cy={HUB.y} r="38" fill="#fff" stroke="#D08A00" strokeWidth="2" style={{ filter: "drop-shadow(0 8px 16px rgba(208,138,0,.3))" }} />
      <Box component="circle" cx={HUB.x} cy={HUB.y} r="31" fill="none" stroke="#E4202D" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="5 6" sx={{ ...svgBox, animation: `${spin} 14s linear infinite` }} />
      <path d={`M${HUB.x - 20} ${HUB.y + 8} Q${HUB.x} ${HUB.y - 22} ${HUB.x + 20} ${HUB.y + 8}`} fill="none" stroke="#D08A00" strokeWidth="3.2" strokeLinecap="round" />
      <path d={`M${HUB.x - 20} ${HUB.y + 8} H${HUB.x + 20} M${HUB.x - 10} ${HUB.y + 8} V${HUB.y - 6} M${HUB.x} ${HUB.y + 8} V${HUB.y - 11} M${HUB.x + 10} ${HUB.y + 8} V${HUB.y - 6}`} fill="none" stroke="#E4202D" strokeWidth="2.4" strokeLinecap="round" />

      {/* floating profile cards */}
      <ProfileCard x={560} y={90} rot={-4} delay={0} />
      <ProfileCard x={1010} y={560} rot={3} delay={2.4} />

      {/* resume being scanned (left) */}
      <g transform="translate(110 150)">
        <Box component="g" sx={{ ["--r" as string]: "-3deg", ...svgBox, animation: `${floatCard} 8s ease-in-out 1s infinite` }}>
          <rect width="96" height="126" rx="10" fill="#fff" stroke="#0f172a" strokeOpacity=".12" style={{ filter: "drop-shadow(0 10px 14px rgba(15,23,42,.12))" }} />
          <circle cx="24" cy="24" r="10" fill="#FFC81E" fillOpacity=".45" />
          <rect x="42" y="18" width="40" height="5" rx="2.5" fill="#0f172a" fillOpacity=".2" />
          <rect x="42" y="28" width="28" height="4" rx="2" fill="#0f172a" fillOpacity=".1" />
          {[52, 64, 76, 88, 100].map((y, i) => (
            <rect key={y} x="14" y={y} width={i % 2 ? 56 : 68} height="4" rx="2" fill="#0f172a" fillOpacity=".1" />
          ))}
          <Box component="g" sx={{ animation: `${scanBar} 3.2s ease-in-out infinite` }}>
            <rect x="6" y="50" width="84" height="3" rx="1.5" fill="#E4202D" fillOpacity=".75" style={{ filter: "drop-shadow(0 0 5px #E4202D)" }} />
          </Box>
        </Box>
      </g>

      {/* hiring pipeline (bottom-left) */}
      <g transform="translate(90 610)">
        <path d="M0 0 H400" stroke="#0f172a" strokeOpacity=".14" strokeWidth="2" strokeLinecap="round" />
        <Trace d="M0 0 H400" color="#D08A00" dur={5} width={3} base={0} />
        {stages.map((s, i) => (
          <g key={s} transform={`translate(${i * 133} 0)`}>
            <Box component="circle" r="9" fill="#fff" stroke="#D08A00" strokeWidth="2" sx={{ animation: `${stageFill} 8s ease-in-out ${i * 1.6}s infinite` }} />
            <text y="28" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="1.5" fontFamily="ui-monospace, Menlo, monospace" fill="#5B6270">{s}</text>
          </g>
        ))}
      </g>
    </Box>
  );
}

// ================================================================= exported pieces
/** The animated scene itself (rendered inside the fixed background layer). */
export function AdminScene({ dark }: { dark: boolean }) {
  return dark ? <RoboticScene /> : <HiringScene />;
}

/** Boot sweep: plays only when the admin actually clicks over to dark (never in light, never on switching to light). */
export function AdminBoot({ dark }: { dark: boolean }) {
  const prev = useRef(dark);
  const [boot, setBoot] = useState(0);

  useEffect(() => {
    if (dark && !prev.current) setBoot((n) => n + 1);
    prev.current = dark;
  }, [dark]);

  useEffect(() => {
    if (!boot) return;
    const t = setTimeout(() => setBoot(0), 1700);
    return () => clearTimeout(t);
  }, [boot]);

  return dark ? <BootSequence runId={boot} /> : null;
}