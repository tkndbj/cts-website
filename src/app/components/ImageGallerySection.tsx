"use client";
import { useState, useEffect, useRef } from "react";

interface ImageGallerySectionProps {
  scrollToProject: (projectId: number) => void;
  navigationProps?: {
    isNavigating: boolean;
    targetProject: number | null;
  };
  onBackToHero?: () => void;
}

// Slider images data
const sliderData = [
  {
    id: 1,
    image: "/fourseasons.jpg",
    title: "Seçkin Projeler",
    subtitle: "Geleceğin Yapıları",
    description: "40 yıllık deneyimimizle, en ince detayları dikkate alarak hayallerinizi gerçeğe dönüştürüyoruz."
  },
  {
    id: 2,
    image: "/thesign.jpg",
    title: "Lüks Konutlar",
    subtitle: "Yaşam Alanlarınız",
    description: "Konfor ve estetiği bir araya getiren, modern yaşam alanları tasarlıyoruz."
  },
  {
    id: 3,
    image: "/aurora.jpg",
    title: "Yatırım Fırsatları",
    subtitle: "Geleceğiniz İçin",
    description: "Yatırım fırsatlarınızın en iyi şekilde yararlanması için tasarlıyoruz."
  },
  {
    id: 4,
    image: "/carob.jpg",
    title: "Sürdürülebilir Yapılar",
    subtitle: "Yapı Teknolojileri",
    description: "Doğayla uyumlu, enerji verimli ve sürdürülebilir projeler geliştiriyoruz."
  }
];

export default function ImageGallerySection({
  scrollToProject,
  navigationProps,
  onBackToHero,
}: ImageGallerySectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (isAutoPlaying) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length);
      }, 5000);
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isAutoPlaying, currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white">
        <div className="relative h-full">
          {sliderData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ${
                index === currentSlide 
                  ? 'opacity-100 z-10' 
                  : 'opacity-0 z-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
              </div>

              <div className="relative h-full flex flex-col justify-end pb-24 px-6">
                <span className="text-[#87CEEB] text-sm font-semibold tracking-wider uppercase mb-2">
                  {slide.subtitle}
                </span>
                <h1 className="text-3xl font-bold text-white mb-3">
                  {slide.title}
                </h1>
                <p className="text-base text-gray-200 mb-6">
                  {slide.description}
                </p>
                
                {/* CTA Buttons on every slide */}
                <div className="flex gap-3">
                  <button
                    onClick={() => scrollToProject(1)}
                    className="flex-1 bg-[#191970] text-white px-4 py-3 rounded-full font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Projelerimiz</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={onBackToHero}
                    className="flex-1 bg-white/20 backdrop-blur border border-white/40 text-white px-4 py-3 rounded-full font-semibold"
                  >
                    İletişim
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Slider Controls */}
          <div className="absolute bottom-8 left-6 right-6 flex justify-between items-center z-20">
            <div className="flex gap-2">
              {sliderData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50'
                  } rounded-full`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout - Only Slider
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slider Images */}
      {sliderData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100 z-10' 
              : 'opacity-0 scale-110 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex items-center justify-center">
            <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
              <div
                className={`transform transition-all duration-1000 delay-300 ${
                  index === currentSlide
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
              >
                {/* Subtitle */}
                <span className="inline-block text-[#87CEEB] text-sm md:text-base font-semibold tracking-wider uppercase mb-4">
                  {slide.subtitle}
                </span>

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
                  {slide.description}
                </p>

                {/* CTA Buttons on Every Slide */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button
                    onClick={() => scrollToProject(1)}
                    className="group inline-flex items-center justify-center gap-3 bg-[#191970] hover:bg-[#1e2050] text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
                  >
                    <span>Projelerimiz</span>
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={onBackToHero}
                    className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm border-2 border-white/40 hover:bg-white/30 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 text-lg"
                  >
                    <span>İletişim</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          className="text-white group-hover:-translate-x-1 transition-transform"
        >
          <path
            d="M15 19l-7-7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group"
        aria-label="Next slide"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          className="text-white group-hover:translate-x-1 transition-transform"
        >
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-16 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}