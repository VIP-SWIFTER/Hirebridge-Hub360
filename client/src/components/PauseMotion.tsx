import { useState } from "react";
import { Box, ButtonBase } from "@mui/material";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRounded from "@mui/icons-material/VolumeOffRounded";
import { isSoundOn, playIntro, setSoundOn } from "../lib/sound";

const pill = { display: "flex", alignItems: "center", gap: 1, px: { xs: 1.25, sm: 1.75 }, py: { xs: 0.9, sm: 1 }, minHeight: 36, borderRadius: "999px", bgcolor: "var(--hb-chip)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,200,30,.45)", color: "text.primary", fontWeight: 700, fontSize: "0.8rem", "&:hover": { borderColor: "#FFC81E" } } as const;

// Bottom-left controls: pause all motion (accessibility) and mute / unmute sound.
export default function PauseMotion() {
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(isSoundOn);
  const toggle = () => {
    const next = !paused;
    setPaused(next);
    document.documentElement.classList.toggle("motion-paused", next);
  };
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundOn(next);
    if (next) void playIntro(); // plays once as feedback if it has not played yet
  };
  return (
    <Box sx={{ position: "fixed", left: { xs: "max(12px, env(safe-area-inset-left))", sm: 20 }, bottom: { xs: "max(12px, env(safe-area-inset-bottom))", sm: 20 }, zIndex: 1200, display: "flex", gap: 1 }}>
      <ButtonBase onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play motion" : "Pause motion"} sx={pill}>
        {paused ? <PlayArrowRounded sx={{ fontSize: 18, color: "primary.dark" }} /> : <PauseRounded sx={{ fontSize: 18, color: "primary.dark" }} />}
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>{paused ? "Play motion" : "Pause motion"}</Box>
      </ButtonBase>
      <ButtonBase onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Mute sound" : "Unmute sound"} sx={{ ...pill, px: 1.25 }}>
        {sound ? <VolumeUpRounded sx={{ fontSize: 18, color: "primary.dark" }} /> : <VolumeOffRounded sx={{ fontSize: 18, color: "text.secondary" }} />}
      </ButtonBase>
    </Box>
  );
}
