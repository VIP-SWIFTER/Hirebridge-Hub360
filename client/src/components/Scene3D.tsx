import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { prefersReducedMotion } from "../lib/smooth";

// Fixed full-page three.js background: a friendly, professional android head with glowing visor eyes
// that follow the cursor, wrapped in holographic rings. It glides side to side as you scroll.
// Brand colours: red / yellow / black. Re-coloured for light and dark mode.

const RED = 0xe4202d;
const YELLOW = 0xffc81e;

// x position (desktop) of the robot at scroll progress p, linearly interpolated.
const PATH: [number, number][] = [
  [0, 2.5], [0.1, 2.6], [0.22, -2.9], [0.38, 2.9], [0.55, -2.9], [0.72, 2.9], [0.86, -2.6], [1, 0],
];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function pathX(p: number): number {
  for (let i = 1; i < PATH.length; i++) {
    if (p <= PATH[i][0]) {
      const [p0, x0] = PATH[i - 1];
      const [p1, x1] = PATH[i];
      const t = (p - p0) / (p1 - p0);
      return lerp(x0, x1, t * t * (3 - 2 * t));
    }
  }
  return PATH[PATH.length - 1][1];
}

export default function Scene3D() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the page still looks fine without the 3D layer
    }
    const reduced = prefersReducedMotion();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // --- reflections: a soft studio environment so the metal actually looks like metal
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.7;

    // --- lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 6);
    const yel = new THREE.PointLight(YELLOW, 70, 30);
    yel.position.set(4, 2, 4);
    const rim = new THREE.PointLight(RED, 70, 30);
    rim.position.set(-5, -2, 3);
    scene.add(key, yel, rim);

    // --- materials
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x20242b, metalness: 0.85, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x0b0c0f, metalness: 0.6, roughness: 0.35 });
    const visorMat = new THREE.MeshPhysicalMaterial({ color: 0x050506, metalness: 0.4, roughness: 0.08, clearcoat: 1 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 2.4 });
    const redGlow = new THREE.MeshStandardMaterial({ color: RED, emissive: RED, emissiveIntensity: 2 });
    const yellowMetal = new THREE.MeshStandardMaterial({ color: YELLOW, metalness: 0.8, roughness: 0.3, emissive: 0x6b4a00, emissiveIntensity: 0.4 });

    // --- robot
    const robot = new THREE.Group(); // positioned / scaled / turned each frame
    const head = new THREE.Group();
    robot.add(head);

    head.add(new THREE.Mesh(new RoundedBoxGeometry(2.3, 1.85, 1.9, 8, 0.45), bodyMat)); // skull
    const visor = new THREE.Mesh(new RoundedBoxGeometry(1.95, 0.9, 0.4, 6, 0.28), visorMat);
    visor.position.set(0, 0.05, 0.82);
    head.add(visor);

    // eyes (move inside the visor to follow the cursor)
    const eyes = new THREE.Group();
    eyes.position.set(0, 0.05, 1.04);
    const eyeGeo = new THREE.CapsuleGeometry(0.12, 0.26, 6, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.x = -0.5;
    eyeR.position.x = 0.5;
    eyes.add(eyeL, eyeR);
    head.add(eyes);

    // red scanner line sweeping across the visor
    const scanner = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.7, 0.02), redGlow);
    scanner.position.set(0, 0.05, 1.035);
    head.add(scanner);

    // ear discs with glowing rings
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.32, 40), trimMat);
      ear.rotation.z = Math.PI / 2;
      ear.position.set(1.28 * s, 0, 0);
      head.add(ear);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.035, 12, 48), s < 0 ? redGlow : eyeMat);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(1.45 * s, 0, 0);
      head.add(ring);
    }

    // antenna with pulsing red beacon
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.6, 12), trimMat);
    stem.position.set(0.5, 1.2, 0);
    head.add(stem);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), redGlow);
    beacon.position.set(0.5, 1.55, 0);
    head.add(beacon);

    // yellow chin / forehead accent
    const accent = new THREE.Mesh(new RoundedBoxGeometry(1.2, 0.09, 0.1, 3, 0.04), yellowMetal);
    accent.position.set(0, 0.82, 0.93);
    head.add(accent);

    // neck + shoulders (static relative to robot)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, 0.5, 32), trimMat);
    neck.position.y = -1.15;
    robot.add(neck);
    const shoulders = new THREE.Mesh(new RoundedBoxGeometry(3.1, 0.7, 1.5, 6, 0.3), bodyMat);
    shoulders.position.y = -1.7;
    robot.add(shoulders);
    const chest = new THREE.Mesh(new THREE.CircleGeometry(0.17, 28), eyeMat);
    chest.position.set(0, -1.7, 0.77);
    robot.add(chest);
    const stripe = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.06, 0.05, 2, 0.02), yellowMetal);
    stripe.position.set(0, -1.46, 0.77);
    robot.add(stripe);

    // --- holographic rings + globe + floating chips
    const holo = new THREE.Group();
    robot.add(holo);
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.03, 12, 180), yellowMetal);
    ringA.rotation.x = Math.PI / 2.3;
    const ringBMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.018, 12, 180), ringBMat);
    ringB.rotation.set(Math.PI / 3, 0.6, 0);
    const shellMat = new THREE.MeshBasicMaterial({ color: YELLOW, wireframe: true, transparent: true, opacity: 0.3 });
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.9, 1), shellMat);
    holo.add(ringA, ringB, shell);

    const chips: THREE.Mesh[] = [];
    const chipGeo = new RoundedBoxGeometry(0.34, 0.2, 0.05, 2, 0.02);
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(chipGeo, i % 3 === 0 ? yellowMetal : i % 3 === 1 ? trimMat : redGlow);
      m.userData = { a: (i / 12) * Math.PI * 2, r: 3.3 + (i % 3) * 0.3, s: 0.22 + (i % 5) * 0.05, y: (i % 5) - 2 };
      chips.push(m);
      holo.add(m);
    }

    scene.add(robot);

    // --- particles (spread across the whole scene)
    const N = 800;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const cY = new THREE.Color(YELLOW), cR = new THREE.Color(RED), cW = new THREE.Color(0xffffff);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      const c = Math.random() < 0.5 ? cY : Math.random() < 0.6 ? cR : cW;
      col.set([c.r, c.g, c.b], i * 3);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const ptsMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false });
    const points = new THREE.Points(pGeo, ptsMat);
    scene.add(points);

    // --- light / dark mode: recolour the pieces that only read well on one background
    let dark = false;
    const colAttr = pGeo.getAttribute("color") as THREE.BufferAttribute;
    const inkParticle = new THREE.Color(0x14161a);
    const applyMode = (d: boolean) => {
      dark = d;
      for (let i = 0; i < N; i++) {
        const r = col[i * 3], g = col[i * 3 + 1], b = col[i * 3 + 2];
        const white = r > 0.95 && g > 0.95 && b > 0.95;
        if (white && !d) colAttr.setXYZ(i, inkParticle.r, inkParticle.g, inkParticle.b);
        else colAttr.setXYZ(i, r, g, b);
      }
      colAttr.needsUpdate = true;
      ptsMat.opacity = d ? 0.8 : 0.55;
      ringBMat.color.setHex(d ? 0xffffff : 0x14161a);
      ringBMat.opacity = d ? 0.3 : 0.22;
      shellMat.opacity = d ? 0.3 : 0.45;
      shellMat.color.setHex(d ? YELLOW : 0xc98a00);
      // light page: graphite robot; dark page: brushed silver robot so it stays visible
      bodyMat.color.setHex(d ? 0xc9ced8 : 0x3b414c);
      trimMat.color.setHex(d ? 0x2a2e36 : 0x0b0c0f);
    };
    applyMode(document.documentElement.dataset.theme === "dark");

    // --- sizing
    let narrow = false;
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      narrow = w < 900;
    };
    resize();
    window.addEventListener("resize", resize);

    // --- input
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // --- loop
    let raf = 0;
    let visible = true;
    let scrollSmooth = 0, lastScrollY = window.scrollY, kick = 0, opacity = 1, nextBlink = 2.5, blinkT = -1;
    const clock = new THREE.Clock();
    const tmp = new THREE.Color();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.documentElement.classList.contains("motion-paused")) {
        clock.getDelta();
        return;
      }
      const nowDark = document.documentElement.dataset.theme === "dark";
      if (nowDark !== dark) applyMode(nowDark);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const target = Math.min(1, Math.max(0, window.scrollY / max));
      scrollSmooth += (target - scrollSmooth) * Math.min(1, dt * 5);
      const vel = (window.scrollY - lastScrollY) / Math.max(dt, 0.001);
      lastScrollY = window.scrollY;
      kick += (Math.max(-1, Math.min(1, vel / 2500)) - kick) * Math.min(1, dt * 6); // scroll speed -> head tilt

      mouse.sx += (mouse.x - mouse.sx) * 0.07;
      mouse.sy += (mouse.y - mouse.sy) * 0.07;

      // position: glides side to side per section; centred + smaller on phones
      const x = narrow ? 0 : pathX(scrollSmooth);
      const y = narrow ? lerp(1.5, 0.3, Math.min(1, scrollSmooth * 8)) : Math.sin(scrollSmooth * Math.PI * 6) * 0.3;
      robot.position.set(x, y + Math.sin(t * 1.1) * 0.12 + 0.35, 0);
      robot.scale.setScalar(narrow ? 0.55 : 0.82);

      // the robot turns toward the middle of the page and toward the cursor
      const toCentre = -Math.sign(x || 1) * Math.min(1, Math.abs(x) / 2.6) * 0.5;
      robot.rotation.y += (toCentre + mouse.sx * 0.35 - robot.rotation.y) * 0.08;
      head.rotation.y += (mouse.sx * 0.45 - head.rotation.y) * 0.1;
      head.rotation.x += (mouse.sy * 0.28 + kick * 0.25 - head.rotation.x) * 0.1;
      head.rotation.z = Math.sin(t * 0.7) * 0.03 + kick * 0.08;

      // eyes follow the cursor; blink now and then
      eyes.position.x += (mouse.sx * 0.18 - eyes.position.x) * 0.15;
      eyes.position.y += (0.05 - mouse.sy * 0.1 - eyes.position.y) * 0.15;
      if (t > nextBlink && blinkT < 0) blinkT = 0;
      if (blinkT >= 0) {
        blinkT += dt;
        const k = blinkT / 0.16;
        const s = k < 0.5 ? 1 - k * 2 * 0.92 : (k - 0.5) * 2 * 0.92 + 0.08;
        eyes.scale.y = Math.max(0.08, Math.min(1, s));
        if (k >= 1) {
          eyes.scale.y = 1;
          blinkT = -1;
          nextBlink = t + 2.5 + Math.random() * 3;
        }
      }
      eyeMat.emissiveIntensity = 2.2 + Math.sin(t * 3) * 0.4;

      // scanner sweeps, beacon pulses, rings and chips orbit
      scanner.position.x = Math.sin(t * 1.6) * 0.85;
      redGlow.emissiveIntensity = 1.6 + Math.sin(t * 4) * 0.8;
      beacon.scale.setScalar(1 + Math.sin(t * 4) * 0.18);
      ringA.rotation.z = t * 0.35;
      ringB.rotation.z = -t * 0.2;
      shell.rotation.y = -t * 0.12;
      shell.rotation.x = t * 0.08;
      chips.forEach((c) => {
        const d = c.userData as { a: number; r: number; s: number; y: number };
        const a = d.a + t * d.s;
        c.position.set(Math.cos(a) * d.r, d.y * 0.45 + Math.sin(t * d.s * 2 + d.a) * 0.18, Math.sin(a) * d.r);
        c.rotation.set(t * d.s, a, 0);
      });
      points.rotation.y = t * 0.02 + scrollSmooth * 1.2;
      points.position.y = scrollSmooth * 2;

      // accent glow colour shifts yellow <-> red along the page
      const mix = 0.5 - 0.5 * Math.cos(scrollSmooth * Math.PI * 4);
      tmp.setHex(YELLOW).lerp(new THREE.Color(RED), mix * 0.7);
      yel.color.copy(tmp);

      // fade after the hero so text stays readable
      const targetOpacity = narrow ? (dark ? 0.3 : 0.22) : scrollSmooth < 0.06 ? 1 : dark ? 0.5 : 0.3;
      opacity += (targetOpacity - opacity) * Math.min(1, dt * 3);
      renderer.domElement.style.opacity = String(opacity);

      renderer.render(scene, camera);
    };

    if (reduced) {
      robot.position.set(narrow ? 0 : 2.5, 0.35, 0);
      robot.scale.setScalar(narrow ? 0.6 : 0.95);
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onVis = () => {
      visible = !document.hidden;
      if (visible) clock.getDelta();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}
