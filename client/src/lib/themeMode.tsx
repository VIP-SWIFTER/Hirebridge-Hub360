// Light / dark mode: one toggle, remembered in localStorage, applied to MUI + CSS variables + the 3D scenes.
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { Mode, makeTheme } from "../theme";

const KEY = "hb_theme_mode";

interface Ctx {
  mode: Mode;
  toggle: () => void;
}
const ThemeModeContext = createContext<Ctx>({ mode: "light", toggle: () => undefined });
export const useThemeMode = () => useContext(ThemeModeContext);

const VARS: Record<Mode, Record<string, string>> = {
  light: {
    "--hb-ink": "15,23,42",
    "--hb-line": "rgba(15,23,42,0.10)",
    "--hb-card": "#FFFFFF",
    "--hb-bg": "#F6F7F9",
    "--hb-muted": "#5B6270",
    "--hb-nav": "#3B4150",
    "--hb-nav-bg": "rgba(255,255,255,0.85)",
    "--hb-chip": "rgba(255,255,255,0.92)",
    "--hb-stat1": "#FFFFFF",
    "--hb-stat2": "#EEF0F4",
    "--hb-g1": "#D08A00",
    "--hb-g2": "#E8590C",
    "--hb-g3": "#E4202D",
    "--hb-g4": "#B3121E",
    "--hb-num1": "#D08A00",
    "--hb-num2": "#E4202D",
    "--hb-cursor": "#14161A",
  },
  dark: {
    "--hb-ink": "255,255,255",
    "--hb-line": "rgba(255,255,255,0.09)",
    "--hb-card": "#101010",
    "--hb-bg": "#050505",
    "--hb-muted": "#A3A3AD",
    "--hb-nav": "#d4d4da",
    "--hb-nav-bg": "rgba(10,10,11,0.78)",
    "--hb-chip": "rgba(21,21,25,0.85)",
    "--hb-stat1": "rgba(16,16,16,.88)",
    "--hb-stat2": "rgba(5,5,5,.88)",
    "--hb-g1": "#FFC81E",
    "--hb-g2": "#FFE27A",
    "--hb-g3": "#FF3B30",
    "--hb-g4": "#E4202D",
    "--hb-num1": "#FFC81E",
    "--hb-num2": "#FF3B30",
    "--hb-cursor": "#FFC81E",
  },
};

function readSaved(): Mode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* storage unavailable: use the default */
  }
  return "light";
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(readSaved);
  const theme = useMemo(() => makeTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode === "dark" ? "#050505" : "#F6F7F9");
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const toggle = useCallback(() => setMode((m) => (m === "light" ? "dark" : "light")), []);

  const globalStyles = useMemo(
    () => ({
      ":root": VARS[mode],
      "@keyframes hbSpin": { to: { transform: "rotate(360deg)" } },
      "@keyframes hbFloat": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      "@keyframes hbBeacon": { "0%,100%": { opacity: 1, transform: "scale(1)" }, "50%": { opacity: 0.35, transform: "scale(1.35)" } },
      "@keyframes hbWave": { "0%,60%,100%": { transform: "rotate(0deg)" }, "70%": { transform: "rotate(-28deg)" }, "80%": { transform: "rotate(8deg)" }, "90%": { transform: "rotate(-24deg)" } },
      "@keyframes hbBlink": { "0%,92%,100%": { transform: "scaleY(1)" }, "96%": { transform: "scaleY(0.1)" } },
      "@keyframes hbHudScan": { from: { top: "0%" }, to: { top: "100%" } },
      "@keyframes hbScan": { from: { top: "-120px" }, to: { top: "100%" } },
      html: { scrollPaddingTop: "84px", colorScheme: mode },
      "html:not(.lenis-on)": { scrollBehavior: "smooth" },
      "html.lenis-on, html.lenis-on body": { height: "auto" },
      ".lenis.lenis-smooth": { scrollBehavior: "auto !important" },
      "html.motion-paused *, html.motion-paused *::before, html.motion-paused *::after": { animationPlayState: "paused !important" },
      ".lenis-stopped": { overflow: "hidden" },
      "html.custom-cursor, html.custom-cursor *": { cursor: "none !important" },
      "html.custom-cursor input, html.custom-cursor textarea": { cursor: "text !important" },
      ".hb-cursor-dot": { position: "fixed", top: 0, left: 0, width: 8, height: 8, borderRadius: "50%", background: "var(--hb-cursor)", zIndex: 4000, pointerEvents: "none" },
      ".hb-cursor-ring": { position: "fixed", top: 0, left: 0, width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(var(--hb-ink),.55)", zIndex: 3999, pointerEvents: "none", transition: "background .25s ease, border-color .25s ease" },
      ".hb-cursor-ring.hot": { background: "rgba(228,32,45,.28)", borderColor: "#E4202D" },
      ".hb-cursor-ring.view": { background: "rgba(228,32,45,.9)", borderColor: "#E4202D" },
      "@media (hover: none), (pointer: coarse)": { ".hb-cursor-dot, .hb-cursor-ring": { display: "none" } },
      body: { overflowX: "hidden", WebkitFontSmoothing: "antialiased", transition: "background-color .35s ease, color .35s ease" },
      "img, svg": { display: "block", maxWidth: "100%" },
      "::selection": { background: "#E4202D", color: "#fff" },
      "@media (prefers-reduced-motion: reduce)": {
        "*, *::before, *::after": {
          animationDuration: "0.01ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.01ms !important",
          scrollBehavior: "auto !important",
        },
      },
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
