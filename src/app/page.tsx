"use client";

import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import HeaderBackground from "./components/HeaderBackground";
// import ProjectDetailsSection from "./components/ProjectDetailsSection"; // ← GEÇİCİ: kapalı
import ImageGallerySection from "./components/ImageGallerySection";
import FeaturedProjectStory from "./components/FeaturedProjectStory";

export default function Home() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetProject, setTargetProject] = useState<number | null>(null);

  const scrollToTop = () => {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "fade-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: black;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.4s ease-in-out;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    // After fade in, jump to top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });

      // Fade out
      overlay.style.opacity = "0";

      // Remove overlay
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 400);
    }, 400);
  };

  // Uzun akış için büyük bir proxy. (0–100%)
  const SCROLL_PROXY_VH = 700;

  // Add these scroll functions for project navigation
  const scrollToProject = (projectId: number) => {
    // Get the actual height of the scroll proxy element
    const scrollProxy = document.querySelector(".scroll-proxy") as HTMLElement;
    if (!scrollProxy) return;

    // The actual height of the scroll proxy in pixels
    const scrollProxyHeight = scrollProxy.offsetHeight;

    // The viewport height
    const viewportHeight = window.innerHeight;

    // Maximum scrollable distance (total height - viewport height)
    const maxScroll = scrollProxyHeight - viewportHeight;

    let targetPercentage;

    switch (projectId) {
      case 1: // Four Seasons Life - starts at 82%
        targetPercentage = 0.83;
        break;
      case 2: // The Sign - starts at 86%
        targetPercentage = 0.87;
        break;
      case 3: // Aurora Bay - starts at 90%
        targetPercentage = 0.91;
        break;
      case 4: // Carob Hill - starts at 94%
        targetPercentage = 0.95;
        break;
      default:
        targetPercentage = 0.83;
    }

    // Calculate the scroll position
    const targetScrollPosition = targetPercentage * maxScroll;

    // Start navigation mode
    setIsNavigating(true);
    setTargetProject(projectId);

    // Add a class to body to disable scroll animations
    document.body.classList.add("direct-navigation");

    // Perform the scroll
    window.scrollTo({
      top: targetScrollPosition,
      behavior: "smooth",
    });

    // After scroll completes, remove navigation mode
    setTimeout(() => {
      document.body.classList.remove("direct-navigation");
      setIsNavigating(false);
      setTargetProject(null);
    }, 800); // Adjust timing as needed
  };

  // Pass navigation state to child components
  const navigationProps = {
    isNavigating,
    targetProject,
  };

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

        {/* 55–75% grid + başlıklar */}
        <ImageGallerySection
          scrollToProject={scrollToProject}
          navigationProps={navigationProps}
        />

        {/* 75–82% ikinci header arka planı */}
        <HeaderBackground />

        {/* 82–98% fullscreen proje hikayesi */}
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
        .stage {
          pointer-events: none;
        }
        .nav-menu,
        .title-card-1,
        .title-card-2,
        .title-card-3,
        .title-card-4,
        .transitioning-titles,
        .project-titles-container,
        .company-title {
          pointer-events: auto;
        }

        /* During direct navigation, disable scroll-timeline animations */
        body.direct-navigation .hero-slide,
        body.direct-navigation .hero-copy {
          animation: none !important;
          transition: opacity 0.6s ease-in-out !important;
        }

        /* Also disable title card highlight animations during navigation */
        body.direct-navigation .title-card-1 .title-content,
        body.direct-navigation .title-card-2 .title-content,
        body.direct-navigation .title-card-3 .title-content,
        body.direct-navigation .title-card-4 .title-content {
          animation: none !important;
          animation-timeline: none !important;
          animation-range: none !important;
        }

        /* Navigation overlay for smooth transition */
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
