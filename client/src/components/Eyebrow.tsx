import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { pulse } from "../animations";
import ScrambleText from "./ScrambleText";

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.75,
        py: 0.9,
        border: "1px solid rgba(255,200,30,0.35)",
        bgcolor: "rgba(255,200,30,0.08)",
        color: "primary.dark",
        borderRadius: "999px",
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      <Box
        component="span"
        sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "primary.main", animation: `${pulse} 1.8s ease-in-out infinite` }}
      />
      {typeof children === "string" ? <ScrambleText text={children} /> : children}
    </Box>
  );
}
