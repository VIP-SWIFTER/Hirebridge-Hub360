// Landing-page "Get in touch" section: links to the four separate form pages.
import { Box, Container, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { FORM_CONFIGS, FORM_KEYS } from "../formConfig";
import { FORM_PAGES } from "../formPages";
import { C, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function FormsHub() {
  return (
    <Box component="section" id="contact" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <SectionHead eyebrow="Get in touch" sub="Pick the form that fits. Each one has its own page, every submission is saved, and you get a reference number.">
          Let&apos;s build a brand that <Box component="span" sx={gradText}>stands out.</Box>
        </SectionHead>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.5 }}>
          {FORM_KEYS.map((k, i) => (
            <Reveal key={k} delay={i * 0.08} style={{ height: "100%" }}>
              <Box component="a" href={FORM_PAGES[k].path} sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3.5, borderRadius: "28px 28px 28px 6px", border: `1px solid ${C.line}`, bgcolor: C.card, color: "inherit", textDecoration: "none", transition: "transform .3s, border-color .3s", "&:hover": { transform: "translateY(-8px)", borderColor: "rgba(255,200,30,.55)" }, "&:hover .go": { transform: "translateX(6px)" } }}>
                <Box sx={{ width: 54, height: 54, borderRadius: "16px", display: "grid", placeItems: "center", bgcolor: i % 2 ? "secondary.main" : "primary.main", color: i % 2 ? "#fff" : "#111", mb: 2.5 }}>{FORM_PAGES[k].icon}</Box>
                <Typography variant="h5" component="h3" sx={{ mb: 1 }}>{FORM_CONFIGS[k].tab}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", flex: 1, mb: 2.5 }}>{FORM_CONFIGS[k].intro}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.dark", fontWeight: 700 }}>
                  Open form <ArrowForwardRounded className="go" fontSize="small" sx={{ transition: "transform .3s" }} />
                </Box>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
