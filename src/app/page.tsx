"use client";

import { useEffect, useRef, useState } from "react";
import HeroSection from "./components/HeroSection";
import HeaderBackground from "./components/HeaderBackground";
import ImageGallerySection from "./components/ImageGallerySection";
import FeaturedProjectStory from "./components/FeaturedProjectStory";
import MobileNavigation from "./components/MobileNavigation";
import Image from "next/image";

export default function Home() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetProject, setTargetProject] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileProject, setMobileProject] = useState(1);
  const [mobileShowProjects, setMobileShowProjects] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const SCROLL_PROXY_VH = 700;
  const STEP_MARKS = [0, 0.7, 0.83, 0.87, 0.91, 0.95, 0.98];

  const snappingRef = useRef(false);
  const cooldownRef = useRef(0);
  const lastTouchYRef = useRef<number | null>(null);

  const projects = [
    {
      id: 1,
      image: "/fourseasons.jpg",
      title: "Four Seasons Life",
      description:
        "Çağdaş tasarım çözümleri ile geleceğin yapılarını inşa ediyoruz",
    },
    {
      id: 2,
      image: "/thesign.jpg",
      title: "The Sign",
      description: "Uzman ekibimiz ile her detayda mükemmellik arayışı",
    },
    {
      id: 3,
      image: "/aurora.jpg",
      title: "Aurora Bay",
      description: "Çevre dostu yapılar ile doğaya saygılı inşaat",
    },
    {
      id: 4,
      image: "/carob.jpg",
      title: "Carob Hill",
      description: "Zamanında teslimat ve müşteri memnuniyeti odaklı hizmet",
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isDesktop = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches;

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

  // Desktop scroll handling (unchanged)
  useEffect(() => {
    if (!isDesktop()) return;

    const MIN_DELTA = 28;
    const COOLDOWN_MS = 520;
    let wheelTimer: number | null = null;

    const onWheel = (e: WheelEvent) => {
      if (
        snappingRef.current ||
        isNavigating ||
        cooldownRef.current > Date.now()
      )
        return;
      const dy = e.deltaY;
      if (Math.abs(dy) < MIN_DELTA) return;
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
      if (Math.abs(dy) < 28) return;
      e.preventDefault();

      const { pct } = getScrollInfo();
      const dir = dy > 0 ? "next" : "prev";
      const target = nearestStep(pct, dir);
      snappingRef.current = true;
      cooldownRef.current = Date.now() + 520;
      scrollToPct(target, "smooth");
      setTimeout(() => (snappingRef.current = false), 520 + 120);
      lastTouchYRef.current = null;
    };

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

  const scrollToTop = () => {
    if (isMobile) {
      setMobileProject(1);
      setMobileShowProjects(false);
      return;
    }

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

  const handleMobileAdvance = () => {
    if (!isMobile) {
      scrollToPct(0.7, "smooth");
    } else {
      document.body.classList.add("mobile-second", "mobile-no-scroll");
      setMobileShowProjects(true);
    }
  };

  const handleMobileProjectSelect = (projectId: number) => {
    setMobileProject(projectId);
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <div
        className={`stage fixed inset-0 z-[1] ${
          isNavigating ? "navigating" : ""
        }`}
        style={{ fontFamily: "Figtree, sans-serif" }}
      >
        <HeroSection
          scrollToTop={scrollToTop}
          onTapAdvance={handleMobileAdvance}
        />

        {/* Desktop components */}
        <div className="hidden md:block">
          <ImageGallerySection
            scrollToProject={scrollToProject}
            navigationProps={navigationProps}
          />
          <HeaderBackground />
          <FeaturedProjectStory navigationProps={navigationProps} />
        </div>

        {/* Mobile project display */}
        {isMobile && mobileShowProjects && (
          <div className="mobile-projects fixed inset-0 z-45 pt-14 pb-20 bg-gray-900">
            <div className="h-full overflow-hidden">
              <div className="relative h-full">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`absolute inset-0 transition-all duration-500 ${
                      mobileProject === project.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="relative h-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="brightness-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24">
                        <h2 className="text-3xl font-bold text-orange-500 mb-3">
                          {project.title}
                        </h2>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <MobileNavigation
              projects={projects}
              currentProject={mobileProject}
              onProjectSelect={handleMobileProjectSelect}
            />
          </div>
        )}
      </div>

      {/* Desktop scroll proxy */}
      <div
        className="scroll-proxy relative z-0 hidden md:block"
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

        /* Mobile: Disable ALL scroll animations */
        @media (max-width: 767px) {
          .stage * {
            animation: none !important;
            animation-timeline: initial !important;
            animation-range: initial !important;
            scroll-behavior: auto !important;
          }

          body.mobile-no-scroll {
            overflow: hidden !important;
            height: 100vh !important;
          }

          body.mobile-second .video-container {
            display: none !important;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
