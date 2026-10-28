import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: string;
  delay?: number;
  /** When set, animates on this flag (hero, after the loader). When omitted, animates on scroll into view. */
  play?: boolean;
  stagger?: number;
}

// Word-by-word "slide up from a mask" reveal. Each word sits in an overflow-hidden box.
export default function SplitText({ children, delay = 0, play, stagger = 0.07 }: Props) {
  const words = children.split(" ");
  const trigger =
    play === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }
      : { initial: "hidden", animate: play ? "show" : "hidden" };

  return (
    <motion.span
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      style={{ display: "inline" }}
    >
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
          <motion.span
            variants={{
              hidden: { y: "115%", rotate: 6 },
              show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
            }}
            style={{ display: "inline-block", transformOrigin: "0 100%" }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Same mask-slide effect for an arbitrary block (headings that contain styled spans).
 *  The observed element is the un-clipped outer wrapper; observing the clipped inner one would never fire. */
export function MaskReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.span
      style={{ display: "block" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em", marginBottom: "-0.1em" }}>
        <motion.span
          style={{ display: "block", transformOrigin: "0 100%" }}
          variants={{
            hidden: { y: "105%", rotate: 3 },
            show: { y: "0%", rotate: 0, transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {children}
        </motion.span>
      </span>
    </motion.span>
  );
}
