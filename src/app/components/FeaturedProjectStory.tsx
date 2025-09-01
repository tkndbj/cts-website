"use client";
import Image from "next/image";
import { useEffect } from "react";

interface NavigationProps {
  isNavigating: boolean;
  targetProject: number | null;
}

interface FeaturedProjectStoryProps {
  navigationProps?: NavigationProps;
}

export default function FeaturedProjectStory({
  navigationProps,
}: FeaturedProjectStoryProps) {
  const projects = [
    {
      id: 1,
      image: "/fourseasons.jpg",
      title: "FOUR SEASONS LIFE",
      description:
        "Çağdaş tasarım çözümleri ile geleceğin yapılarını inşa ediyoruz. Her mevsimin güzelliğini yaşayabileceğiniz modern yaşam alanları.",
    },
    {
      id: 2,
      image: "/thesign.jpg",
      title: "THE SIGN",
      description:
        "Uzman ekibimiz ile her detayda mükemmellik arayışı. Şehrin kalbinde prestijli yaşamın yeni adresi.",
    },
    {
      id: 3,
      image: "/aurora.jpg",
      title: "AURORA BAY",
      description:
        "Çevre dostu yapılar ile doğaya saygılı inşaat. Denizin kucakladığı huzurlu yaşam alanları.",
    },
    {
      id: 4,
      image: "/carob.jpg",
      title: "CAROB HILL",
      description:
        "Zamanında teslimat ve müşteri memnuniyeti odaklı hizmet. Tepenin zirvesinde lüks yaşamın adresi.",
    },
  ];

  useEffect(() => {
    if (navigationProps?.isNavigating && navigationProps?.targetProject) {
      // Force show target project during navigation
      const targetSlide = document.querySelector(
        `.hero-slide-${navigationProps.targetProject}`
      );
      const targetCopy = document.querySelector(
        `.hero-copy-${navigationProps.targetProject}`
      );

      if (targetSlide && targetCopy) {
        // Temporarily force visibility
        (targetSlide as HTMLElement).style.opacity = "1";
        (targetCopy as HTMLElement).style.opacity = "1";

        // Clean up after navigation
        setTimeout(() => {
          (targetSlide as HTMLElement).style.opacity = "";
          (targetCopy as HTMLElement).style.opacity = "";
        }, 900);
      }
    }
  }, [navigationProps?.isNavigating, navigationProps?.targetProject]);

  return (
    <>
      <div className="featured-hero fixed top-80px left-0 w-full h-[calc(100vh-80px)] z-[46] overflow-hidden pointer-events-none">
        {projects.map((p) => (
          <div key={p.id} className={`hero-slide hero-slide-${p.id}`}>
            <Image
              src={p.image}
              alt={p.title}
              fill
              priority={p.id === 1}
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/25 to-black/50" />
          </div>
        ))}
        {projects.map((p) => (
          <div key={p.id} className={`hero-copy hero-copy-${p.id}`}>
            <div className="px-[5%] text-left">
              <h2 className="text-5xl md:text-7xl font-extrabold text-orange-500 tracking-tight mb-4 drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]">
                {p.title}
              </h2>
              <p className="max-w-3xl text-white/95 text-lg md:text-2xl font-light leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .top-80px {
          top: 80px;
        }

        .hero-slide,
        .hero-copy {
          position: absolute;
          inset: 0;
          opacity: 0;
        }
        .hero-copy {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          transform: translateY(10px);
        }

        /* 82–98%: her proje için kesin dilimler, overlap yok */
        .hero-slide-1 {
          animation: slide-in linear both;
          animation-timeline: scroll(root);
          animation-range: 82% 86%;
        }
        .hero-copy-1 {
          animation: copy-in linear both;
          animation-timeline: scroll(root);
          animation-range: 82% 86%;
        }

        .hero-slide-2 {
          animation: slide-in linear both;
          animation-timeline: scroll(root);
          animation-range: 86% 90%;
        }
        .hero-copy-2 {
          animation: copy-in linear both;
          animation-timeline: scroll(root);
          animation-range: 86% 90%;
        }

        .hero-slide-3 {
          animation: slide-in linear both;
          animation-timeline: scroll(root);
          animation-range: 90% 94%;
        }
        .hero-copy-3 {
          animation: copy-in linear both;
          animation-timeline: scroll(root);
          animation-range: 90% 94%;
        }

        .hero-slide-4 {
          animation: slide-last linear both;
          animation-timeline: scroll(root);
          animation-range: 94% 98%;
        }
        .hero-copy-4 {
          animation: copy-last linear both;
          animation-timeline: scroll(root);
          animation-range: 94% 98%;
        }

        /* Arkaplan crossfade */
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: scale(1.02);
          }
          15% {
            opacity: 1;
            transform: scale(1);
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes slide-last {
          0% {
            opacity: 0;
            transform: scale(1.02);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 1;
          }
        }

        /* Metin giriş/çıkış - soldan gelir */
        @keyframes copy-in {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          25% {
            opacity: 1;
            transform: translateX(0);
          }
          75% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-100px);
          }
        }
        @keyframes copy-last {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          30% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* İsteğe bağlı: daha pürüzsüz */
        .hero-copy {
          will-change: transform, opacity;
        }

        .featured-hero {
          contain: layout paint;
          will-change: opacity, transform;
        }

        @media (max-width: 768px) {
          .hero-copy :global(h2) {
            font-size: 2.2rem;
          }
          .hero-copy :global(p) {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
