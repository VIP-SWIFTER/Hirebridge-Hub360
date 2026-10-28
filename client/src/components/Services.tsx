import { Box, Button, Card, Container, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { MouseEvent } from "react";
import { SERVICES } from "../data";
import type { OpenForm } from "../types";
import { C, DISPLAY, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

// Moves the soft yellow "spotlight" with the cursor (read by the card's ::before gradient).
function spotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  // 3D tilt toward the cursor
  e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
  e.currentTarget.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
}
function untilt(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

export default function Services({ openForm }: { openForm: OpenForm }) {
  return (
    <Box component="section" id="services" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <SectionHead eyebrow="What we do" sub="Everything your business needs to look sharp, sound consistent and be remembered.">
          Logo &amp; brand design that <Box component="span" sx={gradText}>stands out.</Box>
        </SectionHead>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2.5,
            "& > :last-child": { gridColumn: { lg: "span 2" } },
          }}
        >
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.08} style={{ height: "100%" }}>
                <Card
                  onMouseMove={spotlight}
                  onMouseLeave={untilt}
                  sx={{
                    "--mx": "50%",
                    "--my": "50%",
                    "--rx": "0deg",
                    "--ry": "0deg",
                    transform: "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))",
                    position: "relative",
                    height: "100%",
                    p: { xs: 3, md: 3.75 },
                    overflow: "hidden",
                    borderRadius: "28px 28px 28px 6px",
                    border: `1px solid ${C.line}`,
                    bgcolor: C.card,
                    backgroundImage: "none",
                    transition: "transform .2s ease-out, border-color .35s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(360px circle at var(--mx) var(--my), rgba(255,200,30,.16), transparent 60%)",
                      opacity: 0,
                      transition: "opacity .35s ease",
                      pointerEvents: "none",
                    },
                    "&:hover": { transform: "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-6px)", borderColor: "rgba(255,200,30,.45)" },
                    "&:hover::before": { opacity: 1 },
                    "&:hover .icon": { transform: "rotate(-8deg) scale(1.08)" },
                  }}
                >
                  <Typography
                    aria-hidden
                    sx={{ position: "absolute", top: 14, right: 22, fontFamily: DISPLAY, fontWeight: 800, fontSize: "3.4rem", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(var(--hb-ink),.1)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </Typography>
                  <Box
                    className="icon"
                    sx={{ width: 56, height: 56, borderRadius: "16px", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #FFC81E, #FFE27A)", color: "#111", mb: 2.75, transition: "transform .4s ease", boxShadow: "0 12px 26px -10px rgba(255,200,30,.7)" }}
                  >
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 1.25, letterSpacing: "-0.01em" }}>
                    {s.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "0.97rem", mb: 2 }}>
                    {s.desc}
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardRounded />}
                    onClick={() => openForm("enquiry", { topic: s.title })}
                    sx={{ color: "primary.dark", px: 0, minWidth: 0, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}
                  >
                    Enquire about this
                  </Button>
                </Card>
              </Reveal>
            );
          })}

          <Reveal delay={0.16} style={{ height: "100%" }}>
            <Card
              sx={{
                height: "100%",
                p: { xs: 3, md: 3.75 },
                borderRadius: "20px",
                background: "linear-gradient(140deg, #FFC81E, #FFE27A)",
                color: "#111",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="h4" component="h3" sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" }, lineHeight: 1.1, mb: 1.25 }}>
                  Have something else in mind?
                </Typography>
                <Typography sx={{ color: "rgba(17,17,17,.75)" }}>
                  Tell us about your idea and we will shape it into a design that fits your brand.
                </Typography>
              </Box>
              <Button onClick={() => openForm("enquiry")} variant="contained" endIcon={<ArrowForwardRounded />} sx={{ alignSelf: "flex-start", bgcolor: "#111", color: "#fff", "&:hover": { bgcolor: "#000" } }}>
                Talk to us
              </Button>
            </Card>
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}
