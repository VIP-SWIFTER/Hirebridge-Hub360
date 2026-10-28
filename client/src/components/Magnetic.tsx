import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Pulls its child toward the cursor when the pointer is near (magnetic button effect).
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r || e.pointerType !== "mouse") return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
