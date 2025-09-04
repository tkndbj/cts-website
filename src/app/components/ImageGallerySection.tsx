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
    title: "Modern Mimari",
    subtitle: "Geleceğin Yapıları",
    description: "40 yıllık deneyimimizle, en son teknolojileri kullanarak hayallerinizdeki projeleri gerçeğe dönüştürüyoruz."
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
    title: "Ticari Projeler",
    subtitle: "İş Dünyası İçin",
    description: "İşinizi büyütecek, markanızı yansıtacak ticari alanlar yaratıyoruz."
  },
  {
    id: 4,
    image: "/carob.jpg",
    title: "Sürdürülebilir Yapılar",
    subtitle: "Çevre Dostu Tasarımlar",
    description: "Doğayla uyumlu, enerji verimli ve sürdürülebilir projeler geliştiriyoruz."
  }
];

export default function ImageGallerySection({
  scrollToProject,
  navigationProps,
  onBackToHero,
}: ImageGallerySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentMobileSection, setCurrentMobileSection] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Auto-play slider (desktop only)
  useEffect(() => {
    if (isAutoPlaying && !isMobile) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length);
      }, 5000);
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isAutoPlaying, currentSlide, isMobile]);

  // Handle mobile horizontal scroll
  useEffect(() => {
    if (isMobile && mobileContainerRef.current) {
      const handleScroll = () => {
        const scrollLeft = mobileContainerRef.current?.scrollLeft || 0;
        const sectionWidth = window.innerWidth;
        const newSection = Math.round(scrollLeft / sectionWidth);
        setCurrentMobileSection(newSection);
      };

      mobileContainerRef.current.addEventListener('scroll', handleScroll);
      return () => {
        mobileContainerRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMobile]);

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

  const scrollToMobileSection = (section: number) => {
    if (mobileContainerRef.current) {
      const sectionWidth = window.innerWidth;
      mobileContainerRef.current.scrollTo({
        left: section * sectionWidth,
        behavior: 'smooth'
      });
    }
  };

  // Mobile Horizontal Layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white">
        <div 
          ref={mobileContainerRef}
          className="h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Section 1: Hero Slider */}
          <div className="flex-shrink-0 w-screen h-full snap-start relative">
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

                  <div className="relative h-full flex flex-col justify-end pb-20 px-6">
                    <span className="text-[#87CEEB] text-sm font-semibold tracking-wider uppercase mb-2">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-3xl font-bold text-white mb-3">
                      {slide.title}
                    </h1>
                    <p className="text-base text-gray-200 mb-6">
                      {slide.description}
                    </p>
                    
                    {index === 0 && (
                      <button
                        onClick={() => scrollToMobileSection(1)}
                        className="inline-flex items-center justify-center gap-2 bg-[#191970] text-white px-6 py-3 rounded-full font-semibold"
                      >
                        <span>Devam Et</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
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

          {/* Section 2: Company Info */}
          <div className="flex-shrink-0 w-screen h-full snap-start flex flex-col justify-center px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="text-center mb-8">
              <span className="text-[#191970] text-xs font-semibold tracking-wider uppercase mb-3 block">
                1984&apos;ten Beri
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ceyhun Tunalı <span className="text-[#191970]">&amp; Sons</span>
              </h2>
              <p className="text-base text-gray-600">
                40 yılı aşkın deneyimimizle, Kıbrıs&apos;ın en prestijli projelerine imza atıyoruz.
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-[#191970] to-[#4169E1] rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center text-white">
                <div>
                  <div className="text-2xl font-bold">40+</div>
                  <div className="text-xs opacity-80">Yıl</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">30+</div>
                  <div className="text-xs opacity-80">Proje</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs opacity-80">Memnuniyet</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToMobileSection(2)}
              className="w-full bg-[#191970] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <span>Özelliklerimiz</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Section 3: Features */}
          <div className="flex-shrink-0 w-screen h-full snap-start flex flex-col justify-center px-6 bg-white">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Neden Bizi Seçmelisiniz?
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "🏗️", title: "Modern Teknoloji", desc: "En son yapı teknolojileri" },
                { icon: "⭐", title: "Premium Kalite", desc: "Yüksek kaliteli malzemeler" },
                { icon: "👷", title: "Uzman Kadro", desc: "Deneyimli ekip" },
                { icon: "🌱", title: "Sürdürülebilir", desc: "Çevre dostu yapılar" }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollToMobileSection(3)}
              className="w-full bg-[#191970] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <span>İletişim</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Section 4: CTA & Contact */}
          <div className="flex-shrink-0 w-screen h-full snap-start flex flex-col justify-center px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Projeniz İçin Hazır mısınız?
              </h3>
              <p className="text-base text-gray-600 mb-6">
                Size özel çözümlerimizle tanışmak için hemen iletişime geçin.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <button
                onClick={() => scrollToProject(1)}
                className="w-full bg-[#191970] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <span>Projelerimizi İnceleyin</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <button
                onClick={onBackToHero}
                className="w-full border-2 border-[#191970] text-[#191970] py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Ana Sayfa</span>
              </button>
            </div>

            {/* Office Location */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Merkez Ofisimiz</h4>
                  <p className="text-xs text-gray-600">İskele, Kıbrıs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {[0, 1, 2, 3].map((section) => (
            <button
              key={section}
              onClick={() => scrollToMobileSection(section)}
              className={`transition-all duration-300 ${
                section === currentMobileSection
                  ? 'w-8 h-2 bg-[#191970]'
                  : 'w-2 h-2 bg-gray-400'
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop Vertical Scrollable Layout
  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Full Width Image Slider Banner */}
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

                  {/* CTA Buttons on First Slide */}
                  {index === 0 && currentSlide === 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <button
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        className="group inline-flex items-center justify-center gap-3 bg-[#191970] hover:bg-[#1e2050] text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
                      >
                        <span>Keşfet</span>
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none"
                          className="group-hover:translate-y-1 transition-transform"
                        >
                          <path
                            d="M12 5v14m0 0l7-7m-7 7l-7-7"
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
                        <span>Bize Ulaşın</span>
                      </button>
                    </div>
                  )}
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

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 5v14m0 0l7-7m-7 7l-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Content Section Below Banner - Scrollable */}
      <div className="py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Company Introduction */}
          <div className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <span className="inline-block text-[#191970] text-sm font-semibold tracking-wider uppercase mb-4">
              1984&apos;ten Beri
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ceyhun Tunalı <span className="text-[#191970]">&amp; Sons</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              40 yılı aşkın deneyimimizle, Kıbrıs&apos;ın en prestijli projelerine imza atıyoruz. 
              Modern mimari, kaliteli malzeme ve uzman kadromuzla hayallerinizi gerçeğe dönüştürüyoruz.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                icon: "🏗️",
                title: "Modern Teknoloji",
                description: "En son yapı teknolojileri ve yenilikçi çözümler"
              },
              {
                icon: "⭐",
                title: "Premium Kalite",
                description: "Yüksek kaliteli malzemeler ve işçilik garantisi"
              },
              {
                icon: "👷",
                title: "Uzman Kadro",
                description: "Deneyimli mimar ve mühendis ekibi"
              },
              {
                icon: "🌱",
                title: "Sürdürülebilir",
                description: "Çevre dostu ve enerji verimli yapılar"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#191970] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className={`bg-gradient-to-r from-[#191970] to-[#4169E1] rounded-3xl p-16 mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-6xl md:text-7xl font-bold text-white mb-2">40+</div>
                <div className="text-white/80 text-xl">Yıl Deneyim</div>
              </div>
              <div>
                <div className="text-6xl md:text-7xl font-bold text-white mb-2">30+</div>
                <div className="text-white/80 text-xl">Tamamlanan Proje</div>
              </div>
              <div>
                <div className="text-6xl md:text-7xl font-bold text-white mb-2">100%</div>
                <div className="text-white/80 text-xl">Müşteri Memnuniyeti</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Projeniz İçin Hazır mısınız?
            </h3>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Size özel çözümlerimizle tanışmak ve hayalinizdeki projeyi başlatmak için hemen iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToProject(1)}
                className="group inline-flex items-center justify-center gap-3 bg-[#191970] hover:bg-[#1e2050] text-white px-12 py-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
              >
                <span>Projelerimizi İnceleyin</span>
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
                className="inline-flex items-center justify-center gap-3 border-2 border-[#191970] hover:bg-[#191970] hover:text-white text-[#191970] px-12 py-6 rounded-xl font-semibold transition-all duration-300 text-lg"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Ana Sayfa</span>
              </button>
            </div>
          </div>

          {/* Office Location Card */}
          <div className={`bg-gray-50 rounded-3xl p-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-2xl flex items-center justify-center shadow-xl">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-3xl font-bold text-gray-900 mb-2">Merkez Ofisimiz</h4>
                <p className="text-xl text-gray-600">
                  İskele, Kıbrıs • 
                  <span className="text-[#191970] font-mono ml-2">35.322848, 33.963165</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
}