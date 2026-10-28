import { Box, Button, Container, Paper, Typography } from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import EmailRounded from "@mui/icons-material/EmailRounded";
import WhatsApp from "@mui/icons-material/WhatsApp";
import { BRAND, telLink, waLink } from "../contact";
import { FORM_CONFIGS, FORM_KEYS, FormKey } from "../formConfig";
import { FORM_PAGES } from "../formPages";
import type { FormRequest } from "../types";
import { C, DISPLAY, gradText } from "../brand";
import { useReady } from "../lib/ready";
import DynamicForm from "./DynamicForm";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

export default function FormPage({ form, request }: { form: FormKey; request: FormRequest | null }) {
  const ready = useReady();
  const cfg = FORM_CONFIGS[form];
  const info = FORM_PAGES[form];
  const mine = request && request.form === form ? request : null;
  const words = cfg.title.split(" ");
  const last = words.pop() as string;

  return (
    <Box component="section" sx={{ pt: { xs: 14, md: 18 }, pb: { xs: 9, md: 13 } }}>
      <Container maxWidth="lg">
        <Box><Button href="#home" color="inherit" startIcon={<ArrowBackRounded />} sx={{ mb: 3, px: 0, color: "text.secondary", "&:hover": { bgcolor: "transparent", color: "primary.dark" } }}>
          Back to home
        </Button></Box>
        <Eyebrow>{cfg.tab}</Eyebrow>
        <Typography variant="h1" component="h1" sx={{ fontFamily: DISPLAY, fontSize: { xs: "2.5rem", sm: "3.6rem", md: "4.6rem" }, mt: 2.5, mb: 2 }}>
          <SplitText play={ready}>{words.join(" ")}</SplitText>{" "}
          <Box component="span" sx={{ ...gradText, display: "inline-block" }}>
            <SplitText play={ready} delay={0.3}>{last}</SplitText>
          </Box>
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "1.12rem", maxWidth: 640, mb: { xs: 5, md: 7 } }}>
          {cfg.intro}
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 0.7fr) minmax(0, 1.3fr)" }, gap: 3.5, alignItems: "start" }}>
          <Reveal>
            <Box sx={{ display: "grid", gap: 2, position: { lg: "sticky" }, top: { lg: 100 } }}>
              <Box sx={{ p: 3, borderRadius: "24px 24px 24px 6px", border: `1px solid ${C.line}`, bgcolor: C.card }}>
                <Typography sx={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "primary.dark", mb: 2 }}>What happens next</Typography>
                {info.next.map((t, i) => (
                  <Box key={t} sx={{ display: "flex", gap: 1.75, mb: i < 2 ? 2 : 0 }}>
                    <Box sx={{ flex: "none", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: "primary.main", color: "#111", fontWeight: 800, fontSize: "0.85rem" }}>{i + 1}</Box>
                    <Typography sx={{ fontWeight: 600, pt: 0.2 }}>{t}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ p: 3, borderRadius: "24px", border: `1px solid ${C.line}`, bgcolor: C.card, display: "grid", gap: 1.5 }}>
                <Typography sx={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "text.secondary" }}>Prefer to talk?</Typography>
                <Button href={telLink()} color="inherit" startIcon={<PhoneRounded sx={{ color: "primary.dark" }} />} sx={{ justifyContent: "flex-start", px: 0 }}>{BRAND.phoneDisplay}</Button>
                <Button href={`mailto:${BRAND.email}`} color="inherit" startIcon={<EmailRounded sx={{ color: "primary.dark" }} />} sx={{ justifyContent: "flex-start", px: 0, wordBreak: "break-all", textAlign: "left" }}>{BRAND.email}</Button>
                <Button href={waLink("Hi Hirebridge Hub360°, I have a question.")} target="_blank" rel="noreferrer" color="inherit" startIcon={<WhatsApp sx={{ color: "primary.dark" }} />} sx={{ justifyContent: "flex-start", px: 0 }}>WhatsApp us</Button>
              </Box>
            </Box>
          </Reveal>

          <Reveal delay={0.1}>
            <Paper sx={{ p: { xs: 2.5, sm: 4.5 }, borderRadius: "28px", border: `1px solid ${C.line}`, backgroundImage: "none" }}>
              {/* A new nonce remounts the form so pre-filled values apply. */}
              <DynamicForm key={`${form}-${mine?.nonce ?? 0}`} config={cfg} preset={mine?.preset} />
            </Paper>
          </Reveal>
        </Box>

        <Box sx={{ mt: { xs: 8, md: 11 } }}>
          <Typography sx={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "text.secondary", mb: 2 }}>Other forms</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
            {FORM_KEYS.filter((k) => k !== form).map((k) => (
              <Box key={k} component="a" href={FORM_PAGES[k].path} sx={{ display: "flex", alignItems: "center", gap: 1.75, p: 2.25, borderRadius: "20px", border: `1px solid ${C.line}`, bgcolor: C.card, color: "inherit", textDecoration: "none", transition: "border-color .25s, transform .25s", "&:hover": { borderColor: "rgba(255,200,30,.55)", transform: "translateY(-4px)" } }}>
                <Box sx={{ color: "primary.dark", display: "grid" }}>{FORM_PAGES[k].icon}</Box>
                <Typography sx={{ fontWeight: 700, flex: 1 }}>{FORM_CONFIGS[k].tab}</Typography>
                <ArrowForwardRounded fontSize="small" />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
