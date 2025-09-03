import { useEffect, useState } from "react";

export default function HeroSection({
  scrollToTop,
  onTapAdvance,
}: {
  scrollToTop: () => void;
  onTapAdvance: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePhase, setMobilePhase] = useState<"welcome" | "main">("welcome");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("mobile-second")) {
        setMobilePhase("main");
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Desktop/Tablet View - No header, just hero content
  if (!isMobile) {
    return (
      <>
        <div className="hero-container">
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

          {/* Main content - Always visible */}
          <div className="hero-content fixed inset-0 flex items-center justify-center">
            <div className="text-center relative z-10">
              <h1 className="company-title__h1 font-bold text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-8">
                <span className="block">Ceyhun Tunalı</span>
                <span className="text-orange-500">
                  &amp; Sons
                </span>
              </h1>
              
              <p className="subtitle text-2xl md:text-3xl text-gray-100 font-light tracking-wide mb-12">
                Hoşgeldiniz
              </p>

              <button
                onClick={onTapAdvance}
                className="advance-button inline-flex flex-col items-center gap-3 px-6 py-4 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="mouse-container flex flex-col items-center">
                  <div className="mouse w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="mouse-wheel w-1 h-3 bg-white rounded-full mt-2 animate-scroll"></div>
                  </div>
                </div>
                <span className="text-white text-sm font-light">İlerlemek için tıklayın</span>
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
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

          .hero-content {
            animation: fadeIn 0.8s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes scroll {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(5px);
            }
          }

          .mouse-wheel {
            animation: scroll 2s infinite;
          }

          .advance-button {
            cursor: pointer;
          }

          .advance-button:hover .mouse-wheel {
            animation-duration: 1s;
          }
        `}</style>
      </>
    );
  }

  // Mobile View (unchanged)
  return (
    <>
      {mobilePhase === "welcome" && (
        <div className="mobile-welcome fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
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

          <div className="relative z-10 text-center px-6">
            <h1 className="text-white font-bold leading-tight mobile-title animate-slideUp">
              <span className="block whitespace-nowrap">Ceyhun Tunalı</span>
              <span className="block text-orange-500">&amp; Sons</span>
            </h1>

            <button
              type="button"
              className="mt-6 inline-flex flex-col items-center gap-2 active:scale-95 transition animate-fadeInDelay"
              onClick={onTapAdvance}
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

      {mobilePhase === "main" && (
        <header className="mobile-header fixed top-0 left-0 right-0 h-14 z-50 bg-gray-900/95 backdrop-blur-md shadow-lg flex items-center justify-between px-3 animate-slideDown">
          <button
            className="text-white font-semibold text-sm tracking-tight flex items-center"
            onClick={scrollToTop}
            aria-label="Başa dön"
          >
            <span>Ceyhun Tunalı</span>
            <span className="text-orange-500 ml-1">&amp; Sons</span>
          </button>

          <div className="relative">
            <button
              aria-label="Menüyü aç"
              className="p-1.5 rounded-md border border-white/10 text-white"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                width="20"
                height="20"
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

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl bg-gray-800/95 backdrop-blur border border-white/10 shadow-xl overflow-hidden animate-fadeIn"
                onClick={() => setMenuOpen(false)}
              >
                <a
                  href="/aboutus"
                  className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10"
                >
                  Hakkımızda
                </a>
                <a
                  href="#projelerimiz"
                  className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10"
                >
                  Projelerimiz
                </a>
                <a
                  href="#iletisim"
                  className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10"
                >
                  İletişim
                </a>
              </div>
            )}
          </div>
        </header>
      )}

      <style jsx>{`
        .mobile-title {
          font-size: clamp(1.6rem, 7vw, 2rem);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes fadeInDelay {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeInDelay {
          animation: fadeInDelay 1s ease-out;
        }
      `}</style>
    </>
  );
}