import { motion } from "framer-motion";
import { Box, Container, Typography } from "@mui/material";
import { PROCESS } from "../data";
import { C, DISPLAY, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Process() {
  return (
    <Box component="section" id="process" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <SectionHead eyebrow="How it works" sub="A simple, transparent process so you always know what happens next.">
          From first idea to <Box component="span" sx={gradText}>final files.</Box>
        </SectionHead>

        <Box sx={{ position: "relative", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.5, rowGap: 5.5 }}>
          <Box aria-hidden sx={{ display: { xs: "none", lg: "block" }, position: "absolute", top: 34, left: "6%", right: "6%", height: 2, bgcolor: C.line }}>
            <motion.span
              style={{ display: "block", height: "100%", background: "linear-gradient(90deg, #FFC81E, #E4202D)", transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -120px 0px" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </Box>

          {PROCESS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.15}>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "background.default",
                  border: `2px solid ${C.yellow}`,
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: "primary.dark",
                  mb: 2.75,
                  boxShadow: "0 0 0 8px var(--hb-bg), 0 0 40px -6px rgba(255,200,30,.55)",
                }}
              >
                {i + 1}
              </Box>
              <Typography variant="h5" component="h3" sx={{ mb: 1 }}>
                {s.title}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.97rem", maxWidth: 260 }}>
                {s.desc}
              </Typography>
            </Reveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
