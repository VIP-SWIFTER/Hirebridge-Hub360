import { AnimatePresence, motion } from "framer-motion";
import { IconButton, Tooltip } from "@mui/material";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import DarkModeRounded from "@mui/icons-material/DarkModeRounded";
import { useThemeMode } from "../lib/themeMode";

// Click once for dark, click again for light.
export default function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  const dark = mode === "dark";
  return (
    <Tooltip title={dark ? "Switch to light theme" : "Switch to dark theme"}>
      <IconButton
        onClick={toggle}
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        sx={{ width: { xs: 38, sm: 42 }, height: { xs: 38, sm: 42 }, flexShrink: 0, border: "1px solid var(--hb-line)", bgcolor: "var(--hb-chip)", color: "text.primary", overflow: "hidden", "&:hover": { borderColor: "primary.main" } }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            initial={{ y: 18, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -18, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: "grid", placeItems: "center" }}
          >
            {dark ? <LightModeRounded sx={{ color: "#FFC81E" }} /> : <DarkModeRounded sx={{ color: "#14161A" }} />}
          </motion.span>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
}
