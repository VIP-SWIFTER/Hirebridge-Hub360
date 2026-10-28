import { motion } from "framer-motion";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import SupportAgentRounded from "@mui/icons-material/SupportAgentRounded";
import { END_TO_END } from "../data";
import type { OpenForm } from "../types";
import { C, DISPLAY, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const BENEFITS = [
  { title: "One point of contact", desc: "One team from first idea to final files, so nothing gets lost between vendors." },
  { title: "Consistent brand everywhere", desc: "Your logo, colors and style carry across cards, stickers, posters and merchandise." },
  { title: "Ready-to-use files", desc: "Print-ready and web-ready deliverables, so you can use your designs straight away." },
];

export default function EndToEnd({ openForm }: { openForm: OpenForm }) {
  return (
    <Box component="section" id="end-to-end" sx={{ py: { xs: 10, md: 14 }, position: "relative", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <SectionHead
          eyebrow="End-to-end service"
          sub="From the first idea to the final delivery, we handle every step of building your brand, so you deal with one team instead of many."
        >
          One partner. <Box component="span" sx={gradText}>Every step.</Box>
        </SectionHead>

        {/* Timeline */}
        <Box sx={{ position: "relative", maxWidth: 980, mx: "auto" }}>
          <Box aria-hidden sx={{ position: "absolute", top: 24, bottom: 24, left: { xs: 23, md: "50%" }, width: 2, ml: { md: "-1px" }, bgcolor: C.line }}>
            <motion.div
              style={{ height: "100%", background: "linear-gradient(180deg, #FFC81E, #E4202D)", transformOrigin: "top" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </Box>

          {END_TO_END.map((s, i) => {
            const Icon = s.icon;
            const left = i % 2 === 0;
            return (
              <Box
                key={s.title}
                sx={{ display: "grid", gridTemplateColumns: { xs: "48px 1fr", md: "1fr 80px 1fr" }, alignItems: "center", mb: { xs: 3, md: 4.5 }, columnGap: { xs: 1.5, md: 0 } }}
              >
                <Box sx={{ gridColumn: { xs: 2, md: left ? 1 : 3 }, gridRow: 1, textAlign: { md: left ? "right" : "left" } }}>
                  <Reveal delay={0.05}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "20px",
                        bgcolor: C.card,
                        border: `1px solid ${C.line}`,
                        transition: "transform .3s ease, border-color .3s ease",
                        "&:hover": { transform: "translateY(-4px)", borderColor: "rgba(255,200,30,.45)" },
                      }}
                    >
                      <Typography sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.14em", color: "primary.dark", mb: 0.5 }}>
                        STEP {String(i + 1).padStart(2, "0")}
                      </Typography>
                      <Typography variant="h5" component="h3" sx={{ mb: 1 }}>
                        {s.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: "0.97rem" }}>
                        {s.desc}
                      </Typography>
                    </Box>
                  </Reveal>
                </Box>

                <Box sx={{ gridColumn: { xs: 1, md: 2 }, gridRow: 1, display: "grid", placeItems: "center", alignSelf: { xs: "start", md: "center" }, pt: { xs: 0.5, md: 0 } }}>
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "0px 0px -60px 0px" }} transition={{ type: "spring", stiffness: 240, damping: 16 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #FFC81E, #FFE27A)", color: "#111", boxShadow: "0 0 0 6px var(--hb-bg), 0 10px 30px -6px rgba(255,200,30,.6)" }}>
                      <Icon />
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Benefits */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5, mt: { xs: 5, md: 8 } }}>
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1}>
              <Box sx={{ p: 3, height: "100%", borderRadius: "20px", background: "linear-gradient(145deg, rgba(255,200,30,.1), rgba(var(--hb-ink),.02))", border: "1px solid rgba(255,200,30,.2)" }}>
                <Typography variant="h6" component="h3" sx={{ mb: 0.75 }}>
                  {b.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
                  {b.desc}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Box>

        {/* CTA */}
        <Reveal delay={0.1}>
          <Box
            sx={{
              mt: 4,
              p: { xs: 3, md: 4.5 },
              borderRadius: "24px",
              background: "linear-gradient(135deg, #FFC81E, #FFE27A)",
              color: "#111",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "center" },
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h4" component="h3" sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, lineHeight: 1.1, mb: 0.75 }}>
                Want everything handled for you?
              </Typography>
              <Typography sx={{ color: "rgba(17,17,17,.75)" }}>Tell us about your business and get an end-to-end plan.</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRounded />}
                onClick={() => openForm("marketing", { services: ["Complete End-to-End Package"] })}
                sx={{ bgcolor: "#111", color: "#fff", "&:hover": { bgcolor: "#000" } }}
              >
                Get an end-to-end quote
              </Button>
              <Button
                variant="outlined"
                startIcon={<SupportAgentRounded />}
                onClick={() => openForm("enquiry", { topic: "Pricing / Quote" })}
                sx={{ color: "#111", borderColor: "rgba(17,17,17,.5)", "&:hover": { borderColor: "#111", bgcolor: "rgba(17,17,17,.06)" } }}
              >
                Talk to a manager
              </Button>
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
