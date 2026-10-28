import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import { MaskReveal } from "./SplitText";

interface Props {
  eyebrow: string;
  sub: string;
  children: ReactNode;
}

export default function SectionHead({ eyebrow, children, sub }: Props) {
  return (
    <Reveal>
      <Box sx={{ maxWidth: 700, mb: { xs: 5, md: 7 } }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Typography
          variant="h2"
          component="h2"
          sx={{ fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.3rem" }, mt: 2.25, mb: 1.75 }}
        >
          <MaskReveal>{children}</MaskReveal>
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "1.08rem" }}>
          {sub}
        </Typography>
      </Box>
    </Reveal>
  );
}
