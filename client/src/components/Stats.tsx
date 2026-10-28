import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Box, Container, Typography } from "@mui/material";
import { STATS } from "../data";
import { C, DISPLAY } from "../brand";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <Typography
      ref={ref}
      component="b"
      sx={{
        display: "block",
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: { xs: "2.6rem", md: "3.8rem" },
        lineHeight: 1.1,
        background: "linear-gradient(120deg, var(--hb-num1), var(--hb-num2))",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {value}
      {suffix}
    </Typography>
  );
}

export default function Stats() {
  return (
    <Box component="section" aria-label="Highlights" sx={{ py: 8.5, background: "linear-gradient(135deg, var(--hb-stat1), var(--hb-stat2))", borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 4, textAlign: "center" }}>
          {STATS.map((s) => (
            <Box key={s.label}>
              <Counter to={s.to} suffix={s.suffix} />
              <Typography color="text.secondary" sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
