import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  style?: CSSProperties;
  className?: string;
}

// Fades and slides children in when they scroll into view.
export default function Reveal({ children, delay = 0, y = 32, style, className }: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -70px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
