import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box, ButtonBase, Container, Typography } from "@mui/material";
import SwipeRounded from "@mui/icons-material/SwipeRounded";
import { C, gradText } from "../brand";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const ITEMS = [
  { key: "card", label: "Visiting card", desc: "Matte black stock with a spot-yellow mark, sized for a real wallet." },
  { key: "mug", label: "Branded mug", desc: "Your logo wrapped around merchandise your customers actually keep." },
  { key: "sticker", label: "Door sticker", desc: "Round shopfront sticker, cut and printed to be seen from the street." },
  { key: "box", label: "Packaging box", desc: "A simple branded box that makes every delivery feel considered." },
] as const;
type Key = (typeof ITEMS)[number]["key"];

function makeTexture(w: number, h: number, wide = false): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0a0a0a";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#E4202D";
  g.beginPath();
  g.arc(w * (wide ? 0.25 : 0.86), h * 0.14, h * 0.5, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#FFC81E";
  g.fillRect(0, h * 0.9, w, h * 0.1);
  g.textAlign = "center";
  g.fillStyle = "#FFC81E";
  g.font = `800 ${h * 0.2}px "Bricolage Grotesque", Arial, sans-serif`;
  g.fillText("Hirebridge", wide ? w * 0.5 : w * 0.5, h * 0.52);
  g.fillStyle = "#ffffff";
  g.font = `800 ${h * 0.2}px "Bricolage Grotesque", Arial, sans-serif`;
  g.fillText("Hub360°", wide ? w * 0.5 : w * 0.5, h * 0.74);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function build(key: Key): THREE.Object3D {
  const g = new THREE.Group();
  const black = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.5, metalness: 0.2 });
  const yellow = new THREE.MeshStandardMaterial({ color: 0xffc81e, roughness: 0.4, metalness: 0.4 });
  if (key === "card") {
    const tex = makeTexture(1024, 586);
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, metalness: 0.1 });
    g.add(new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.07), [black, black, black, black, face, face]));
  } else if (key === "mug") {
    const tex = makeTexture(1024, 512, true);
    const side = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.15 });
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.7, 64, 1, false), [side, yellow, black]));
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.11, 16, 40, Math.PI), yellow);
    handle.position.set(1.0, 0, 0);
    handle.rotation.z = -Math.PI / 2;
    g.add(handle);
  } else if (key === "sticker") {
    const tex = makeTexture(1024, 1024);
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.06, 80), [yellow, face, face]);
    disc.rotation.x = Math.PI / 2;
    g.add(disc);
  } else {
    const tex = makeTexture(1024, 1024);
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    const red = new THREE.MeshStandardMaterial({ color: 0xe4202d, roughness: 0.5 });
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 2), [face, face, red, black, face, face]));
  }
  return g;
}

export default function DragShowcase() {
  const [active, setActive] = useState<Key>("card");
  const mount = useRef<HTMLDivElement>(null);
  const activeRef = useRef<Key>(active);
  const swap = useRef<((k: Key) => void) | null>(null);

  useEffect(() => {
    activeRef.current = active;
    swap.current?.(active);
  }, [active]);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.3, 7);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const l1 = new THREE.DirectionalLight(0xffffff, 2.2);
    l1.position.set(3, 4, 5);
    const l2 = new THREE.PointLight(0xe4202d, 60, 20);
    l2.position.set(-4, -1, 3);
    const l3 = new THREE.PointLight(0xffc81e, 50, 20);
    l3.position.set(4, -2, 2);
    scene.add(l1, l2, l3);

    const holder = new THREE.Group();
    scene.add(holder);
    let current: THREE.Object3D | null = null;
    const show = (k: Key) => {
      if (current) {
        holder.remove(current);
        current.traverse((o) => (o as THREE.Mesh).geometry?.dispose?.());
      }
      current = build(k);
      holder.add(current);
      holder.rotation.set(0.25, -0.6, 0);
      vx = 0;
    };
    swap.current = show;

    let vx = 0, vy = 0, dragging = false, lastX = 0, lastY = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      vx = (e.clientX - lastX) * 0.01;
      vy = (e.clientY - lastY) * 0.01;
      holder.rotation.y += vx;
      holder.rotation.x = Math.max(-1.1, Math.min(1.1, holder.rotation.x + vy));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    show(activeRef.current);

    let raf = 0, inView = true;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(el);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = clock.getDelta();
      if (!inView) return;
      const paused = document.documentElement.classList.contains("motion-paused") || reduced;
      if (!dragging) {
        holder.rotation.y += vx;
        vx *= 0.94;
        if (!paused) holder.rotation.y += dt * 0.5;
      }
      if (!paused) holder.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.1;
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      renderer.dispose();
      renderer.domElement.remove();
      swap.current = null;
    };
  }, []);

  const item = ITEMS.find((i) => i.key === active)!;

  return (
    <Box component="section" id="showcase" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <SectionHead eyebrow="Showcase" sub="See how your brand looks on real things. Drag the object to turn it around.">
          Your logo, <Box component="span" sx={gradText}>in your hands.</Box>
        </SectionHead>
        <Reveal>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" }, gap: 3, alignItems: "stretch" }}>
            <Box data-cursor="view" sx={{ position: "relative", minHeight: { xs: 320, md: 480 }, borderRadius: "32px", border: `1px solid ${C.line}`, background: "radial-gradient(circle at 50% 40%, rgba(228,32,45,.18), var(--hb-card) 68%)", overflow: "hidden" }}>
              <Box ref={mount} sx={{ position: "absolute", inset: 0 }} />
              <Box sx={{ position: "absolute", left: 18, bottom: 16, display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.75, borderRadius: "999px", bgcolor: "rgba(0,0,0,.6)", fontSize: "0.78rem", fontWeight: 700, color: "primary.main", pointerEvents: "none" }}>
                <SwipeRounded fontSize="small" /> Drag to rotate
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {ITEMS.map((it, i) => {
                const on = it.key === active;
                return (
                  <ButtonBase key={it.key} onClick={() => setActive(it.key)} aria-pressed={on} sx={{ display: "block", textAlign: "left", p: 2.5, borderRadius: "20px 20px 20px 6px", border: `1px solid ${on ? "#FFC81E" : C.line}`, bgcolor: on ? "rgba(255,200,30,.1)" : C.card, transition: "all .25s", "&:hover": { borderColor: "rgba(255,200,30,.6)" } }}>
                    <Typography sx={{ fontWeight: 800, color: on ? "primary.main" : "text.primary" }}>
                      <Box component="span" sx={{ opacity: 0.55, mr: 1.25, fontSize: "0.8rem" }}>{String(i + 1).padStart(2, "0")}</Box>
                      {it.label}
                    </Typography>
                    {on && <Typography color="text.secondary" sx={{ fontSize: "0.92rem", mt: 0.75 }}>{item.desc}</Typography>}
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
