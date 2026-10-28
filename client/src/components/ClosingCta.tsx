import { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { BRAND } from "../contact";
import type { OpenForm } from "../types";
import { DISPLAY, SCRIPT } from "../brand";
import Magnetic from "./Magnetic";
import { MaskReveal } from "./SplitText";
import Reveal from "./Reveal";

export default function ClosingCta({ openForm }: { openForm: OpenForm }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${BRAND.email}`;
    }
  };
  return (
    <Box component="section" id="start" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ position: "relative", overflow: "hidden", borderRadius: { xs: "28px", md: "40px" }, p: { xs: 4, md: 9 }, bgcolor: "primary.main", color: "#111", textAlign: "center" }}>
          <Box aria-hidden sx={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", bgcolor: "#E4202D", right: -120, top: -160, opacity: 0.95 }} />
          <Box aria-hidden sx={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", bgcolor: "#111", left: -90, bottom: -120 }} />
          <Box sx={{ position: "relative" }}>
            <Typography sx={{ fontFamily: SCRIPT, fontSize: { xs: "1.3rem", md: "1.8rem" }, mb: 1.5, transform: "rotate(-2deg)" }}>From idea to identity</Typography>
            <Typography variant="h2" component="h2" sx={{ fontFamily: DISPLAY, fontSize: { xs: "2.4rem", sm: "3.4rem", md: "4.8rem" }, mb: 2.5, color: "#111" }}>
              <MaskReveal>Ready to bring your</MaskReveal>
              <MaskReveal delay={0.12}>brand to market?</MaskReveal>
            </Typography>
            <Reveal delay={0.2}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.75, justifyContent: "center", alignItems: "center", mt: 4 }}>
                <Magnetic>
                  <Button onClick={() => openForm("marketing")} size="large" endIcon={<ArrowForwardRounded />} sx={{ bgcolor: "#111", color: "#fff", "&:hover": { bgcolor: "#000" } }}>Request pricing</Button>
                </Magnetic>
                <Magnetic>
                  <Button onClick={() => openForm("enquiry")} size="large" variant="outlined" sx={{ color: "#111", borderColor: "#111", borderWidth: 2, "&:hover": { borderWidth: 2, bgcolor: "rgba(0,0,0,.08)" } }}>Contact us</Button>
                </Magnetic>
              </Box>
              <Button onClick={copy} startIcon={copied ? <CheckRounded /> : <ContentCopyRounded />} sx={{ mt: 3, color: "#111", fontWeight: 700 }}>
                {copied ? "Copied!" : BRAND.email}
              </Button>
            </Reveal>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
