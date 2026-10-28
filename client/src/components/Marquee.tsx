import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { Box } from "@mui/material";
import StarRounded from "@mui/icons-material/StarRounded";
import { MARQUEE_ITEMS } from "../data";
import { DISPLAY } from "../brand";
import { marquee } from "../animations";

function Row() {
  return (
    <Box
      aria-hidden
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 3.5,
        pr: 3.5,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: { xs: "1.1rem", md: "1.5rem" },
        textTransform: "uppercase",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {MARQUEE_ITEMS.map((t) => (
        <Box key={t} component="span" sx={{ display: "contents" }}>
          {t}
          <StarRounded sx={{ flex: "none" }} />
        </Box>
      ))}
    </Box>
  );
}

export default function Marquee() {
  // The band skews and leans with scroll speed, like the reference site's elastic text strips.
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(vel, [-2500, 0, 2500], [-9, 0, 9], { clamp: true });
  return (
    <Box role="presentation" sx={{ py: 3.5, overflow: "hidden" }}>
      <Box
        component={motion.div}
        style={{ skewX: skew }}
        sx={{
          bgcolor: "primary.main",
          color: "#111",
          transform: "rotate(-1.6deg)",
          width: "104%",
          ml: "-2%",
          py: 2.25,
          boxShadow: "0 20px 50px -20px rgba(255,200,30,.5)",
          "&:hover .track": { animationPlayState: "paused" },
        }}
      >
        <Box className="track" sx={{ display: "flex", width: "max-content", animation: `${marquee} 32s linear infinite` }}>
          <Row />
          <Row />
        </Box>
      </Box>
    </Box>
  );
}
