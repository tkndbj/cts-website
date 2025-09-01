interface HeroSectionProps {
  scrollToTop: () => void;
}

export default function HeroSection({ scrollToTop }: HeroSectionProps) {
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
            poster="/video-poster.jpg" // Add a poster image for loading state
          >
            {/* Provide multiple sources for better browser compatibility */}
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

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .video-background {
            /* Use lower quality video on mobile */
            object-position: center center;
          }
        }
      `}</style>
    </>
  );
}
