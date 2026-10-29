import { Box, Fab, Zoom, useScrollTrigger } from "@mui/material";
import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import WhatsApp from "@mui/icons-material/WhatsApp";
import { BRAND } from "../data";
import { ring } from "../animations";
import { scrollToTarget } from "../lib/smooth";

export default function FloatingActions() {
  const showTop = useScrollTrigger({ disableHysteresis: true, threshold: 700 });

  return (
    <Box sx={{ position: "fixed", right: { xs: "max(12px, env(safe-area-inset-right))", sm: 20 }, bottom: { xs: "max(12px, env(safe-area-inset-bottom))", sm: 20 }, zIndex: 1200, display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 }, alignItems: "center" }}>
      <Zoom in={showTop}>
        <Fab size="small" aria-label="Back to top" onClick={() => scrollToTarget(0, 0)} sx={{ bgcolor: "background.paper", color: "text.primary", border: "1px solid var(--hb-line)", "&:hover": { bgcolor: "background.paper", borderColor: "primary.main" } }}>
          <KeyboardArrowUpRounded />
        </Fab>
      </Zoom>
      <Fab size="small" color="primary" component="a" href={`tel:+91${BRAND.phone}`} aria-label="Call us">
        <PhoneRounded />
      </Fab>
      <Fab
        size="small"
        component="a"
        href={`https://wa.me/${BRAND.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        sx={{ bgcolor: "#E4202D", color: "#fff", animation: `${ring} 2.6s ease-out infinite`, "&:hover": { bgcolor: "#FF3B30" } }}
      >
        <WhatsApp />
      </Fab>
    </Box>
  );
}
