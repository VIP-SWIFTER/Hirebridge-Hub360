import { Box, Container, Typography } from "@mui/material";
import TuneRounded from "@mui/icons-material/TuneRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import PrintRounded from "@mui/icons-material/PrintRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import { C, DISPLAY, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const FEATURES = [
  { n: "01", icon: <TuneRounded />, title: "Customizable designs", desc: "Every logo, card and creative is shaped around your business, your audience and your budget. Nothing is a template." },
  { n: "02", icon: <Inventory2Rounded />, title: "Flexible delivery", desc: "Print-ready and web-ready files, from a single visiting card to a complete brand kit with merchandise ideas." },
];
const BADGES = [
  { icon: <PrintRounded />, label: "Print-ready files" },
  { icon: <VerifiedRounded />, label: "Trademark-ready concepts" },
  { icon: <GroupsRounded />, label: "One team, end to end" },
];

export default function WhyUs() {
  return (
    <Box component="section" id="why" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <SectionHead eyebrow="Why choose us" sub="A creative studio and a hiring bridge under one roof, built around clear communication and files you can use on day one.">
          Built around <Box component="span" sx={gradText}>your brand.</Box>
        </SectionHead>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5, mb: 3 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.n} delay={i * 0.1} style={{ height: "100%" }}>
              <Box sx={{ position: "relative", height: "100%", p: { xs: 3.5, md: 5 }, borderRadius: "28px 28px 28px 6px", border: `1px solid ${C.line}`, bgcolor: C.card, overflow: "hidden", transition: "border-color .3s, transform .3s", "&:hover": { borderColor: "rgba(255,200,30,.5)", transform: "translateY(-6px)" } }}>
                <Typography aria-hidden sx={{ position: "absolute", right: 24, top: 6, fontFamily: DISPLAY, fontWeight: 800, fontSize: "6rem", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(255,200,30,.25)" }}>{f.n}</Typography>
                <Box sx={{ width: 56, height: 56, borderRadius: "16px", display: "grid", placeItems: "center", bgcolor: "primary.main", color: "#111", mb: 3 }}>{f.icon}</Box>
                <Typography variant="h4" component="h3" sx={{ mb: 1.5, fontSize: { xs: "1.5rem", md: "1.9rem" } }}>{f.title}</Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 460 }}>{f.desc}</Typography>
              </Box>
            </Reveal>
          ))}
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
          {BADGES.map((b, i) => (
            <Reveal key={b.label} delay={0.1 + i * 0.08}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, p: 2.25, borderRadius: "999px", border: "1px solid rgba(228,32,45,.45)", bgcolor: "rgba(228,32,45,.07)", fontWeight: 700 }}>
                <Box sx={{ color: "secondary.main", display: "grid" }}>{b.icon}</Box>
                {b.label}
              </Box>
            </Reveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
