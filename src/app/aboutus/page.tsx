"use client";

// Fantastic scroll‑driven About page (Next.js 15 + React + Three.js)
// - Canvas (globe + electric particles) stays fixed on the LEFT (50%)
// - Text panel stays fixed on the RIGHT (50%)
// - As you scroll, only the text slides/animates: Hakkımızda → Vizyonumuz → Teknoloji
// - Zero SSR pitfalls: everything dynamic happens in effects
// - Tailwind for layout/looks
//
// Usage:
// 1) npm i three
// 2) Save this as app/about/page.tsx (or the route you prefer)
// 3) Ensure Tailwind is enabled in your project

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Smooth helpers
const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

const SECTIONS = [
  {
    title: "Hakkımızda",
    body: "Mimari, inşaat ve gayrimenkul odaklı markalar için yüksek performanslı 3D/etkileşimli web deneyimleri tasarlıyor ve geliştiriyoruz. Veriyle konuşan tasarım ve mühendisliği birlikte sunuyoruz.",
  },
  {
    title: "Vizyonumuz",
    body: "Gerçek zamanlı görselleştirme ve sezgisel arayüzlerle dijital kentsel deneyimi dönüştürmek. Estetik ve işlevi birleştirerek her ölçekte projeye değer katmak.",
  },
  {
    title: "Teknoloji",
    body: "Three.js, WebGL ve modern frontend ekosistemiyle; parçacık simülasyonları, ışık oyunları ve etkileşimli mimari objeler geliştiriyoruz. Performans, erişilebilirlik ve ölçeklenebilirlik ana önceliklerimiz.",
  },
];

