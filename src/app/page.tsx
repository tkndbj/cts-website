"use client";

import { useEffect, useRef, useState } from "react";
import HeroSection from "./components/HeroSection";
import HeaderBackground from "./components/HeaderBackground";
import ImageGallerySection from "./components/ImageGallerySection";
import FeaturedProjectStory from "./components/FeaturedProjectStory";

export default function Home() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetProject, setTargetProject] = useState<number | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Uzun akış için proxy
  const SCROLL_PROXY_VH = 700;

  // Faz eşikleri (0..1 arası)
  // 0        : Welcome/video
  // 0.55     : Main header oluşmuş
  // 0.75     : 4 görsel + isimler
  // 0.82     : 2. header
  // 0.86/0.90/0.94/0.98 : Proje 1..4 blokları
  const STEP_MARKS = [0, 0.7, 0.83, 0.87, 0.91, 0.95, 0.98];

  const snappingRef = useRef(false); // şu an otomatik kayıyor mu?
  const cooldownRef = useRef(0); // momentum filtreleme
  const lastTouchYRef = useRef<number | null>(null);

  const getScrollInfo = () => {
    const proxy = document.querySelector(".scroll-proxy") as HTMLElement | null;
    const vh = window.innerHeight;
    const maxScroll = proxy
      ? Math.max(proxy.offsetHeight - vh, 1)
      : Math.max(document.body.scrollHeight - vh, 1);
    const y = window.scrollY;
    const pct = Math.min(Math.max(y / maxScroll, 0), 1);
    return { y, maxScroll, pct };
  };

  const scrollToPct = (pct: number, behavior: ScrollBehavior = "smooth") => {
    const { maxScroll } = getScrollInfo();
    const top = pct * maxScroll;
    setIsNavigating(true);
    document.body.classList.add("direct-navigation");
    window.scrollTo({ top, behavior });
    // kilidi kısa bir süre açık tut
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      document.body.classList.remove("direct-navigation");
      setIsNavigating(false);
    }, 900);
  };

  const nearestStep = (pct: number, dir: "next" | "prev") => {
    if (dir === "next") {
      for (const s of STEP_MARKS) if (s - pct > 0.001) return s;
      return STEP_MARKS[STEP_MARKS.length - 1];
    } else {
      for (let i = STEP_MARKS.length - 1; i >= 0; i--) {
        if (pct - STEP_MARKS[i] > 0.001) return STEP_MARKS[i];
      }
      return STEP_MARKS[0];
    }
  };

  // “Tek scroll = bir faz” davranışı
  useEffect(() => {
    const MIN_DELTA = 28; // trackpad/momentum için eşik
    const COOLDOWN_MS = 520; // bir adım sonrası kilit süresi

    let wheelTimer: number | null = null;

    const onWheel = (e: WheelEvent) => {
      // Hem touch momentum’u hem de hızlı tekerlek spam’ini engelle
      if (
        snappingRef.current ||
        isNavigating ||
        cooldownRef.current > Date.now()
      )
        return;

      const dy = e.deltaY;
      if (Math.abs(dy) < MIN_DELTA) return; // min eşik

      e.preventDefault();

      const { pct } = getScrollInfo();
      const dir = dy > 0 ? "next" : "prev";
      const target = nearestStep(pct, dir);

      snappingRef.current = true;
      cooldownRef.current = Date.now() + COOLDOWN_MS;
      scrollToPct(target, "smooth");

      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        snappingRef.current = false;
      }, COOLDOWN_MS + 100);
    };

    const onKey = (e: KeyboardEvent) => {
      if (
        snappingRef.current ||
        isNavigating ||
        cooldownRef.current > Date.now()
      )
        return;

      const keysNext = ["PageDown", " ", "ArrowDown"];
      const keysPrev = ["PageUp", "ArrowUp"];

      if (![...keysNext, ...keysPrev].includes(e.key)) return;

      e.preventDefault();
      const { pct } = getScrollInfo();
      const dir = keysNext.includes(e.key) ? "next" : "prev";
      const target = nearestStep(pct, dir);

      snappingRef.current = true;
      cooldownRef.current = Date.now() + COOLDOWN_MS;
      scrollToPct(target, "smooth");
      setTimeout(() => (snappingRef.current = false), COOLDOWN_MS + 100);
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (
        snappingRef.current ||
        isNavigating ||
        cooldownRef.current > Date.now()
      )
        return;
      if (lastTouchYRef.current == null) return;

      const dy = lastTouchYRef.current - e.touches[0].clientY;
      if (Math.abs(dy) < 28) return; // küçük kaydırmaları yok say

      e.preventDefault();

      const { pct } = getScrollInfo();
      const dir = dy > 0 ? "next" : "prev";
      const target = nearestStep(pct, dir);

      snappingRef.current = true;
      cooldownRef.current = Date.now() + COOLDOWN_MS;
      scrollToPct(target, "smooth");
      setTimeout(() => (snappingRef.current = false), COOLDOWN_MS + 120);
      lastTouchYRef.current = null;
    };

    // passive:false önemli — preventDefault için
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isNavigating]);

  // Üst logoya tıklandığında hızlıca en başa dön
  const scrollToTop = () => {
    const overlay = document.createElement("div");
    overlay.className = "fade-overlay";
    overlay.style.cssText = `
      position: fixed; inset: 0; background: black; z-index: 9999;
      opacity: 0; transition: opacity 0.4s ease-in-out; pointer-events: none;
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => (overlay.style.opacity = "1"));
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      overlay.style.opacity = "0";
      setTimeout(() => document.body.removeChild(overlay), 400);
    }, 400);
  };

  // Proje kısayolları
  const scrollToProject = (projectId: number) => {
    const map: Record<number, number> = { 1: 0.83, 2: 0.87, 3: 0.91, 4: 0.95 };
    const pct = map[projectId] ?? 0.83;

    setIsNavigating(true);
    setTargetProject(projectId);
    document.body.classList.add("direct-navigation");

    scrollToPct(pct, "smooth");

    setTimeout(() => {
      document.body.classList.remove("direct-navigation");
      setIsNavigating(false);
      setTargetProject(null);
    }, 900);
  };

  const navigationProps = { isNavigating, targetProject };

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* SABİT SAHNE */}
      <div
        className={`stage fixed inset-0 z-[1] ${
          isNavigating ? "navigating" : ""
        }`}
        style={{ fontFamily: "Figtree, sans-serif" }}
      >
        <HeroSection scrollToTop={scrollToTop} />
        <ImageGallerySection
          scrollToProject={scrollToProject}
          navigationProps={navigationProps}
        />
        <HeaderBackground />
        <FeaturedProjectStory navigationProps={navigationProps} />
      </div>

      {/* SCROLL PROXY */}
      <div
        className="scroll-proxy relative z-0"
        style={{
          height: `${SCROLL_PROXY_VH}vh`,
          background: "linear-gradient(180deg,#111827,#0b0b0b)",
        }}
      />

      <style jsx global>{`
        html,
        body {
          height: 100%;
          margin: 0;
          overscroll-behavior: none;
          background: #0b0b12;
        }
        /* Snap hissi için overscroll kapalı; stage pointer-events yönetimi aynen */
        .stage .featured-hero {
          pointer-events: auto;
        }
        .nav-menu,
        .title-card-1,
        .title-card-2,
        .title-card-3,
        .title-card-4,
        .project-titles-container,
        .company-title {
          pointer-events: auto;
        }

        body.direct-navigation .hero-slide,
        body.direct-navigation .hero-copy {
          animation: none !important;
          transition: opacity 0.6s ease-in-out !important;
        }
        body.direct-navigation .title-card-1 .title-content,
        body.direct-navigation .title-card-2 .title-content,
        body.direct-navigation .title-card-3 .title-content,
        body.direct-navigation .title-card-4 .title-content {
          animation: none !important;
          animation-timeline: none !important;
          animation-range: none !important;
        }

        .stage.navigating::after {
          content: "";
          position: fixed;
          inset: 0;
          background: black;
          opacity: 0;
          animation: navigation-fade 0.8s ease-in-out;
          pointer-events: none;
          z-index: 100;
        }
        @keyframes navigation-fade {
          0% {
            opacity: 0;
          }
          40% {
            opacity: 0.7;
          }
          60% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
