interface HeroSectionProps {
  scrollToTop: () => void;
  onTapAdvance: () => void;
}

import { useEffect, useState } from "react";

export default function HeroSection({
  scrollToTop,
  onTapAdvance,
}: HeroSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePhase, setMobilePhase] = useState<"welcome" | "second">(
    "welcome"
  ); // sadece mobilde kullanılır
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Home, body'e mobile-second sınıfını ekliyor. Bu değişikliği local state'e de yansıt.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("mobile-second")) {
        setMobilePhase("second");
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ---- Masaüstü/Tablet (>=768px): Mevcut davranış aynen ----
  if (!isMobile) {
    return (
      <>
        <div className="hero-header fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
          {/* Video Background */}
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
            <div className="video-overlay absolute inset-0 bg-black/40 pointer-events-none"></div>
          </div>

          <div
            className="company-title cursor-pointer relative z-10"
            onClick={scrollToTop}
          >
            <h1 className="company-title__h1 font-bold text-white tracking-tight hover:text-orange-200 transition-colors duration-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              <span className="nowrap">Ceyhun Tunalı</span>
              <br />
              <span className="text-orange-500 hover:text-orange-400">
                &amp; Sons
              </span>
            </h1>
          </div>

          <p className="subtitle text-2xl md:text-3xl text-gray-100 font-light tracking-wide text-center relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Hoşgeldiniz
          </p>

          {/* Üst menü (masaüstü) */}
          <nav className="nav-menu flex items-center space-x-8 relative z-10">
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

          {/* Masaüstü scroll ikonu */}
          <div className="scroll-mouse absolute bottom-16 z-10 hidden md:block">
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
          .nowrap {
            white-space: nowrap;
          }
          .company-title__h1 {
            font-size: 3.75rem;
            line-height: 1.05;
          }
          @media (min-width: 768px) {
            .company-title__h1 {
              font-size: 6rem;
              line-height: 1.05;
            }
          }

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
          .nav-menu {
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
        `}</style>
      </>
    );
  }

  // ---- MOBİL (<=767px): Scroll animasyonu yok; iki safha ----
  return (
    <>
      {/* Safha A: Welcome / Video */}
      {mobilePhase === "welcome" && (
        <div className="mobile-welcome fixed inset-0 z-50 flex items-center justify-center">
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
            <div className="video-overlay absolute inset-0 bg-black/40 pointer-events-none" />
          </div>

          {/* Başlık (2 satır) */}
          <div className="relative z-10 text-center px-6">
            <h1 className="text-white font-bold leading-tight mobile-title">
              <span className="block whitespace-nowrap">Ceyhun Tunalı</span>
              <span className="block text-orange-500">&amp; Sons</span>
            </h1>

            {/* Tap to advance */}
            <button
              type="button"
              className="mt-6 inline-flex flex-col items-center gap-2 active:scale-95 transition"
              onClick={() => {
                setMobilePhase("second");
                onTapAdvance();
              }}
              aria-label="Devam etmek için dokunun"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 11v-1a3 3 0 1 1 6 0v4" />
                <path d="M8 13v-2a2 2 0 1 1 4 0v3" />
                <path d="M7 14v-1a1 1 0 1 1 2 0v2" />
                <path d="M6 15v-1a1 1 0 1 1 2 0v2" opacity=".6" />
                <path d="M12 22c4 0 7-3 7-7v-1a1 1 0 0 0-2 0v1" />
              </svg>
              <span className="text-white/90 text-sm font-light">Dokunun</span>
            </button>
          </div>
        </div>
      )}

      {/* Safha B: Main Header (logo solda, hamburger sağda) */}
      {mobilePhase === "second" && (
        <header className="mobile-header fixed top-0 left-0 right-0 h-16 z-50 bg-gray-900/95 backdrop-blur-md shadow-lg flex items-center justify-between px-4">
          {/* Logo / Başlık */}
          <button
            className="text-white font-semibold text-lg tracking-tight"
            onClick={scrollToTop}
            aria-label="Başa dön"
          >
            <span className="align-middle">Ceyhun Tunalı</span>{" "}
            <span className="text-orange-500 align-middle">&amp; Sons</span>
          </button>

          {/* Hamburger */}
          <div className="relative">
            <button
              aria-label="Menüyü aç"
              className="p-2 rounded-md border border-white/10 text-white"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Menü Paneli */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800/95 backdrop-blur border border-white/10 shadow-xl overflow-hidden"
                onClick={() => setMenuOpen(false)}
              >
                <a
                  href="/aboutus"
                  className="block px-4 py-3 text-white/90 hover:bg-white/10"
                >
                  Hakkımızda
                </a>
                <a
                  href="#projelerimiz"
                  className="block px-4 py-3 text-white/90 hover:bg-white/10"
                >
                  Projelerimiz
                </a>
                <a
                  href="#iletisim"
                  className="block px-4 py-3 text-white/90 hover:bg-white/10"
                >
                  İletişim
                </a>
              </div>
            )}
          </div>
        </header>
      )}

      <style jsx>{`
        /* --- Mobil özel stiller --- */
        .mobile-title {
          /* 2 satıra sığacak şekilde ölçek */
          font-size: clamp(1.8rem, 8.5vw, 2.4rem);
        }

        /* Varsayılan video odak */
        .video-background {
          object-position: center center;
        }

        /* Mobilde animasyon KAPALI (güvenli tarafta tekrar kapatalım) */
        .mobile-welcome,
        .mobile-header {
          /* sabit üst katmanlar; animasyon yok */
        }

        /* Menü dışına tıklayınca kapanması için: basit bir UX önerisi
           (istersen globalde bir overlay yönetimi de ekleyebilirsin) */
      `}</style>
    </>
  );
}
