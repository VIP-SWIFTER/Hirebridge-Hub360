import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/\\[]{}#*+=_";

// "Decoding" text effect: letters flicker through random symbols, then lock in left to right.
export default function ScrambleText({ text, duration = 900 }: { text: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const lock = Math.floor(p * text.length);
        setOut(
          text
            .split("")
            .map((ch, i) => (i < lock || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join("")
        );
        if (p < 1) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    };
    setOut(text.replace(/\S/g, "·"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
