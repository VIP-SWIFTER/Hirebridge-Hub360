import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from "@mui/material";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { FAQS } from "../data";
import { C, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Faq() {
  const [open, setOpen] = useState<number | false>(0);

  return (
    <Box component="section" id="faq" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="md">
        <SectionHead eyebrow="FAQ" sub="Quick answers to the things people ask us most.">
          Questions? <Box component="span" sx={gradText}>Answered.</Box>
        </SectionHead>

        <Reveal>
          <Box sx={{ display: "grid", gap: 1.75 }}>
            {FAQS.map((f, i) => (
              <Accordion
                key={f.q}
                expanded={open === i}
                onChange={(_, isOpen) => setOpen(isOpen ? i : false)}
                disableGutters
                elevation={0}
                square={false}
                sx={{
                  bgcolor: C.card,
                  border: `1px solid ${open === i ? "rgba(255,200,30,.45)" : C.line}`,
                  borderRadius: "18px !important",
                  overflow: "hidden",
                  transition: "border-color .3s ease",
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreRounded sx={{ color: "primary.dark" }} />}
                  aria-controls={`faq-${i}`}
                  id={`faq-h-${i}`}
                  sx={{ px: 3, py: 0.75 }}
                >
                  <Typography variant="h6" component="h3" sx={{ fontSize: { xs: "1rem", sm: "1.12rem" } }}>
                    {f.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography color="text.secondary">{f.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