export default function AboutPage() {
  // Refs
  const wrapperRef = useRef<HTMLDivElement | null>(null); // 300vh scroll alanı
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null); // canvas container (50%)

  // Scroll progress [0..1] only for the wrapper section
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let rafId: number | null = null;
    let current = 0;
    let target = 0;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = rect.height - window.innerHeight; // scroll aralığı
      const local = clamp(-rect.top / (total || 1), 0, 1);
      target = local; // hedef scroll progresi
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      // yumuşak takip (interpolate)
      current = lerp(current, target, 0.12);
      setProgress(current);
      if (Math.abs(current - target) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    // İlk ölçüm ve dinleyiciler
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // THREE scene setup (left 50%)
  useEffect(() => {
    const container = leftRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Scene & camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0f, 8, 20);

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);
    scene.add(camera);

    // Lights
    const hemi = new THREE.HemisphereLight(0x7dd3fc, 0x1f2937, 0.8); // soft sky + ground
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(4, 6, 3);
    scene.add(dir);

    // Group (globe + effects)
    const group = new THREE.Group();
    scene.add(group);

    // 1) Core sphere (slightly emissive)
    const sphereGeo = new THREE.IcosahedronGeometry(1.6, 4);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("hsl(195, 90%, 60%)"),
      metalness: 0.15,
      roughness: 0.25,
      emissive: new THREE.Color("hsl(190, 90%, 25%)"),
      emissiveIntensity: 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphere);

    // 2) Wireframe overlay (techy look)
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.62, 4)),
      new THREE.LineBasicMaterial({
        color: 0x66e3ff,
        transparent: true,
        opacity: 0.35,
      })
    );
    group.add(wire);

    // 3) Electric particle halo (additive points)
    const haloCount = 1800;
    const positions = new Float32Array(haloCount * 3);
    const radius = 2.2;
    for (let i = 0; i < haloCount; i++) {
      // random point on a spherical shell
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius + (Math.random() * 0.25 - 0.125);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const haloGeo = new THREE.BufferGeometry();
    haloGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const haloMat = new THREE.PointsMaterial({
      size: 0.02,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0x66ccff),
    });
    const halo = new THREE.Points(haloGeo, haloMat);
    group.add(halo);

    // 4) Rotating construction rings (subtle)
    const ringGeo = new THREE.TorusGeometry(2.4, 0.005, 8, 160);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9be7ff,
      transparent: true,
      opacity: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring1.rotation.set(0.2, 0.4, 0.1);
    ring2.rotation.set(-0.3, 0.1, 0.5);
    group.add(ring1, ring2);

    // Resize handling (observe container for true 50% width)
    const resize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Animation loop
    let t = 0;
    let af = 0;
    const animate = () => {
      af = requestAnimationFrame(animate);
      t += 0.006;

      // Gentle rotations
      group.rotation.y += 0.0025;
      sphere.rotation.y -= 0.0015;
      wire.rotation.y += 0.0018;

      // Electric shimmer: pulse particles + color shift
      const pulse = 0.85 + Math.sin(t * 3.0) * 0.15;
      (halo.material as THREE.PointsMaterial).size =
        0.018 + (1.0 - pulse) * 0.02;
      const hue = (195 + Math.sin(t * 0.7) * 20) / 360; // 175..215
      (halo.material as THREE.PointsMaterial).color.setHSL(hue, 0.9, 0.55);

      ring1.rotation.z += 0.0015;
      ring2.rotation.x -= 0.001;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(af);
      ro.disconnect();
      // Dispose
      haloGeo.dispose();
      (haloMat as THREE.Material).dispose();
      (ringGeo as THREE.BufferGeometry).dispose();
      (ringMat as THREE.Material).dispose();
      sphereGeo.dispose();
      (sphereMat as THREE.Material).dispose();
      (wire.geometry as THREE.BufferGeometry).dispose();
      (wire.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  // Text slide positions derived from progress
  // progress ∈ [0..1], page ∈ [0..(N-1)]
  const page = progress * (SECTIONS.length - 1);

  return (
    <div className="min-h-screen w-full bg-[#0b0c11] text-white">
      {/* Header / breadcrumb (optional) */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0b0c11] to-transparent pointer-events-none">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            <span className="opacity-60">CTS</span> / Hakkımızda
          </h1>
        </div>
      </div>

      {/* SCROLL WRAPPER (300vh) */}
      <div ref={wrapperRef} className="relative h-[300vh]">
        {/* Sticky split view */}
        <div className="sticky top-0 h-screen grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: Canvas 50% */}
          <div
            ref={leftRef}
            className="relative col-span-1 h-[50vh] lg:h-auto lg:min-h-screen order-2 lg:order-1"
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
            {/* Subtle vignette */}
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(transparent,black)]" />
          </div>

          {/* RIGHT: Text panel 50% */}
          <div className="relative col-span-1 flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-xl px-6">
              {/* Sliding sections stacked on top of each other */}
              {SECTIONS.map((sec, i) => {
                const delta = page - i; // -1 .. 0 .. +1
                const x = clamp(-delta * 100, -120, 120); // % of width
                const o = smooth(clamp(1 - Math.abs(delta), 0, 1));
                const z = 10 - Math.abs(delta); // layering preference
                return (
                  <section
                    key={sec.title}
                    aria-label={sec.title}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      transform: `translate3d(${x}%, 0, 0)`,
                      opacity: o,
                      zIndex: Math.round(z),
                      transition:
                        "transform 0.05s linear, opacity 0.05s linear",
                    }}
                  >
                    <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-tight tracking-tight">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400">
                        {sec.title}
                      </span>
                    </h2>
                    <p className="mt-5 text-base md:text-lg leading-relaxed text-white/80">
                      {sec.body}
                    </p>
                    <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </section>
                );
              })}

              {/* Progress Dots */}
              <div className="absolute bottom-6 left-6 flex gap-2">
                {SECTIONS.map((_, i) => {
                  const d = Math.abs(page - i);
                  const active = d < 0.5;
                  return (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full ${
                        active ? "bg-sky-400" : "bg-white/20"
                      }`}
                      aria-hidden
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
