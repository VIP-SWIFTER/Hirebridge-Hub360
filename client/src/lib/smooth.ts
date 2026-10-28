// Smooth (inertia) scrolling with Lenis, shared by the whole site.
import Lenis from "lenis";

let lenis: Lenis | null = null;
let raf = 0;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => undefined;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), anchors: { offset: -84 } });
  document.documentElement.classList.add("lenis-on");
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
    document.documentElement.classList.remove("lenis-on");
  };
}

/** Scroll to an element / pixel offset (smooth when Lenis is on, native otherwise). */
export function scrollToTarget(target: string | HTMLElement | number, offset = -84) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else (typeof target === "string" ? document.querySelector<HTMLElement>(target) : target)?.scrollIntoView({ behavior: "smooth" });
}

export const lockScroll = () => lenis?.stop();
export const unlockScroll = () => lenis?.start();
