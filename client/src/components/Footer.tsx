import { MouseEvent, ReactNode } from "react";
import { Box, Container, Divider, Link, Typography } from "@mui/material";
import { BRAND, NAV_LINKS, NavLink, SERVICES } from "../data";
import { telLink } from "../contact";
import type { OpenForm } from "../types";
import { C, SCRIPT } from "../brand";

function Col({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography sx={{ mb: 1.75, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>
        {title}
      </Typography>
      <Box sx={{ display: "grid", gap: 1.25 }}>{children}</Box>
    </Box>
  );
}

const linkSx = { color: "var(--hb-nav)", fontWeight: 500, transition: "color .2s ease", "&:hover": { color: "primary.dark" } };

const EXPLORE: NavLink[] = [
  ...NAV_LINKS,
  { label: "Talk to Manager", href: "#/talk-to-manager", form: "enquiry" },
  { label: "Marketing & Branding", href: "#/marketing-branding", form: "marketing" },
  { label: "FAQ", href: "#faq" },
];

export default function Footer({ openForm }: { openForm: OpenForm }) {
  const go = (l: NavLink) => (e: MouseEvent) => {
    if (l.form) {
      e.preventDefault();
      openForm(l.form);
    }
  };

  return (
    <Box component="footer" sx={{ borderTop: `1px solid ${C.line}`, pt: 7, pb: 3.5, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 5, flexWrap: "wrap", mb: 5 }}>
          <Box>
            <Box component="a" href="#home" aria-label="Back to top" sx={{ display: "flex", alignItems: "center", gap: 1.4, color: "inherit", textDecoration: "none" }}>
              <Box component="img" src="/emblem.png" alt="" sx={{ width: 44, height: 44, objectFit: "contain" }} />
              <Box>
                <Typography variant="h6" component="span" sx={{ display: "block", lineHeight: 1.05 }}>
                  Hirebridge{" "}
                  <Box component="b" sx={{ color: "primary.dark" }}>
                    Hub360°
                  </Box>
                </Typography>
                <Typography component="span" sx={{ display: "block", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "text.secondary", mt: 0.4 }}>
                  {BRAND.tagline}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontFamily: SCRIPT, color: "primary.dark", fontSize: "1.25rem", mt: 2, maxWidth: 320, lineHeight: 1.4 }}>
              Your Brand Deserves the Best!
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: { xs: 5, md: 8 }, flexWrap: "wrap" }}>
            <Col title="Explore">
              {EXPLORE.map((l) => (
                <Link key={l.label} href={l.href} onClick={go(l)} underline="none" sx={linkSx}>
                  {l.label}
                </Link>
              ))}
            </Col>
            <Col title="Services">
              {SERVICES.slice(0, 4).map((s) => (
                <Link key={s.title} href="#services" underline="none" sx={linkSx}>
                  {s.title}
                </Link>
              ))}
            </Col>
            <Col title="Contact">
              <Link href={telLink()} underline="none" sx={linkSx}>
                {BRAND.phoneDisplay}
              </Link>
              <Link href={`mailto:${BRAND.email}`} underline="none" sx={{ ...linkSx, wordBreak: "break-all" }}>
                {BRAND.email}
              </Link>
            </Col>
          </Box>
        </Box>

        <Divider />
        <Box sx={{ pt: 3, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1.25, color: "text.secondary", fontSize: "0.88rem" }}>
          <span>© {new Date().getFullYear()} Hirebridge Hub360°. All rights reserved.</span>
          <span>Bridging Hires, Building Brands.</span>
        </Box>
      </Container>
    </Box>
  );
}
