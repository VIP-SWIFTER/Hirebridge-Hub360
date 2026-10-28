import { useEffect, useRef } from "react";

// Custom cursor: a dot that follows instantly and a ring that trails it.
// The ring grows over links/buttons and turns into a red disc over anything marked data-cursor="view".
// Only on devices with a real mouse; touch devices keep their normal behaviour.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("custom-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    let scale = 1, targetScale = 1, down = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as HTMLElement | null;
      const hot = el?.closest("a, button, [role=button], [role=tab], input, select, textarea, label, .MuiChip-root");
      targetScale = hot ? 2.1 : 1;
      ring.current?.classList.toggle("hot", !!hot);
      ring.current?.classList.toggle("view", !!el?.closest("[data-cursor=view]"));
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);
    const leave = () => {
      x = y = -100;
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale * (down ? 0.75 : 1) - scale) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="hb-cursor-dot" aria-hidden />
      <div ref={ring} className="hb-cursor-ring" aria-hidden />
    </>
  );
}
