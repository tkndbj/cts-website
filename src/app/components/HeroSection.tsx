"use client";

import { useState } from "react";

interface HeroSectionProps {
  scrollToTop: () => void;
}

export default function HeroSection({ scrollToTop }: HeroSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="hero-header fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
        {/* Video Background Container */}
        <div className="video-container absolute inset-0 w-full h-full overflow-hidden">
          <video
            className="video-background absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/video-poster.jpg"
          >
            <source src="/video-compressed.webm" type="video/webm" />
            <source src="/video-compressed.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay */}
          <div className="video-overlay absolute inset-0 bg-black/40 pointer-events-none"></div>
        </div>

        <div
          className="company-title cursor-pointer relative z-10"
          onClick={scrollToTop}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight hover:text-orange-200 transition-colors duration-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            Ceyhun Tunalı
            <br />
            <span className="text-orange-500 hover:text-orange-400">
              & Sons
            </span>
          </h1>
        </div>

        <p className="subtitle text-2xl md:text-3xl text-gray-100 font-light tracking-wide text-center relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Hoşgeldiniz
        </p>

        {/* Desktop Navigation */}
        <nav className="nav-menu desktop-nav flex items-center space-x-8 relative z-10">
          <a
            href="/aboutus"
            className="text-white hover:text-orange-400 transition-colors text-lg font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            Hakkımızda
          </a>
          <a
            href="#projelerimiz"
            className="text-white hover:text-orange-400 transition-colors text-lg font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            Projelerimiz
          </a>
          <a
            href="#iletisim"
            className="text-white hover:text-orange-400 transition-colors text-lg font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            İletişim
          </a>
        </nav>

        {/* Mobile Navigation */}
        <div className="mobile-nav-container relative z-10">
          {/* Mobile Header Bar */}
          <div className="mobile-header-bar fixed top-0 left-0 w-full h-20 flex items-center justify-between px-4">
            <div
              className="mobile-company-title cursor-pointer"
              onClick={scrollToTop}
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Ceyhun Tunalı <span className="text-orange-500">& Sons</span>
              </h1>
            </div>

            <button
              className="hamburger-btn text-white hover:text-orange-400 transition-colors"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <div className={`hamburger-icon ${isMenuOpen ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Drawer */}
          <div className={`mobile-drawer ${isMenuOpen ? "open" : ""}`}>
            <div className="mobile-drawer-content">
              <nav className="mobile-nav-links">
                <a
                  href="/aboutus"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hakkımızda
                </a>
                <a
                  href="#projelerimiz"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projelerimiz
                </a>
                <a
                  href="#iletisim"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  İletişim
                </a>
              </nav>
            </div>
            <div
              className="mobile-drawer-overlay"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          </div>
        </div>

        <div className="scroll-mouse absolute bottom-16 z-10">
          <div className="mouse-container flex flex-col items-center">
            <div className="mouse w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="mouse-wheel w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
            <span className="scroll-text mt-4 text-white text-sm font-light">
              Kaydırın
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-header {
          animation: hero-to-header linear both;
          animation-timeline: scroll(root);
          animation-range: 0% 55%;
        }

        .video-container {
          animation: video-fade linear both;
          animation-timeline: scroll(root);
          animation-range: 0% 60%;
        }

        .video-overlay {
          animation: overlay-adjust linear both;
          animation-timeline: scroll(root);
          animation-range: 0% 60%;
        }

        .company-title {
          position: absolute;
          text-align: center;
          animation: title-to-left linear both;
          animation-timeline: scroll(root);
          animation-range: 0% 60%;
          transform-origin: center center;
        }

        .subtitle {
          position: absolute;
          top: 60%;
          left: 50%;
          transform: translateX(-50%);
          animation: subtitle-fade linear both;
          animation-timeline: scroll(root);
          animation-range: 0% 40%;
        }

        .desktop-nav {
          position: absolute;
          opacity: 0;
          animation: nav-appear linear both;
          animation-timeline: scroll(root);
          animation-range: 30% 60%;
        }

        .scroll-mouse {
          left: 50%;
          transform: translateX(-50%);
          animation: mouse-fade linear both;
          animation-timeline: scroll(root);
          animation-range: 0% 30%;
        }

        /* Mobile Navigation Styles */
        .mobile-nav-container {
          display: none;
        }

        .mobile-header-bar {
          opacity: 0;
          background: rgba(31, 41, 55, 0.95);
          backdrop-filter: blur(10px);
          animation: mobile-header-appear linear both;
          animation-timeline: scroll(root);
          animation-range: 30% 60%;
        }

        .hamburger-btn {
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .hamburger-icon {
          width: 24px;
          height: 18px;
          position: relative;
          transform: rotate(0deg);
          transition: 0.3s ease-in-out;
        }

        .hamburger-icon span {
          display: block;
          position: absolute;
          height: 2px;
          width: 100%;
          background: currentColor;
          border-radius: 2px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: 0.25s ease-in-out;
        }

        .hamburger-icon span:nth-child(1) {
          top: 0px;
        }

        .hamburger-icon span:nth-child(2) {
          top: 8px;
        }

        .hamburger-icon span:nth-child(3) {
          top: 16px;
        }

        .hamburger-icon.open span:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }

        .hamburger-icon.open span:nth-child(2) {
          opacity: 0;
          left: -60px;
        }

        .hamburger-icon.open span:nth-child(3) {
          top: 8px;
          transform: rotate(-135deg);
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          height: 100vh;
          transition: right 0.3s ease-in-out;
          z-index: 1000;
        }

        .mobile-drawer.open {
          right: 0;
        }

        .mobile-drawer-content {
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          height: 100%;
          background: rgba(31, 41, 55, 0.98);
          backdrop-filter: blur(20px);
          padding: 80px 32px 32px;
        }

        .mobile-drawer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% - 280px);
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mobile-nav-link {
          color: white;
          text-decoration: none;
          font-size: 18px;
          font-weight: 500;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: color 0.3s ease;
        }

        .mobile-nav-link:hover {
          color: #fb923c;
        }

        @keyframes hero-to-header {
          0% {
            height: 100vh;
            background: transparent;
          }
          100% {
            height: 80px;
            background: rgba(31, 41, 55, 0.95);
            backdrop-filter: blur(10px);
          }
        }

        @keyframes video-fade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        @keyframes overlay-adjust {
          0% {
            background: rgba(0, 0, 0, 0.4);
          }
          100% {
            background: rgba(0, 0, 0, 0.8);
          }
        }

        @keyframes title-to-left {
          0% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            text-align: center;
          }
          100% {
            top: 40px;
            left: 2rem;
            transform: translate(0, -50%) scale(0.3);
            text-align: left;
          }
        }

        @keyframes subtitle-fade {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
        }

        @keyframes nav-appear {
          0% {
            opacity: 0;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) translateY(20px);
          }
          100% {
            opacity: 1;
            top: 40px;
            left: 50%;
            transform: translate(-50%, -50%) translateY(0);
          }
        }

        @keyframes mobile-header-appear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes mouse-fade {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .company-title h1 {
            font-size: 3rem; /* Smaller text for mobile */
            line-height: 1.1;
          }

          .desktop-nav {
            display: none !important;
          }

          .mobile-nav-container {
            display: block !important;
          }

          .video-background {
            object-position: center center;
          }

          /* Mobile title positioning */
          @keyframes title-to-left {
            0% {
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) scale(1);
              text-align: center;
            }
            100% {
              top: 40px;
              left: 1rem;
              transform: translate(0, -50%) scale(0.25);
              text-align: left;
            }
          }
        }

        @media (max-width: 480px) {
          .company-title h1 {
            font-size: 2.5rem;
          }

          .mobile-drawer-content {
            width: 100vw;
          }

          .mobile-drawer-overlay {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
